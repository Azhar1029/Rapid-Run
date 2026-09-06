import React, { useState, useRef, useEffect } from 'react'
import { useProjects } from '../../context/ProjectContext'
import { detectLanguage, LANGUAGE_CONFIG } from '../../utils/languages'
import { Pencil, Trash2, X, Check, Plus, MoreHorizontal } from 'lucide-react'
import toast from 'react-hot-toast'

const FILE_EXTS = [
  { label: 'Java',   ext: '.java', icon: '☕', color: '#ff9f43' },
  { label: 'C',      ext: '.c',    icon: '⚙',  color: '#5b8dee' },
  { label: 'C++',    ext: '.cpp',  icon: '⚡', color: '#b06cff' },
  { label: 'Python', ext: '.py',   icon: '🐍', color: '#ffd166' },
]

export default function FileTree({ project, projectId, activeFileId, onSelectFile }) {
  const { createFile, renameFile, deleteFile } = useProjects()

  const [showNewFile,   setShowNewFile]   = useState(false)
  const [newFileName,   setNewFileName]   = useState('')
  const [newFileExt,    setNewFileExt]    = useState('.java')
  const [creatingFile,  setCreatingFile]  = useState(false)
  const [renamingId,    setRenamingId]    = useState(null)
  const [renameVal,     setRenameVal]     = useState('')
  const [menuFileId,    setMenuFileId]    = useState(null)
  const [menuPos,       setMenuPos]       = useState({ x: 0, y: 0 })
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [hoveredId,     setHoveredId]     = useState(null)

  const menuRef    = useRef(null)
  const newFileRef = useRef(null)
  const files      = project?.files || []

  useEffect(() => {
    const close = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuFileId(null)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  useEffect(() => {
    if (showNewFile) setTimeout(() => newFileRef.current?.focus(), 50)
  }, [showNewFile])

  const openMenu = (e, fileId) => {
    e.stopPropagation()
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    setMenuPos({ x: rect.left, y: rect.bottom + 4 })
    setMenuFileId(fileId)
  }

  const handleCreate = async e => {
    e?.preventDefault()
    const base = newFileName.trim()
    if (!base) return toast.error('Enter a filename')

    const hasExt   = /\.[a-zA-Z]+$/.test(base)
    const fullName = hasExt ? base : base + newFileExt
    const ext      = '.' + fullName.split('.').pop().toLowerCase()

    if (!['.java', '.c', '.cpp', '.py'].includes(ext))
      return toast.error('Use .java .c .cpp or .py')
    if (files.find(f => f.name.toLowerCase() === fullName.toLowerCase()))
      return toast.error('File already exists')

    setCreatingFile(true)
    try {
      const file = await createFile(projectId, fullName)
      toast.success(`${fullName} created`)
      setNewFileName('')
      setShowNewFile(false)
      // Auto-select the newly created file
      if (file?.id) onSelectFile(file.id)
    } catch (err) {
      console.error('Create file error:', err)
      toast.error(err.response?.data?.message || 'Failed to create file')
    } finally {
      setCreatingFile(false)
    }
  }

  const handleRename = async (e, fileId) => {
    e?.preventDefault()
    const base = renameVal.trim()
    if (!base) return toast.error('Name cannot be empty')
    const hasExt   = /\.[a-zA-Z]+$/.test(base)
    const orig     = files.find(f => f.id === fileId)
    const origExt  = orig ? '.' + orig.name.split('.').pop() : '.java'
    const fullName = hasExt ? base : base + origExt
    if (files.find(f => f.id !== fileId && f.name.toLowerCase() === fullName.toLowerCase()))
      return toast.error('File already exists')
    try {
      await renameFile(projectId, fileId, fullName)
      toast.success('File renamed')
    } catch (err) {
      toast.error('Failed to rename file')
    } finally { setRenamingId(null) }
  }

  const handleDelete = async fileId => {
    try {
      await deleteFile(projectId, fileId)
      toast.success('File deleted')
      if (activeFileId === fileId) onSelectFile(files.find(f => f.id !== fileId)?.id || null)
    } catch (err) {
      toast.error('Failed to delete file')
    } finally { setDeleteConfirm(null); setMenuFileId(null) }
  }

  return (
    <div style={s.tree}>
      {/* ── Header ── */}
      <div style={s.header}>
        <span style={s.headerTitle}>📁 {project.name}</span>
        <button style={s.addBtn} title="New File" onClick={() => setShowNewFile(p => !p)}>
          <Plus size={15} />
        </button>
      </div>

      {/* ── New file form ── */}
      {showNewFile && (
        <div style={s.newFileBox} className="animate-slideDown">
          <div style={s.extRow}>
            {FILE_EXTS.map(f => (
              <button key={f.ext} type="button" onClick={() => setNewFileExt(f.ext)}
                style={{
                  flex: 1, padding: '4px 2px', fontSize: 10, borderRadius: 4,
                  border: '1px solid', cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: 'var(--font-mono)',
                  borderColor: newFileExt === f.ext ? f.color : 'var(--border)',
                  background:  newFileExt === f.ext ? f.color + '22' : 'transparent',
                  color:       newFileExt === f.ext ? f.color : 'var(--text-muted)',
                }}>
                {f.icon} {f.label}
              </button>
            ))}
          </div>
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: 4 }}>
            <input ref={newFileRef} className="input"
              style={{ padding: '5px 8px', fontSize: 12, fontFamily: 'var(--font-mono)', flex: 1 }}
              placeholder={`filename${newFileExt}`}
              value={newFileName} onChange={e => setNewFileName(e.target.value)}
              onKeyDown={e => e.key === 'Escape' && (setShowNewFile(false), setNewFileName(''))}
              disabled={creatingFile} />
            <button type="submit" className="btn-icon" style={{ color: 'var(--green)' }}
              disabled={creatingFile}>
              {creatingFile
                ? <span style={s.spinner} className="animate-spin"/>
                : <Check size={15} />}
            </button>
            <button type="button" className="btn-icon"
              onClick={() => { setShowNewFile(false); setNewFileName('') }}
              disabled={creatingFile}>
              <X size={15} />
            </button>
          </form>
        </div>
      )}

      {/* ── File list ── */}
      <div style={s.fileList}>
        {files.length === 0 && !showNewFile && (
          <div style={s.noFiles}>
            <div style={{ fontSize: 28, opacity: 0.3, marginBottom: 8 }}>📂</div>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', lineHeight: 1.7 }}>
              No files yet.<br />
              Click <strong style={{ color: 'var(--accent)' }}>+</strong> above to create one.
            </p>
          </div>
        )}

        {files.map(file => {
          const isActive   = file.id === activeFileId
          const isRenaming = renamingId === file.id
          const isHovered  = hoveredId === file.id
          const lang       = detectLanguage(file.name)
          const cfg        = LANGUAGE_CONFIG[lang]
          const icon       = cfg?.icon || '📄'

          return (
            <div key={file.id}
              style={{
                ...s.fileRow,
                background: isActive ? 'var(--bg-hover)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              }}
              onClick={() => !isRenaming && onSelectFile(file.id)}
              onMouseEnter={() => setHoveredId(file.id)}
              onMouseLeave={() => setHoveredId(null)}
              onContextMenu={e => openMenu(e, file.id)}>

              <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>

              {isRenaming ? (
                <form onSubmit={e => handleRename(e, file.id)}
                  onClick={e => e.stopPropagation()}
                  style={{ display: 'flex', gap: 4, flex: 1, minWidth: 0 }}>
                  <input className="input"
                    style={{ padding: '2px 6px', fontSize: 12, fontFamily: 'var(--font-mono)', flex: 1, minWidth: 0 }}
                    value={renameVal} onChange={e => setRenameVal(e.target.value)} autoFocus
                    onKeyDown={e => e.key === 'Escape' && setRenamingId(null)} />
                  <button type="submit" className="btn-icon" style={{ color: 'var(--green)', padding: 2 }}><Check size={13} /></button>
                  <button type="button" className="btn-icon" style={{ padding: 2 }} onClick={() => setRenamingId(null)}><X size={13} /></button>
                </form>
              ) : (
                <>
                  <span style={{ ...s.fileName, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {file.name}
                  </span>
                  <button className="btn-icon" title="File options"
                    onClick={e => openMenu(e, file.id)}
                    style={{
                      padding: '2px 4px', marginLeft: 'auto', flexShrink: 0,
                      visibility: (isHovered || isActive || menuFileId === file.id) ? 'visible' : 'hidden',
                      color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                    }}>
                    <MoreHorizontal size={15} />
                  </button>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Dropdown menu ── */}
      {menuFileId && (
        <div ref={menuRef} className="context-menu"
          style={{ top: menuPos.y, left: menuPos.x, position: 'fixed', zIndex: 999 }}>
          <button className="context-menu-item" onClick={() => {
            const f = files.find(f => f.id === menuFileId)
            setRenamingId(menuFileId)
            setRenameVal(f?.name || '')
            setMenuFileId(null)
          }}>
            <Pencil size={13} /> Rename
          </button>
          <div className="context-menu-divider" />
          <button className="context-menu-item danger" onClick={() => {
            setDeleteConfirm(menuFileId)
            setMenuFileId(null)
          }}>
            <Trash2 size={13} /> Delete
          </button>
        </div>
      )}

      {/* ── Delete confirm modal ── */}
      {deleteConfirm && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 360 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: 'var(--red-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={18} color="var(--red)" />
              </div>
              <h2 className="modal-title" style={{ marginBottom: 0 }}>Delete File?</h2>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Delete{' '}
              <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                "{files.find(f => f.id === deleteConfirm)?.name}"
              </strong>?{' '}
              This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  tree:       { height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-surface)', borderRight: '1px solid var(--border)', overflow: 'hidden' },
  header:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderBottom: '1px solid var(--border)', flexShrink: 0 },
  headerTitle:{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 },
  addBtn:     { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 3, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'color 0.15s' },
  newFileBox: { padding: '8px 10px', background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 },
  extRow:     { display: 'flex', gap: 4 },
  fileList:   { flex: 1, overflowY: 'auto', padding: '4px 0' },
  fileRow:    { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px 6px 10px', cursor: 'pointer', transition: 'background 0.15s', userSelect: 'none', minHeight: 32 },
  fileName:   { fontSize: 13, fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 },
  noFiles:    { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' },
  spinner:    { display: 'inline-block', width: 13, height: 13, border: '2px solid var(--green-dim)', borderTopColor: 'var(--green)', borderRadius: '50%' },
}