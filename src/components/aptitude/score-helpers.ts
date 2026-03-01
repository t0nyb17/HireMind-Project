export function scoreColor(score: number): string {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}

export function scoreTextClass(score: number): string {
  if (score >= 80) return 'text-green-500'
  if (score >= 60) return 'text-yellow-500'
  return 'text-red-500'
}

export function scoreLabel(score: number): { label: string; className: string } {
  if (score >= 80) return { label: 'Excellent', className: 'text-green-500' }
  if (score >= 60) return { label: 'Good', className: 'text-yellow-500' }
  if (score >= 40) return { label: 'Average', className: 'text-orange-500' }
  return { label: 'Needs Practice', className: 'text-red-500' }
}

export function scoreGrade(score: number): { label: string; emoji: string; color: string } {
  if (score >= 80) return { label: 'Excellent!', emoji: '🎉', color: 'text-green-500' }
  if (score >= 60) return { label: 'Good Job!', emoji: '👍', color: 'text-yellow-500' }
  if (score >= 40) return { label: 'Keep Practicing', emoji: '💪', color: 'text-orange-500' }
  return { label: 'Keep Practicing', emoji: '📚', color: 'text-red-500' }
}

export function formatTime(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
