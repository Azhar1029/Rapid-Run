import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProjects } from '../context/ProjectContext'
import {
  Zap, Plus, FolderOpen, MoreVertical, Pencil, Trash2,
  LogOut, Search, Code2, Clock, FolderPlus, X, Check
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user, logout }  = useAuth()
  const { projects, loading, createProject, renameProject, deleteProject } = useProjects()
  const navigate = useNavigate()

  const [search, setSearch]             = useState('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [newName, setNewName]           = useState('')
  const [creating, setCreating]         = useState(false)
  const [renamingId, setRenamingId]     = useState(null)
  const [renameVal, setRenameVal]       = useState('')
  const [deletingId, setDeletingId]     = useState(null)
  const [menuOpen, setMenuOpen]         = useState(null)
  const menuRef = useRef(null)

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const close = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(null) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const handleCreate = async e => {
    e.preventDefault()
    if (!newName.trim()) return toast.error('Project name cannot be empty')
    setCreating(true)
    try {
      const project = await createProject(newName.trim())
      toast.success(`Project "${newName.trim()}" created!`)
      setNewName('')
      setShowNewModal(false)
      navigate(`/editor/${project.id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project')
    } finally { setCreating(false) }
  }

  const handleRename = async (e, id) => {
    e.stopPropagation()
    if (!renameVal.trim()) return toast.error('Name cannot be empty')
    try {
      await renameProject(id, renameVal.trim())
      toast.success('Project renamed')
    } catch (err) {
      toast.error('Failed to rename')
    } finally { setRenamingId(null) }
  }

  const handleDelete = async id => {
    try {
      await deleteProject(id)
      toast.success('Project deleted')
    } catch (err) {
      toast.error('Failed to delete')
    } finally { setDeletingId(null); setMenuOpen(null) }
  }

  const openProject = id => navigate(`/editor/${id}`)

  const formatDate = ts => {
    if (!ts) return ''
    const d = new Date(ts)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div style={s.page}>
      {/* ── Navbar ── */}
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <div style={s.logoIcon}><Zap size={18} color="#000" strokeWidth={3}/></div>
          <span style={s.logoText} className="font-display">Rapid Run</span>
        </div>
        <div style={s.navRight}>
          <div style={s.userChip}>
            <div style={s.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
            <span style={s.userName}>{user?.name || 'Developer'}</span>
          </div>
          <button className="btn btn-ghost" style={{ gap: 6, padding: '7px 14px' }}
            onClick={() => { logout(); navigate('/login') }}>
            <LogOut size={14}/> Logout
          </button>
        </div>
      </nav>

      {/* ── Main ── */}
      <main style={s.main}>
        <div style={s.topRow}>
          <div>
            <h1 style={s.heading} className="font-display">My Projects</h1>
            <p style={s.headingSub}>{projects.length} project{projects.length !== 1 ? 's' : ''} in your workspace</p>
          </div>
          <button className="btn btn-primary" style={{ gap: 8 }} onClick={() => setShowNewModal(true)}>
            <FolderPlus size={16}/> New Project
          </button>
        </div>

        {projects.length > 0 && (
          <div style={s.searchWrap}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}/>
            <input className="input" style={{ paddingLeft: 36 }} placeholder="Search projects..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        )}

        {loading && (
          <div style={s.emptyState}>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading projects...</p>
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div style={s.emptyState} className="animate-fadeIn">
            <div style={s.emptyIcon}><Code2 size={40} color="var(--accent)" strokeWidth={1.5}/></div>
            <h2 style={s.emptyTitle} className="font-display">No projects yet</h2>
            <p style={s.emptySub}>Create your first project to start coding in Java, C, C++ or Python</p>
            <button className="btn btn-primary" style={{ gap: 8, marginTop: 8 }} onClick={() => setShowNewModal(true)}>
              <Plus size={16}/> Create your first project
            </button>
          </div>
        )}

        {!loading && projects.length > 0 && filtered.length === 0 && (
          <div style={{ ...s.emptyState, paddingTop: 60 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No projects match "{search}"</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div style={s.grid}>
            {filtered.map((proj, i) => (
              <div key={proj.id} style={s.card} className="animate-fadeIn"
                onClick={() => renamingId !== proj.id && openProject(proj.id)}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-bright)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>

                <div style={s.cardTop}>
                  <div style={{ ...s.cardIcon, background: PROJ_COLORS[i % PROJ_COLORS.length] }}>
                    <FolderOpen size={22} color="#fff"/>
                  </div>
                  <div style={{ marginLeft: 'auto', position: 'relative' }} ref={menuOpen === proj.id ? menuRef : null}>
                    <button className="btn-icon" onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === proj.id ? null : proj.id) }}>
                      <MoreVertical size={16}/>
                    </button>
                    {menuOpen === proj.id && (
                      <div style={s.dropdown} className="animate-fadeInScale">
                        <button style={s.dropItem} onClick={e => { e.stopPropagation(); setRenamingId(proj.id); setRenameVal(proj.name); setMenuOpen(null) }}>
                          <Pencil size={13}/> Rename
                        </button>
                        <div style={{ height: 1, background: 'var(--border)', margin: '3px 0' }}/>
                        <button style={{ ...s.dropItem, color: 'var(--red)' }} onClick={e => { e.stopPropagation(); setDeletingId(proj.id); setMenuOpen(null) }}>
                          <Trash2 size={13}/> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {renamingId === proj.id ? (
                  <form onSubmit={e => handleRename(e, proj.id)} onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    <input className="input" style={{ padding: '6px 10px', fontSize: 13 }}
                      value={renameVal} onChange={e => setRenameVal(e.target.value)}
                      autoFocus onKeyDown={e => e.key === 'Escape' && setRenamingId(null)}/>
                    <button type="submit" className="btn-icon" style={{ color: 'var(--green)' }}><Check size={15}/></button>
                    <button type="button" className="btn-icon" onClick={() => setRenamingId(null)}><X size={15}/></button>
                  </form>
                ) : (
                  <h3 style={s.cardName}>{proj.name}</h3>
                )}

                <div style={s.cardMeta}>
                  <Clock size={12}/>
                  <span>{formatDate(proj.createdAt)}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>
                    {proj.files?.length || 0} file{proj.files?.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── New Project Modal ── */}
      {showNewModal && (
        <div className="modal-backdrop" onClick={() => setShowNewModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 className="modal-title" style={{ marginBottom: 0 }}>New Project</h2>
              <button className="btn-icon" onClick={() => setShowNewModal(false)}><X size={18}/></button>
            </div>
            <form onSubmit={handleCreate}>
              <label style={s.modalLabel}>Project name</label>
              <input className="input" style={{ marginTop: 6 }} placeholder="e.g. My Java App"
                value={newName} onChange={e => setNewName(e.target.value)} autoFocus />
              <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowNewModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? 'Creating...' : <><Plus size={14}/> Create</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deletingId && (
        <div className="modal-backdrop" onClick={() => setDeletingId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 380 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--red-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={20} color="var(--red)"/>
              </div>
              <h2 className="modal-title" style={{ marginBottom: 0 }}>Delete Project?</h2>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
              This will permanently delete <strong style={{ color: 'var(--text-primary)' }}>
                "{projects.find(p => p.id === deletingId)?.name}"
              </strong> and all its files. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setDeletingId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deletingId)}>
                <Trash2 size={14}/> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const PROJ_COLORS = [
  'linear-gradient(135deg,#00d4ff,#0099bb)',
  'linear-gradient(135deg,#39d98a,#1ab869)',
  'linear-gradient(135deg,#b06cff,#8040dd)',
  'linear-gradient(135deg,#ff9f43,#e67e22)',
  'linear-gradient(135deg,#ff5f57,#cc3333)',
  'linear-gradient(135deg,#ffd166,#e6a800)',
]

const s = {
  page:      { height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', overflow: 'hidden' },
  nav:       { height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)', flexShrink: 0 },
  navLeft:   { display: 'flex', alignItems: 'center', gap: 10 },
  navRight:  { display: 'flex', alignItems: 'center', gap: 12 },
  logoIcon:  { width: 30, height: 30, borderRadius: 7, background: 'linear-gradient(135deg,#00d4ff,#39d98a)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText:  { fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' },
  userChip:  { display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', background: 'var(--bg-elevated)', borderRadius: 20, border: '1px solid var(--border)' },
  avatar:    { width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#00d4ff,#39d98a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#000' },
  userName:  { fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 },
  main:      { flex: 1, overflowY: 'auto', padding: '32px 40px', maxWidth: 1100, margin: '0 auto', width: '100%' },
  topRow:    { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 },
  heading:   { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' },
  headingSub:{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 },
  searchWrap:{ position: 'relative', marginBottom: 24, maxWidth: 360 },
  grid:      { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 },
  card:      { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20, cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative' },
  cardTop:   { display: 'flex', alignItems: 'flex-start', marginBottom: 14 },
  cardIcon:  { width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardName:  { fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2, marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  cardMeta:  { display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' },
  dropdown:  { position: 'absolute', right: 0, top: 'calc(100% + 4px)', zIndex: 100, background: 'var(--bg-elevated)', border: '1px solid var(--border-bright)', borderRadius: 'var(--radius-md)', padding: 4, minWidth: 140, boxShadow: 'var(--shadow-md)' },
  dropItem:  { display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', borderRadius: 4, transition: 'all 0.15s' },
  emptyState:{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 80, textAlign: 'center', gap: 12 },
  emptyIcon: { width: 80, height: 80, borderRadius: 20, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emptyTitle:{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' },
  emptySub:  { fontSize: 14, color: 'var(--text-muted)', maxWidth: 340, lineHeight: 1.6 },
  modalLabel:{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' },
}