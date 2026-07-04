import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export async function generateResume(payload) {
  const { data } = await api.post('/generate', payload)
  return data
}

export async function getTaskStatus(taskId) {
  const { data } = await api.get(`/status/${taskId}`)
  return data
}

export async function updateResume(taskId, resumeData) {
  const { data } = await api.post(`/update/${taskId}`, { resume_data: resumeData })
  return data
}
