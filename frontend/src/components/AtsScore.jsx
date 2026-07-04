export default function AtsScore({ score, missingKeywords }) {
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const getColor = (s) => {
    if (s >= 80) return 'text-green-400'
    if (s >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getStrokeColor = (s) => {
    if (s >= 80) return '#4ade80'
    if (s >= 60) return '#facc15'
    return '#f87171'
  }

  const getBgColor = (s) => {
    if (s >= 80) return 'from-green-600 to-green-700'
    if (s >= 60) return 'from-yellow-600 to-yellow-700'
    return 'from-red-600 to-red-700'
  }

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold text-white mb-8">📊 ATS Score</h2>

      <div className="flex items-center gap-12">
        <div className="relative flex items-center justify-center flex-shrink-0">
          <svg width="180" height="180" className="transform -rotate-90 drop-shadow-lg">
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="12"
            />
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={getStrokeColor(score)}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-700 filter drop-shadow-lg"
            />
          </svg>
          <div className="absolute text-center">
            <span className={`text-5xl font-bold ${getColor(score)}`}>
              {score}
            </span>
            <p className="text-white/60 text-xs mt-1">/ 100</p>
          </div>
        </div>

        <div className="flex-1">
          <div className={`bg-gradient-to-br ${getBgColor(score)} rounded-lg p-4 mb-6 text-white`}>
            <p className="font-semibold text-lg">
              {score >= 80
                ? '✨ Excellent Match!'
                : score >= 60
                ? '👍 Good Match'
                : '⚠️ Needs Improvement'}
            </p>
            <p className="text-sm opacity-90 mt-1">
              {score >= 80
                ? 'Your resume covers the key requirements.'
                : score >= 60
                ? 'Consider adding more keywords from the job description.'
                : 'Add more relevant keywords to improve ATS compatibility.'}
            </p>
          </div>

          {missingKeywords && missingKeywords.length > 0 && (
            <>
              <p className="text-sm font-semibold text-white/80 mb-3">
                Missing Keywords:
              </p>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.slice(0, 8).map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-red-500/20 text-red-300 text-xs font-medium rounded-full border border-red-500/50 backdrop-blur-sm"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
