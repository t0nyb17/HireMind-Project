"use client"

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, AlertCircle, Trophy } from 'lucide-react'
import type { AptitudeTest } from '@/lib/aptitude-tests'
import { scoreColor, scoreTextClass, scoreGrade } from './score-helpers'

interface ResultsViewProps {
  test: AptitudeTest
  answers: (number | null)[]
  score: number
  onRetake: () => void
}

export function ResultsView({ test, answers, score, onRetake }: ResultsViewProps) {
  const router = useRouter()
  const correct = test.questions.filter((q, i) => answers[i] === q.correctIndex).length
  const grade = scoreGrade(score)

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <Card className="text-center py-10">
        <CardContent className="space-y-3">
          <div className="text-5xl">{grade.emoji}</div>
          <h2 className={`text-2xl font-bold ${grade.color}`}>{grade.label}</h2>
          <div className={`text-7xl font-extrabold ${scoreTextClass(score)}`}>{score}</div>
          <p className="text-muted-foreground text-sm">out of 100</p>

          <div className="flex justify-center gap-8 mt-4">
            <div className="flex flex-col items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mb-1" />
              <span className="text-sm font-semibold">{correct}</span>
              <span className="text-xs text-muted-foreground">Correct</span>
            </div>
            <div className="flex flex-col items-center">
              <XCircle className="h-5 w-5 text-red-500 mb-1" />
              <span className="text-sm font-semibold">{test.questions.length - correct}</span>
              <span className="text-xs text-muted-foreground">Wrong</span>
            </div>
            <div className="flex flex-col items-center">
              <Trophy className="h-5 w-5 text-yellow-500 mb-1" />
              <span className="text-sm font-semibold">{score}%</span>
              <span className="text-xs text-muted-foreground">Score</span>
            </div>
          </div>

          <div className="mx-8 mt-4">
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${score}%`, backgroundColor: scoreColor(score) }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Answer Review</h3>
        {test.questions.map((q, i) => {
          const isCorrect = answers[i] === q.correctIndex
          const wasSkipped = answers[i] === null

          return (
            <Card
              key={q.id}
              className={`border-l-4 ${
                isCorrect
                  ? 'border-l-green-500'
                  : wasSkipped
                  ? 'border-l-muted-foreground'
                  : 'border-l-red-500'
              }`}
            >
              <CardContent className="pt-4 pb-3 space-y-2">
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  ) : wasSkipped ? (
                    <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  )}
                  <p className="text-sm font-medium">
                    Q{i + 1}. {q.question}
                  </p>
                </div>

                <div className="ml-6 space-y-1">
                  {q.options.map((opt, j) => (
                    <div
                      key={j}
                      className={`text-xs px-3 py-1.5 rounded-md ${
                        j === q.correctIndex
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium'
                          : j === answers[i] && !isCorrect
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <span className="font-medium mr-1">{String.fromCharCode(65 + j)}.</span>
                      {opt}
                      {j === q.correctIndex && (
                        <span className="ml-1 text-green-600 dark:text-green-400"> ✓ Correct</span>
                      )}
                      {j === answers[i] && !isCorrect && j !== q.correctIndex && (
                        <span className="ml-1 text-red-500"> ✗ Your answer</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex gap-3 pb-6">
        <Button onClick={() => router.push('/candidate/aptitude')} className="flex-1">
          Back to Dashboard
        </Button>
        <Button variant="outline" onClick={onRetake} className="flex-1">
          Retake Test
        </Button>
      </div>
    </div>
  )
}
