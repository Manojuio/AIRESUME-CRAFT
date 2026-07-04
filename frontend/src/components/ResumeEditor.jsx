import { useState } from 'react'
import { updateResume } from '../api'

export default function ResumeEditor({ resumeData, taskId, onUpdate }) {
  const [data, setData] = useState(resumeData)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!data) return null

  const handleChange = (section, field, value) => {
    setSaved(false)
    setData((prev) => ({
      ...prev,
      [section]: field !== undefined ? { ...prev[section], [field]: value } : value,
    }))
  }

  const handleArrayChange = (section, index, value) => {
    setSaved(false)
    setData((prev) => {
      const arr = [...(prev[section] || [])]
      arr[index] = value
      return { ...prev, [section]: arr }
    })
  }

  const handleObjectArrayChange = (section, index, field, value) => {
    setSaved(false)
    setData((prev) => {
      const arr = [...(prev[section] || [])]
      arr[index] = { ...arr[index], [field]: value }
      return { ...prev, [section]: arr }
    })
  }

  const addArrayItem = (section, template = '') => {
    setData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), template],
    }))
  }

  const removeArrayItem = (section, index) => {
    setData((prev) => ({
      ...prev,
      [section]: (prev[section] || []).filter((_, i) => i !== index),
    }))
  }

  const addExperienceItem = () => {
    setData((prev) => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        { project_name: '', description: '', technologies: '', url: '' },
      ],
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateResume(taskId, data)
      onUpdate(data)
      setSaved(true)
    } catch (err) {
      alert('Failed to save: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">✏️ Edit Your Resume</h2>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm font-semibold text-green-400">✓ Saved!</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-600/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? '💾 Saving...' : '💾 Save & Regenerate'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Full Name</label>
            <input
              type="text"
              value={data.full_name || ''}
              onChange={(e) => handleChange('full_name', undefined, e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Email</label>
            <input
              type="email"
              value={data.email || ''}
              onChange={(e) => handleChange('email', undefined, e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">Summary</label>
          <textarea
            value={data.summary || ''}
            onChange={(e) => handleChange('summary', undefined, e.target.value)}
            rows={3}
            className="input-field resize-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-white">Skills</label>
            <button
              onClick={() => addArrayItem('skills', '')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              + Add Skill
            </button>
          </div>
          {(data.skills || []).map((skill, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleArrayChange('skills', i, e.target.value)}
                className="input-field"
              />
              <button
                onClick={() => removeArrayItem('skills', i)}
                className="px-3 py-2 text-red-400 hover:text-red-300 font-semibold transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">Experience</label>
            <button
              onClick={addExperienceItem}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              + Add
            </button>
          </div>
          {(data.experience || []).map((exp, i) => (
            <div key={i} className="border border-gray-200 rounded p-3 mb-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs font-medium text-gray-500">Project {i + 1}</span>
                <button
                  onClick={() => removeArrayItem('experience', i)}
                  className="text-red-500 text-xs"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                placeholder="Project name"
                value={exp.project_name || ''}
                onChange={(e) => handleObjectArrayChange('experience', i, 'project_name', e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
              />
              <textarea
                placeholder="Description"
                value={exp.description || ''}
                onChange={(e) => handleObjectArrayChange('experience', i, 'description', e.target.value)}
                rows={2}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
              />
              <input
                type="text"
                placeholder="Technologies"
                value={exp.technologies || ''}
                onChange={(e) => handleObjectArrayChange('experience', i, 'technologies', e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">Education</label>
            <button
              onClick={() =>
                setData((prev) => ({
                  ...prev,
                  education: [
                    ...(prev.education || []),
                    { degree: '', institution: '', year: '' },
                  ],
                }))
              }
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              + Add
            </button>
          </div>
          {(data.education || []).map((edu, i) => (
            <div key={i} className="flex gap-2 mb-1 items-start">
              <input
                type="text"
                placeholder="Degree"
                value={edu.degree || ''}
                onChange={(e) => handleObjectArrayChange('education', i, 'degree', e.target.value)}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
              />
              <input
                type="text"
                placeholder="Institution"
                value={edu.institution || ''}
                onChange={(e) => handleObjectArrayChange('education', i, 'institution', e.target.value)}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
              />
              <input
                type="text"
                placeholder="Year"
                value={edu.year || ''}
                onChange={(e) => handleObjectArrayChange('education', i, 'year', e.target.value)}
                className="w-20 px-3 py-1.5 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={() => removeArrayItem('education', i)}
                className="text-red-500 text-sm mt-1"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
