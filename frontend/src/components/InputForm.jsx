import { useState } from 'react'

export default function InputForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    github_username: '',
    personal_token: '',
    personal_summary: '',
    job_description: '',
  })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.github_username.trim()) return
    const payload = { ...form }
    if (!payload.personal_token) delete payload.personal_token
    if (!payload.personal_summary) delete payload.personal_summary
    if (!payload.job_description) delete payload.job_description
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="card p-10 space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">Generate Your Resume</h2>
        <p className="text-white/60 text-lg">Powered by AI and your GitHub profile</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-white">
          GitHub Username <span className="text-blue-400">*</span>
        </label>
        <input
          type="text"
          name="github_username"
          value={form.github_username}
          onChange={handleChange}
          required
          placeholder="e.g. octocat"
          className="input-field"
        />
        <p className="text-xs text-white/40 mt-1">Your public GitHub username</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-white">
          GitHub Token <span className="text-white/40">(optional)</span>
        </label>
        <input
          type="password"
          name="personal_token"
          value={form.personal_token}
          onChange={handleChange}
          placeholder="ghp_..."
          className="input-field"
        />
        <p className="text-xs text-white/40 mt-1">Higher API rate limit with authentication</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-white">
          Personal Summary <span className="text-white/40">(optional)</span>
        </label>
        <textarea
          name="personal_summary"
          value={form.personal_summary}
          onChange={handleChange}
          rows={2}
          placeholder="Brief summary about yourself..."
          className="input-field resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-white">
          Job Description <span className="text-white/40">(optional)</span>
        </label>
        <textarea
          name="job_description"
          value={form.job_description}
          onChange={handleChange}
          rows={4}
          placeholder="Paste the job description here for ATS optimization..."
          className="input-field resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary mt-8"
      >
        {loading ? '⏳ Generating...' : '🚀 Generate Resume'}
      </button>
    </form>
  )
}
