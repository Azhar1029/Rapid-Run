import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjects } from '../context/ProjectContext'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import MonacoEditor from '@monaco-editor/react'
import toast from 'react-hot-toast'
import { Zap, ChevronLeft, Play, Sun, Moon, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import FileTree from '../components/editor/FileTree'
import OutputPanel from '../components/editor/OutputPanel'
import EditorToolbar from '../components/editor/EditorToolbar'
import { detectLanguage, LANGUAGE_CONFIG } from '../utils/languages'
import { runCode } from '../services/executionService'

export default function EditorPage() {
  const { projectId }  = useParams()
  const { getProject, updateFileContent } = useProjects()
  const navigate = useNavigate()

  const project = getProject(projectId)

  const [activeFileId, setActiveFileId] = useState(null)
  const [sidebarOpen,  setSidebarOpen]  = useState(true)
  const [theme,        setTheme]        = useState('vs-dark')
  const [fontSize,     setFontSize]     = useState(14)
  const [running,      setRunning]      = useState(false)
  const [output,       setOutput]       = useState(null)
  const [stdin,        setStdin]        = useState('')
  const [saved,        setSaved]        = useState(true)
  const saveTimer = useRef(null)

  useEffect(() => {
    if (project?.files?.length > 0 && !activeFileId) {
      setActiveFileId(project.files[0].id)
    }
  }, [project?.id])

  if (!project) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg-base)', flexDirection:'column', gap:12 }}>
      <span style={{ fontSize:40 }}>🔍</span>
      <p style={{ color:'var(--text-secondary)' }}>Project not found.</p>
      <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>← Back</button>
    </div>
  )

  const activeFile = project.files?.find(f => f.id === activeFileId) || null
  const lang       = activeFile ? detectLanguage(activeFile.name) : null
  const langConfig = lang ? LANGUAGE_CONFIG[lang] : null

  const handleCodeChange = useCallback(val => {
    if (!activeFile) return
    setSaved(false)
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      updateFileContent(projectId, activeFile.id, val || '')
      setSaved(true)
    }, 800)
  }, [activeFile?.id, projectId])

  const handleManualSave = useCallback(() => {
    if (!activeFile) return
    clearTimeout(saveTimer.current)
    updateFileContent(projectId, activeFile.id, activeFile.content || '')
    setSaved(true)
    toast.success('Saved!', { duration:1500 })
  }, [activeFile, projectId])

  useEffect(() => {
    const handler = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleManualSave() }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRun() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleManualSave, activeFile])

  const handleRun = async () => {
    if (!activeFile) return toast.error('No file selected')
    if (!activeFile.content?.trim()) return toast.error('File is empty — write some code first!')
    const language = detectLanguage(activeFile.name)
    if (language === 'plaintext') return toast.error('Unsupported file type')
    setRunning(true)
    setOutput({ status:'running' })
    const start = Date.now()
    try {
      const res = await runCode(activeFile.content, language, stdin)
      setOutput({ ...res, elapsed: ((Date.now()-start)/1000).toFixed(2) })
    } catch (err) {
      setOutput({ error: err.message || 'Execution failed', elapsed:'0.00' })
    } finally { setRunning(false) }
  }

  return (
    <div style={s.page}>
      {/* ── Topbar ── */}
      <div style={s.topbar}>
        <div style={s.tbLeft}>
          <button style={s.backBtn} onClick={() => navigate('/dashboard')} title="Back to Dashboard">
            <ChevronLeft size={15}/><div style={s.logoIcon}><Zap size={13} color="#000" strokeWidth={3}/></div>
            <span style={s.logoTxt} className="font-display">Rapid Run</span>
          </button>
          <div style={s.sep}/>
          <span style={s.projName}>{project.name}</span>
          {activeFile && (
            <>
              <span style={{ color:'var(--text-muted)' }}>/</span>
              <span style={s.activeFileName}>
                {langConfig && <span>{langConfig.icon} </span>}
                {activeFile.name}
              </span>
            </>
          )}
          <div style={{ ...s.dot, background: saved ? 'var(--green)':'var(--yellow)' }} title={saved?'Saved':'Unsaved'}/>
        </div>

        <div style={s.tbRight}>
          {/* Theme */}
          <button className="btn-icon" title="Toggle theme" onClick={() => setTheme(t => t==='vs-dark'?'light':'vs-dark')}>
            {theme==='vs-dark' ? <Sun size={16}/> : <Moon size={16}/>}
          </button>

          {/* Font size */}
          <div style={s.fontCtrl}>
            <button style={s.fBtn} onClick={() => setFontSize(f=>Math.max(10,f-1))}>A-</button>
            <span style={s.fVal}>{fontSize}</span>
            <button style={s.fBtn} onClick={() => setFontSize(f=>Math.min(24,f+1))}>A+</button>
          </div>

          {/* Sidebar toggle */}
          <button className="btn-icon" onClick={() => setSidebarOpen(p=>!p)} title={sidebarOpen?'Hide sidebar':'Show sidebar'}>
            {sidebarOpen ? <PanelLeftClose size={17}/> : <PanelLeftOpen size={17}/>}
          </button>

          {/* Run */}
          <button className="btn-run" onClick={handleRun} disabled={running || !activeFile}>
            {running
              ? <><span style={s.runSpin} className="animate-spin"/>Running...</>
              : <><Play size={14} fill="currentColor"/>Run</>}
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex:1, overflow:'hidden' }}>
        <PanelGroup direction="horizontal" style={{ height:'100%' }}>

          {/* Sidebar */}
          {sidebarOpen && (
            <>
              <Panel defaultSize={18} minSize={12} maxSize={30}>
                <FileTree project={project} projectId={projectId}
                  activeFileId={activeFileId} onSelectFile={id => { setActiveFileId(id); setSaved(true) }}/>
              </Panel>
              <PanelResizeHandle style={s.handle}/>
            </>
          )}

          {/* Editor */}
          <Panel defaultSize={sidebarOpen ? 50 : 65} minSize={30} style={{ display:'flex', flexDirection:'column', overflow:'hidden' }}>
            {activeFile ? (
              <>
                <EditorToolbar file={activeFile} lang={lang} langConfig={langConfig}
                  onRun={handleRun} running={running} saved={saved} onSave={handleManualSave}/>
                <div style={{ flex:1 }}>
                  <MonacoEditor
                    height="100%"
                    language={langConfig?.monacoLang || 'plaintext'}
                    theme={theme}
                    value={activeFile.content || ''}
                    onChange={handleCodeChange}
                    options={{
                      fontSize, fontFamily:'JetBrains Mono, monospace',
                      minimap:{ enabled:false }, scrollBeyondLastLine:false,
                      lineNumbers:'on', renderLineHighlight:'gutter',
                      smoothScrolling:true, cursorBlinking:'smooth',
                      cursorSmoothCaretAnimation:'on', tabSize:4,
                      padding:{ top:16 }, bracketPairColorization:{ enabled:true },
                      automaticLayout:true, wordWrap:'off',
                    }}
                  />
                </div>
              </>
            ) : <EmptyEditor />}
          </Panel>

          <PanelResizeHandle style={s.handle}/>

          {/* Output */}
          <Panel defaultSize={32} minSize={18}>
            <OutputPanel output={output} running={running}
              stdin={stdin} onStdinChange={setStdin} lang={lang}
              onClear={() => setOutput(null)}/>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  )
}

