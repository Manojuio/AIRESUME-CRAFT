export default function ProgressTracker({ progress }) {
  return (
    <div className="card p-8 text-center">
      <h2 className="text-2xl font-bold text-white mb-8">
        ✨ Generating Your Resume
      </h2>

      <div className="mb-6">
        <div className="w-full bg-white/10 rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out shadow-lg shadow-blue-500/50"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-lg font-semibold text-white">{progress}% complete</p>
      </div>

      <div className="mt-8 space-y-3 text-sm">
        <div className="flex items-center justify-center gap-3">
          <span className={`w-3 h-3 rounded-full transition-all duration-300 ${progress >= 10 ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-white/20'}`} />
          <span className={progress >= 10 ? 'text-green-300 font-semibold' : 'text-white/50'}>Fetching GitHub repositories</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <span className={`w-3 h-3 rounded-full transition-all duration-300 ${progress >= 40 ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-white/20'}`} />
          <span className={progress >= 40 ? 'text-green-300 font-semibold' : 'text-white/50'}>Selecting top repos</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <span className={`w-3 h-3 rounded-full transition-all duration-300 ${progress >= 70 ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-white/20'}`} />
          <span className={progress >= 70 ? 'text-green-300 font-semibold' : 'text-white/50'}>Generating resume content</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <span className={`w-3 h-3 rounded-full transition-all duration-300 ${progress >= 90 ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-white/20'}`} />
          <span className={progress >= 90 ? 'text-green-300 font-semibold' : 'text-white/50'}>Rendering files</span>
        </div>
      </div>
    </div>
  )
}
