'use client'

export function LifeScoreCircle() {
  const score = 88
  const circumference = 2 * Math.PI * 100

  const segments = [
    { label: 'FOCUS', color: '#06b6d4', percentage: 85 },
    { label: 'EXECUTION', color: '#06b6d4', percentage: 88 },
    { label: 'ENERGY', color: '#f97316', percentage: 92 },
    { label: 'MOOD', color: '#a855f7', percentage: 80 },
  ]

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="280" height="280" className="relative">
        {/* Outer glow */}
        <defs>
          <radialGradient id="glowGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background circle */}
        <circle cx="140" cy="140" r="135" fill="none" stroke="#1e293b" strokeWidth="1" />

        {/* Segment rings */}
        {segments.map((segment, index) => {
          const offset = index * (circumference / 4)
          const dashoffset =
            circumference -
            (segment.percentage / 100) * (circumference / 4)
          return (
            <circle
              key={segment.label}
              cx="140"
              cy="140"
              r={100 - index * 18}
              fill="none"
              stroke={segment.color}
              strokeWidth="12"
              strokeDasharray={circumference / 4}
              strokeDashoffset={-offset - dashoffset}
              opacity="0.8"
              filter="url(#glow)"
              className="transition-all duration-1000 ease-out"
            />
          )
        })}

        {/* Center circle */}
        <circle cx="140" cy="140" r="60" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />

        {/* Labels around the circle */}
        <text x="140" y="35" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">FOCUS</text>
        <text x="245" y="145" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">EXECUTION</text>
        <text x="140" y="255" textAnchor="middle" fill="#f97316" fontSize="12" fontWeight="bold">ENERGY</text>
        <text x="35" y="145" textAnchor="middle" fill="#a855f7" fontSize="12" fontWeight="bold">MOOD</text>

        {/* Center text */}
        <text x="140" y="130" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="500">ANKITH LIFE SCORE:</text>
        <text x="140" y="155" textAnchor="middle" fill="#06b6d4" fontSize="36" fontWeight="bold">{score}/100</text>
      </svg>

      {/* Footer */}
      <div className="text-xs text-slate-500 mt-4 text-center">
        DUAL BRAIN: Gemini 1.5 Pro | Groq LLaMA 8B{' '}
        <span className="text-pink-400">🧠</span>
      </div>
    </div>
  )
}