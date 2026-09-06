import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import projectService from '../services/projectService'
import { useAuth } from './AuthContext'

const ProjectContext = createContext(null)

export function ProjectProvider({ children }) {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    if (user) fetchProjects()
    else setProjects([])
  }, [user])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const data = await projectService.getAll()
      setProjects(data)
    } catch (err) {
      console.error('Failed to fetch projects', err)
    } finally { setLoading(false) }
  }

  const createProject = useCallback(async (name) => {
    const project = await projectService.create(name)
    setProjects(prev => [project, ...prev])
    return project
  }, [])

  const renameProject = useCallback(async (id, name) => {
    const updated = await projectService.rename(id, name)
    setProjects(prev => prev.map(p => p.id === id ? updated : p))
  }, [])

  const deleteProject = useCallback(async (id) => {
    await projectService.delete(id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }, [])

  const getProject = useCallback((id) => {
    return projects.find(p => p.id === id) || null
  }, [projects])

  const createFile = useCallback(async (projectId, fileName) => {
    const ext      = fileName.split('.').pop().toLowerCase()
    const langMap  = { java: 'java', c: 'c', cpp: 'cpp', py: 'python' }
    const language = langMap[ext] || 'plaintext'
    const file     = await projectService.createFile(projectId, fileName, language)
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, files: [...(p.files || []), file] } : p
    ))
    return file
  }, [])

  const renameFile = useCallback(async (projectId, fileId, name) => {
    const file = await projectService.renameFile(projectId, fileId, name)
    setProjects(prev => prev.map(p =>
      p.id === projectId
        ? { ...p, files: p.files.map(f => f.id === fileId ? file : f) }
        : p
    ))
  }, [])

  const deleteFile = useCallback(async (projectId, fileId) => {
    await projectService.deleteFile(projectId, fileId)
    setProjects(prev => prev.map(p =>
      p.id === projectId
        ? { ...p, files: p.files.filter(f => f.id !== fileId) }
        : p
    ))
  }, [])

  const updateFileContent = useCallback(async (projectId, fileId, code) => {
    await projectService.saveFile(projectId, fileId, code)
    setProjects(prev => prev.map(p =>
      p.id === projectId
        ? { ...p, files: p.files.map(f => f.id === fileId ? { ...f, content: code } : f) }
        : p
    ))
  }, [])

  return (
    <ProjectContext.Provider value={{
      projects, loading, fetchProjects,
      createProject, renameProject, deleteProject, getProject,
      createFile, renameFile, deleteFile, updateFileContent,
    }}>
      {children}
    </ProjectContext.Provider>
  )
}

export const useProjects = () => {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error('useProjects must be used within ProjectProvider')
  return ctx
}