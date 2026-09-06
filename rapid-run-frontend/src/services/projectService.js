import api from './api'
const projectService = {
  getAll:    ()                          => api.get('/projects').then(r => r.data),
  create:    (name)                      => api.post('/projects', { name }).then(r => r.data),
  rename:    (id, name)                  => api.put(`/projects/${id}`, { name }).then(r => r.data),
  delete:    (id)                        => api.delete(`/projects/${id}`).then(r => r.data),
  getFiles:  (projectId)                 => api.get(`/projects/${projectId}/files`).then(r => r.data),
  createFile:(projectId, name, language) => api.post(`/projects/${projectId}/files`, { name, language }).then(r => r.data),
  renameFile:(projectId, fileId, name)   => api.put(`/projects/${projectId}/files/${fileId}`, { name }).then(r => r.data),
  deleteFile:(projectId, fileId)         => api.delete(`/projects/${projectId}/files/${fileId}`).then(r => r.data),
  saveFile:  (projectId, fileId, code)   => api.patch(`/projects/${projectId}/files/${fileId}/code`, { code }).then(r => r.data),
}
export default projectService
