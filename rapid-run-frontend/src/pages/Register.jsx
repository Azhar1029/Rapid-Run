import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Zap, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) return toast.error('Fill all fields')
    if (form.password.length < 6) return toast.error('Password must be 6+ characters')
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success('Account created! Welcome to Rapid Run 🚀')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  const strength = (() => {
    const p = form.password
    if (!p) return 0
    let s = 0
    if (p.length >= 6) s++
    if (p.length >= 10) s++
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  })()
  const strengthColors = ['','var(--red)','var(--yellow)','var(--orange)','var(--green)']
  const strengthLabels = ['','Weak','Fair','Good','Strong']

  return (
    <div style={s.page}>
      <div style={s.grid} />
      <div style={{ ...s.orb, top:'5%', right:'20%', width:280, height:280 }} />
      <div style={{ ...s.orb, bottom:'10%', left:'5%', width:200, height:200, opacity:0.05 }} />

      <div style={s.card} className="animate-fadeInScale">
        <div style={s.logo}>
          <div style={s.logoIcon}><Zap size={20} color="#000" strokeWidth={3} /></div>
          <span style={s.logoText} className="font-display">Rapid Run</span>
        </div>

        <h1 style={s.heading} className="font-display">Create account</h1>
        <p style={s.sub}>Start coding in seconds</p>

        <form onSubmit={submit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Full name</label>
            <input name="name" type="text" value={form.name} onChange={handle}
              className="input" placeholder="Aryan Sharma" />
          </div>
          <div style={s.field}>
            <label style={s.label}>Email address</label>
            <input name="email" type="email" value={form.email} onChange={handle}
              className="input" placeholder="you@example.com" />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <div style={{ position:'relative' }}>
              <input name="password" type={showPwd ? 'text' : 'password'}
                value={form.password} onChange={handle}
                className="input" style={{ paddingRight:44 }} placeholder="Min. 6 characters" />
              <button type="button" style={s.eyeBtn} onClick={() => setShowPwd(p=>!p)}>
                {showPwd ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>
            {form.password && (
              <div style={s.strengthWrap}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ ...s.strengthBar, background: i <= strength ? strengthColors[strength] : 'var(--border)' }} />
                ))}
                <span style={{ fontSize:11, color: strengthColors[strength] || 'var(--text-muted)' }}>
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>
          <div style={s.field}>
            <label style={s.label}>Confirm password</label>
            <input name="confirm" type="password" value={form.confirm} onChange={handle}
              className="input" placeholder="Re-enter password" />
          </div>
          <button type="submit" className="btn btn-primary"
            style={{ width:'100%', justifyContent:'center', padding:'12px 0', fontSize:14, marginTop:4 }}
            disabled={loading}>
            {loading
              ? <span style={s.spinner} className="animate-spin"/>
              : <><UserPlus size={15}/>Create Account</>}
          </button>
        </form>

        <p style={s.footer}>
          Already have an account?{' '}
          <Link to="/login" style={s.link}>Sign in →</Link>
        </p>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-base)', position:'relative', overflow:'hidden' },
  grid: { position:'absolute', inset:0, opacity:0.025, backgroundImage:'linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)', backgroundSize:'40px 40px' },
  orb:  { position:'absolute', borderRadius:'50%', background:'radial-gradient(circle,rgba(0,212,255,0.14) 0%,transparent 70%)', pointerEvents:'none' },
  card: { position:'relative', zIndex:1, background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'36px', width:'100%', maxWidth:420, boxShadow:'var(--shadow-md), 0 0 60px rgba(0,212,255,0.05)' },
  logo: { display:'flex', alignItems:'center', gap:10, marginBottom:24 },
  logoIcon: { width:34, height:34, borderRadius:8, background:'linear-gradient(135deg,#00d4ff,#39d98a)', display:'flex', alignItems:'center', justifyContent:'center' },
  logoText: { fontSize:20, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.02em' },
  heading: { fontSize:26, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.03em', marginBottom:6 },
  sub:  { fontSize:13, color:'var(--text-secondary)', marginBottom:24 },
  form: { display:'flex', flexDirection:'column', gap:14 },
  field:{ display:'flex', flexDirection:'column', gap:6 },
  label:{ fontSize:11, fontWeight:600, color:'var(--text-secondary)', letterSpacing:'0.06em', textTransform:'uppercase' },
  eyeBtn: { position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer' },
  strengthWrap: { display:'flex', alignItems:'center', gap:4, marginTop:6 },
  strengthBar:  { flex:1, height:3, borderRadius:2, transition:'background 0.3s' },
  spinner: { display:'inline-block', width:16, height:16, border:'2px solid #00000033', borderTopColor:'#000', borderRadius:'50%' },
  footer: { marginTop:22, textAlign:'center', fontSize:13, color:'var(--text-muted)' },
  link:   { color:'var(--accent)', textDecoration:'none', fontWeight:500 },
}
