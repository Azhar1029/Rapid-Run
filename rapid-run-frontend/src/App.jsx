import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProjectProvider } from './context/ProjectContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import EditorPage from './pages/EditorPage'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'var(--bg-base)',color:'var(--text-secondary)',fontFamily:'var(--font-mono)',fontSize:13 }}>Loading Rapid Run...</div>
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{
            style: { background:'var(--bg-elevated)', color:'var(--text-primary)', border:'1px solid var(--border)', fontFamily:'var(--font-body)', fontSize:13 },
            success: { iconTheme: { primary:'var(--green)', secondary:'#000' } },
            error:   { iconTheme: { primary:'var(--red)',   secondary:'#fff' } },
          }} />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/editor/:projectId" element={<PrivateRoute><EditorPage /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ProjectProvider>
    </AuthProvider>
  )
}
