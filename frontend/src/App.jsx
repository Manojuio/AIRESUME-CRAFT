import { useState, useCallback, useEffect, useRef } from 'react'
import InputForm from './components/InputForm'
import ProgressTracker from './components/ProgressTracker'
import ResumeEditor from './components/ResumeEditor'
import AtsScore from './components/AtsScore'
import DownloadPanel from './components/DownloadPanel'
import { generateResume, getTaskStatus } from './api'

export default function App() {
  const [taskId, setTaskId] = useState(null)
  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [resumeData, setResumeData] = useState(null)
  const [atsScore, setAtsScore] = useState(null)
  const [missingKeywords, setMissingKeywords] = useState([])
  const [downloadUrls, setDownloadUrls] = useState({})
  const [error, setError] = useState(null)
  const pollingRef = useRef(null)

  const handleGenerate = useCallback(async (payload) => {
    setError(null)
    setStatus('processing')
    setProgress(0)
    try {
      const { task_id } = await generateResume(payload)
      setTaskId(task_id)
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
      setStatus('idle')
    }
  }, [])

  useEffect(() => {
    if (status !== 'processing' || !taskId) return

    pollingRef.current = setInterval(async () => {
      try {
        const result = await getTaskStatus(taskId)
        setProgress(result.progress || 0)

        if (result.status === 'completed') {
          clearInterval(pollingRef.current)
          setStatus('completed')
          setResumeData(result.resume_data)
          setAtsScore(result.ats_score)
          setMissingKeywords(result.missing_keywords || [])
          setDownloadUrls({
            pdf: result.pdf_url,
            docx: result.docx_url,
            portfolio: result.portfolio_url,
          })
        } else if (result.status === 'failed') {
          clearInterval(pollingRef.current)
          setStatus('failed')
          setError(result.error || 'Generation failed')
        }
      } catch (err) {
        clearInterval(pollingRef.current)
        setError(err.message)
        setStatus('failed')
      }
    }, 2000)

    return () => clearInterval(pollingRef.current)
  }, [status, taskId])

  const handleReset = useCallback(() => {
    setTaskId(null)
    setStatus('idle')
    setProgress(0)
    setResumeData(null)
    setAtsScore(null)
    setMissingKeywords([])
    setDownloadUrls({})
    setError(null)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-xl border-b border-blue-500/30 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-300 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">✨</span>
            </div>
            <h1 className="text-2xl font-bold text-white">ResumeAI</h1>
            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-semibold">AI-Powered</span>
          </div>
          {status !== 'idle' && (
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-blue-100 hover:bg-blue-700 rounded-lg transition-colors duration-200"
            >
              ↻ New Resume
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {status === 'idle' && (
          <InputForm onSubmit={handleGenerate} loading={false} />
        )}

        {status === 'processing' && (
          <ProgressTracker progress={progress} />
        )}

        {status === 'failed' && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {status === 'completed' && (
          <div className="space-y-6">
            {atsScore !== null && (
              <AtsScore score={atsScore} missingKeywords={missingKeywords} />
            )}
            <ResumeEditor
              resumeData={resumeData}
              taskId={taskId}
              onUpdate={(data) => setResumeData(data)}
            />
            <DownloadPanel urls={downloadUrls} />
          </div>
        )}
      </main>
    </div>
  )
}
