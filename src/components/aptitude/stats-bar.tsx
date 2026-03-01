import { Card, CardContent } from '@/components/ui/card'
import { Trophy, CheckCircle, Target } from 'lucide-react'
import type { TestResult } from '@/lib/aptitude-tests'
import { APTITUDE_TESTS } from '@/lib/aptitude-tests'

interface StatsBarProps {
  results: TestResult[]
}

export function StatsBar({ results }: StatsBarProps) {
  const attempted = results.filter((r) =>
    APTITUDE_TESTS.some((t) => t.id === r.testId),
  )

  const testsCompleted = `${attempted.length} / ${APTITUDE_TESTS.length}`

  const bestScore =
    attempted.length > 0
      ? `${Math.max(...attempted.map((r) => r.score))}/100`
      : '—'

  const avgAccuracy =
    attempted.length > 0
      ? `${Math.round(
          (attempted.reduce((s, r) => s + r.correctAnswers, 0) /
            attempted.reduce((s, r) => s + r.totalQuestions, 0)) *
            100,
        )}%`
      : '—'

  const stats = [
    { icon: Trophy, label: 'Tests Completed', value: testsCompleted, color: 'text-yellow-500' },
    { icon: CheckCircle, label: 'Best Score', value: bestScore, color: 'text-green-500' },
    { icon: Target, label: 'Avg Accuracy', value: avgAccuracy, color: 'text-primary' },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map(({ icon: Icon, label, value, color }) => (
        <Card key={label}>
          <CardContent className="flex items-center gap-3 pt-5 pb-5">
            <Icon className={`h-5 w-5 shrink-0 ${color}`} />
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-lg font-bold">{value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
