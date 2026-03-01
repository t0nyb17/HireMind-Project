"use client"

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, Play, RotateCcw } from 'lucide-react'
import type { AptitudeTest, TestResult } from '@/lib/aptitude-tests'
import { scoreColor, scoreLabel } from './score-helpers'

interface TestCardProps {
  test: AptitudeTest
  result?: TestResult
}

export function TestCard({ test, result }: TestCardProps) {
  const router = useRouter()
  const sl = result ? scoreLabel(result.score) : null
  const completedDate = result
    ? new Date(result.completedAt).toLocaleDateString()
    : null

  return (
    <Card
      className="flex flex-col hover:border-primary/40 transition-colors"
      style={{ borderTop: `3px solid ${test.color}` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <span className="text-3xl">{test.icon}</span>
          {result && (
            <Badge variant="outline" className={`text-xs font-semibold ${sl?.className}`}>
              {result.score}/100
            </Badge>
          )}
        </div>
        <CardTitle className="text-base mt-2">{test.title}</CardTitle>
        <CardDescription className="text-xs leading-relaxed">
          {test.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {test.questions.length} questions
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {test.timeLimitMinutes} min
          </span>
        </div>

        {result && (
          <div className="rounded-lg bg-muted/50 px-3 py-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Correct</span>
              <span className="font-medium">
                {result.correctAnswers}/{result.totalQuestions}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${result.score}%`,
                  backgroundColor: scoreColor(result.score),
                }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Last attempt: {completedDate}
            </p>
          </div>
        )}

        <Button
          size="sm"
          className="mt-auto w-full"
          style={result ? {} : { backgroundColor: test.color }}
          variant={result ? 'outline' : 'default'}
          onClick={() => router.push(`/candidate/aptitude/test/${test.id}`)}
        >
          {result ? (
            <>
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Retake Test
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 mr-1.5" />
              Start Test
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
