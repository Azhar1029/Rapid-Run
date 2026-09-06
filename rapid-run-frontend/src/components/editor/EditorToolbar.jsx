import React from 'react'
import { Play, Save, FileCode } from 'lucide-react'

export default function EditorToolbar({ file, lang, langConfig, onRun, running, saved, onSave }) {
  if (!file) return null
  return (
    <div style={s.bar}>
      <div style={s.left}>
        <div style={{ ...s.langDot, background: langConfig?.color || 'var(--text-muted)' }}/>
        <span style={s.fileName} className="font-mono">{file.name}</span>
        <span style={{ ...s.langBadge, color: langConfig?.color || 'var(--text-muted)', background: (langConfig?.color || '#888') + '18' }}>
          {langConfig?.icon} {langConfig?.label || lang}
        </span>
      </div>
      <div style={s.right}>
        <span style={{ fontSize:11, color: saved ? 'var(--green)' : 'var(--yellow)', fontFamily:'var(--font-mono)', opacity:0.8 }}>
          {saved ? '● saved' : '● unsaved'}
        </span>
        <button className="btn-icon" title="Save (Ctrl+S)" onClick={onSave} style={{ color:'var(--text-muted)' }}>
          <Save size={14}/>
        </button>
      </div>
    </div>
  )
}

const s = {
  bar:       { height:34, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 12px', borderBottom:'1px solid var(--border)', background:'var(--bg-elevated)', flexShrink:0 },
  left:      { display:'flex', alignItems:'center', gap:8 },
  right:     { display:'flex', alignItems:'center', gap:6 },
  langDot:   { width:8, height:8, borderRadius:'50%', flexShrink:0 },
  fileName:  { fontSize:13, color:'var(--text-primary)', fontWeight:500 },
  langBadge: { fontSize:11, padding:'2px 8px', borderRadius:10, fontFamily:'var(--font-mono)', fontWeight:500 },
}
