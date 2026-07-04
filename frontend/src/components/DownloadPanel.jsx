export default function DownloadPanel({ urls }) {
  if (!urls || Object.keys(urls).length === 0) return null

  const buttons = [
    { key: 'pdf', label: 'Download PDF', icon: '📄', color: 'from-red-600 to-red-700' },
    { key: 'docx', label: 'Download DOCX', icon: '📝', color: 'from-blue-600 to-blue-700' },
    { key: 'portfolio', label: 'Download Portfolio', icon: '🌐', color: 'from-purple-600 to-purple-700' },
  ]

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold text-white mb-6">📥 Downloads</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {buttons.map(({ key, label, icon, color }) =>
          urls[key] ? (
            <a
              key={key}
              href={`${BASE_URL}${urls[key]}`}
              download
              className={`inline-flex flex-col items-center justify-center gap-3 px-6 py-6 bg-gradient-to-br ${color} text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-${color.split('-')[1]}-600/50 transition-all duration-300 transform hover:scale-105 active:scale-95`}
            >
              <span className="text-3xl">{icon}</span>
              <span className="text-sm">{label}</span>
            </a>
          ) : null
        )}
      </div>
    </div>
  )
}