function EmptyEditor() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', background:'var(--bg-base)', gap:12, textAlign:'center', padding:40 }}>
      <div style={{ fontSize:52, opacity:0.25 }}>💻</div>
      <h3 style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:700, color:'var(--text-muted)' }}>No file open</h3>
      <p style={{ color:'var(--text-muted)', fontSize:13, maxWidth:300, lineHeight:1.8 }}>
        Select a file from the sidebar or create a new one to start coding.
      </p>
      {[
        'Click + in the sidebar to create a file',
        'Right-click sidebar → New File',
        'Supports Java, C, C++, Python',
      ].map((t,i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'var(--text-muted)' }}>
          <span style={{ width:18, height:18, borderRadius:4, background:'var(--bg-elevated)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, flexShrink:0, fontFamily:'var(--font-mono)' }}>{i+1}</span>
          {t}
        </div>
      ))}
    </div>
  )
}

const s = {
  page:    { height:'100vh', display:'flex', flexDirection:'column', background:'var(--bg-base)', overflow:'hidden' },
  topbar:  { height:44, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 12px', borderBottom:'1px solid var(--border)', background:'var(--bg-surface)', flexShrink:0 },
  tbLeft:  { display:'flex', alignItems:'center', gap:8, flex:1, minWidth:0 },
  tbRight: { display:'flex', alignItems:'center', gap:8, flexShrink:0 },
  backBtn: { display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', padding:'4px 6px', borderRadius:6, color:'var(--text-secondary)', transition:'color 0.15s' },
  logoIcon:{ width:22, height:22, borderRadius:5, background:'linear-gradient(135deg,#00d4ff,#39d98a)', display:'flex', alignItems:'center', justifyContent:'center' },
  logoTxt: { fontSize:14, fontWeight:800, color:'var(--text-primary)' },
  sep:     { width:1, height:18, background:'var(--border)' },
  projName:{ fontSize:13, color:'var(--text-secondary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:120 },
  activeFileName:{ fontSize:13, color:'var(--text-primary)', fontFamily:'var(--font-mono)', whiteSpace:'nowrap' },
  dot:     { width:7, height:7, borderRadius:'50%', transition:'background 0.4s', flexShrink:0 },
  fontCtrl:{ display:'flex', alignItems:'center', background:'var(--bg-elevated)', borderRadius:6, padding:'2px 4px', border:'1px solid var(--border)' },
  fBtn:    { background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', padding:'2px 5px', fontSize:11, fontFamily:'var(--font-mono)', borderRadius:3 },
  fVal:    { fontSize:11, color:'var(--text-secondary)', fontFamily:'var(--font-mono)', minWidth:20, textAlign:'center' },
  handle:  { width:4, background:'var(--border)', cursor:'col-resize', transition:'background 0.2s', flexShrink:0 },
  runSpin: { display:'inline-block', width:13, height:13, border:'2px solid #00000044', borderTopColor:'#000', borderRadius:'50%' },
}
