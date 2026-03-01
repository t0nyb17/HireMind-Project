"use client"

import { scoreColor, scoreLabel } from './score-helpers'

interface ScoreGaugeProps {
  score: number
  attempted: boolean
}

export function ScoreGauge({ score, attempted }: ScoreGaugeProps) {
  const r = 54
  const cx = 80
  const cy = 72

  const color = attempted ? scoreColor(score) : '#6366f1'
  const safeScore = Math.min(score, 99.8)
  const endAngle = 180 - (safeScore / 100) * 180
  const rad = (endAngle * Math.PI) / 180
  const ex = cx + r * Math.cos(rad)
  const ey = cy - r * Math.sin(rad)
  const largeArc = score > 50 ? 1 : 0

  const { label, className } = attempted ? scoreLabel(score) : { label: '', className: '' }

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 160 95" className="w-full max-w-[220px]">
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy}`}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="11"
          strokeLinecap="round"
        />
        {attempted && score > 0 && (
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 ${largeArc} 0 ${ex} ${ey}`}
            fill="none"
            stroke={color}
            strokeWidth="11"
            strokeLinecap="round"
          />
        )}
        {attempted && score > 0 && (
          <circle cx={ex} cy={ey} r="5" fill={color} />
        )}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fontSize="28"
          fontWeight="bold"
          fill="currentColor"
        >
          {attempted ? score : '—'}
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fontSize="10"
          fill="currentColor"
          opacity="0.45"
        >
          {attempted ? 'out of 100' : 'not attempted'}
        </text>
        <text x={cx - r + 2} y={cy + 18} fontSize="9" fill="currentColor" opacity="0.4" textAnchor="middle">0</text>
        <text x={cx} y={cy - r - 6} fontSize="9" fill="currentColor" opacity="0.4" textAnchor="middle">50</text>
        <text x={cx + r - 2} y={cy + 18} fontSize="9" fill="currentColor" opacity="0.4" textAnchor="middle">100</text>
      </svg>

      {attempted && (
        <span className={`text-sm font-semibold ${className}`}>{label}</span>
      )}

      <div className="flex gap-3">
        {[
          { color: 'bg-green-500', label: '≥80 Excellent' },
          { color: 'bg-yellow-500', label: '≥60 Good' },
          { color: 'bg-red-500', label: '<60 Practice' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <div className={`h-2 w-2 rounded-full ${item.color}`} />
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
