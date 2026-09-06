import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Zap, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate   = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('Fill all fields')
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Invalid credentials')
    } finally { setLoading(false) }
  }

  return (
    <div style={s.page}>
      <div style={s.grid} />
      <div style={{ ...s.orb, top: '10%', left: '15%', width: 320, height: 320 }} />
      <div style={{ ...s.orb, bottom: '15%', right: '10%', width: 200, height: 200, opacity: 0.05 }} />

      <div style={s.card} className="animate-fadeInScale">
        <div style={s.logo}>
          <div style={s.logoIcon}><Zap size={20} color="#000" strokeWidth={3} /></div>
          <span style={s.logoText} className="font-display">Rapid Run</span>
        </div>

        <h1 style={s.heading} className="font-display">Welcome back</h1>
        <p style={s.sub}>Sign in to your workspace</p>

        {/* hidden fake fields to trick browser autofill away from real fields */}
        <input type="text"     style={{ display:'none' }} autoComplete="username" readOnly />
        <input type="password" style={{ display:'none' }} autoComplete="current-password" readOnly />

        <form onSubmit={submit} style={s.form} autoComplete="off">
          <div style={s.field}>
            <label style={s.label}>Email address</label>
            <input
              name="email" type="text" value={form.email} onChange={handle}
              className="input" placeholder="you@example.com"
              autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
              style={inputStyle}
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                name="password" type={showPwd ? 'text' : 'password'}
                value={form.password} onChange={handle}
                className="input" style={{ ...inputStyle, paddingRight: 44 }}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button type="button" style={s.eyeBtn} onClick={() => setShowPwd(p => !p)}>
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 14, marginTop: 4 }}
            disabled={loading}>
            {loading
              ? <span style={s.spinner} className="animate-spin" />
              : <><LogIn size={15} />Sign In</>}
          </button>
        </form>

        <p style={s.footer}>
          New to Rapid Run?{' '}
          <Link to="/register" style={s.link}>Create an account →</Link>
        </p>
      </div>
    </div>
  )
}

// Overrides browser autofill yellow/blue background
const inputStyle = {
  background: 'var(--bg-elevated)',
  WebkitBoxShadow: '0 0 0px 1000px var(--bg-elevated) inset',
  WebkitTextFillColor: 'var(--text-primary)',
  caretColor: 'var(--text-primary)',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

const s = {
  page:    { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' },
  grid:    { position: 'absolute', inset: 0, opacity: 0.025, backgroundImage: 'linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)', backgroundSize: '40px 40px' },
  orb:     { position: 'absolute', borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,212,255,0.14) 0%,transparent 70%)', pointerEvents: 'none' },
  card:    { position: 'relative', zIndex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '40px 36px', width: '100%', maxWidth: 420, boxShadow: 'var(--shadow-md), 0 0 60px rgba(0,212,255,0.05)' },
  logo:    { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 },
  logoIcon:{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg,#00d4ff,#39d98a)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText:{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' },
  heading: { fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 6 },
  sub:     { fontSize: 13, color: 'var(--text-secondary)', marginBottom: 28 },
  form:    { display: 'flex', flexDirection: 'column', gap: 16 },
  field:   { display: 'flex', flexDirection: 'column', gap: 6 },
  label:   { fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' },
  eyeBtn:  { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' },
  spinner: { display: 'inline-block', width: 16, height: 16, border: '2px solid #00000033', borderTopColor: '#000', borderRadius: '50%' },
  footer:  { marginTop: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' },
  link:    { color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 },
}