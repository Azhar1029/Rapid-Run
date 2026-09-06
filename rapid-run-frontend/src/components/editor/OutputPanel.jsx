import React, { useRef, useEffect, useState } from 'react'
import { TerminalSquare, ClipboardCopy, Trash2, ChevronDown, AlertCircle, CheckCircle, Clock, Keyboard } from 'lucide-react'
import toast from 'react-hot-toast'

export default function OutputPanel({ output, running, stdin, onStdinChange, lang }) {
  const [showStdin, setShowStdin] = useState(false)
  const outputRef = useRef(null)

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
  }, [output])

  const copyOutput = () => {
    const text = output?.stdout || output?.stderr || output?.error || ''
    if (!text) return toast.error('Nothing to copy')
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const getStatusBadge = () => {
    if (running) return { label:'Running', color:'var(--yellow)', bg:'var(--yellow-dim)' }
    if (!output)  return null
    if (output.status === 'running') return { label:'Running', color:'var(--yellow)', bg:'var(--yellow-dim)' }
    if (output.error) return { label:'Error', color:'var(--red)', bg:'var(--red-dim)' }
    if (output.stderr && !output.stdout) return { label:'Error', color:'var(--red)', bg:'var(--red-dim)' }
    return { label:'Success', color:'var(--green)', bg:'var(--green-dim)' }
  }

  const badge = getStatusBadge()

  return (
    <div style={s.panel}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <TerminalSquare size={14} style={{ color:'var(--accent)' }}/>
          <span style={s.title}>Output</span>
          {badge && (
            <span style={{ ...s.badge, color:badge.color, background:badge.bg }}>
              {badge.label}
            </span>
          )}
          {output?.elapsed && (
            <span style={s.elapsed}><Clock size={11}/>{output.elapsed}s</span>
          )}
        </div>
        <div style={{ display:'flex', gap:4 }}>
          <button className="btn-icon" title="Input (stdin)" style={{ color: showStdin ? 'var(--accent)' : 'var(--text-muted)' }}
            onClick={() => setShowStdin(p=>!p)}>
            <Keyboard size={15}/>
          </button>
          <button className="btn-icon" title="Copy output" onClick={copyOutput}>
            <ClipboardCopy size={15}/>
          </button>
          <button className="btn-icon" title="Clear output"
            onClick={() => { /* clear handled by parent */ }}>
            <Trash2 size={15}/>
          </button>
        </div>
      </div>

      {/* Stdin area */}
      {showStdin && (
        <div style={s.stdinWrap} className="animate-slideDown">
          <div style={s.stdinHeader}>
            <Keyboard size={12} style={{ color:'var(--text-muted)' }}/>
            <span style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>stdin (program input)</span>
          </div>
          <textarea style={s.stdinArea} placeholder="Type your program's input here..."
            value={stdin} onChange={e => onStdinChange(e.target.value)} rows={3}
            spellCheck={false}/>
        </div>
      )}

      {/* Output content */}
      <div style={s.content} ref={outputRef}>
        {/* Empty state */}
        {!output && !running && (
          <div style={s.empty}>
            <div style={{ fontSize:36, opacity:0.25, marginBottom:10 }}>▶</div>
            <p style={{ color:'var(--text-muted)', fontSize:12, fontFamily:'var(--font-mono)', textAlign:'center', lineHeight:1.8 }}>
              Click <strong style={{ color:'var(--accent)' }}>Run</strong> to execute your code<br/>
              <span style={{ opacity:0.6 }}>Ctrl+Enter shortcut available</span>
            </p>
          </div>
        )}

        {/* Running */}
        {running && (
          <div style={s.running}>
            <span style={s.spinner} className="animate-spin"/>
            <span style={{ fontSize:13, color:'var(--yellow)', fontFamily:'var(--font-mono)' }}>Executing...</span>
          </div>
        )}

        {/* Output */}
        {!running && output && output.status !== 'running' && (
          <div style={{ padding:'12px 16px', height:'100%', overflow:'auto' }}>
            {/* Stdout */}
            {output.stdout && (
              <div style={s.section}>
                <div style={s.sectionLabel}>
                  <CheckCircle size={12} style={{ color:'var(--green)' }}/> stdout
                </div>
                <pre style={s.pre}>{output.stdout}</pre>
              </div>
            )}

            {/* Stderr */}
            {output.stderr && (
              <div style={s.section}>
                <div style={s.sectionLabel}>
                  <AlertCircle size={12} style={{ color:'var(--red)' }}/> stderr
                </div>
                <pre style={{ ...s.pre, color:'var(--red)' }}>{output.stderr}</pre>
              </div>
            )}

            {/* Error */}
            {output.error && (
              <div style={s.section}>
                <div style={s.sectionLabel}>
                  <AlertCircle size={12} style={{ color:'var(--red)' }}/> error
                </div>
                <pre style={{ ...s.pre, color:'var(--red)' }}>{output.error}</pre>
              </div>
            )}

            {/* Nothing printed */}
            {!output.stdout && !output.stderr && !output.error && (
              <p style={{ color:'var(--text-muted)', fontSize:12, fontFamily:'var(--font-mono)', fontStyle:'italic', padding:'8px 0' }}>
                Program exited with no output.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  panel:       { height:'100%', display:'flex', flexDirection:'column', background:'var(--bg-base)', borderLeft:'1px solid var(--border)', overflow:'hidden' },
  header:      { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 12px', height:40, borderBottom:'1px solid var(--border)', flexShrink:0, background:'var(--bg-surface)' },
  headerLeft:  { display:'flex', alignItems:'center', gap:8 },
  title:       { fontSize:12, fontWeight:600, color:'var(--text-secondary)', letterSpacing:'0.05em', textTransform:'uppercase' },
  badge:       { fontSize:10, fontFamily:'var(--font-mono)', padding:'2px 8px', borderRadius:10, fontWeight:600 },
  elapsed:     { display:'flex', alignItems:'center', gap:3, fontSize:11, color:'var(--text-muted)', fontFamily:'var(--font-mono)' },
  stdinWrap:   { flexShrink:0, borderBottom:'1px solid var(--border)', background:'var(--bg-elevated)' },
  stdinHeader: { display:'flex', alignItems:'center', gap:6, padding:'6px 12px 0' },
  stdinArea:   { width:'100%', background:'transparent', border:'none', outline:'none', resize:'none', padding:'6px 12px 8px', fontFamily:'var(--font-mono)', fontSize:12, color:'var(--text-primary)', lineHeight:1.6 },
  content:     { flex:1, overflow:'hidden', position:'relative' },
  empty:       { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%' },
  running:     { display:'flex', alignItems:'center', gap:12, padding:20 },
  spinner:     { display:'inline-block', width:16, height:16, border:'2px solid var(--yellow-dim)', borderTopColor:'var(--yellow)', borderRadius:'50%' },
  section:     { marginBottom:16 },
  sectionLabel:{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'var(--text-muted)', marginBottom:6, fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.04em' },
  pre:         { fontFamily:'var(--font-mono)', fontSize:13, color:'var(--text-primary)', whiteSpace:'pre-wrap', wordBreak:'break-word', lineHeight:1.7, margin:0 },
}
