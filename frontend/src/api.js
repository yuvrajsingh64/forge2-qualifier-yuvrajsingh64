import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API Error]', err.response?.data || err.message)
    return Promise.reject(err)
  }
)

export const boards = {
  list: () => api.get('/boards'),
  get: (id) => api.get(`/boards/${id}`),
  create: (data) => api.post('/boards', data),
  update: (id, data) => api.patch(`/boards/${id}`, data),
  delete: (id) => api.delete(`/boards/${id}`),
  addMember: (id, memberId) => api.post(`/boards/${id}/members`, { member_id: memberId }),
  removeMember: (boardId, memberId) => api.delete(`/boards/${boardId}/members/${memberId}`),
  tags: (id) => api.get(`/boards/${id}/tags`),
  createTag: (id, data) => api.post(`/boards/${id}/tags`, data),
}

export const lists = {
  create: (boardId, data) => api.post(`/boards/${boardId}/lists`, data),
  update: (id, data) => api.patch(`/lists/${id}`, data),
  delete: (id) => api.delete(`/lists/${id}`),
}

export const cards = {
  create: (listId, data) => api.post(`/lists/${listId}/cards`, data),
  get: (id) => api.get(`/cards/${id}`),
  update: (id, data) => api.patch(`/cards/${id}`, data),
  delete: (id) => api.delete(`/cards/${id}`),
  move: (id, data) => api.patch(`/cards/${id}/move`, data),
  addTag: (id, tagId) => api.post(`/cards/${id}/tags`, { tag_id: tagId }),
  removeTag: (id, tagId) => api.delete(`/cards/${id}/tags/${tagId}`),
}

export const members = {
  list: () => api.get('/members'),
  create: (data) => api.post('/members', data),
}

export default api
