"use client"

import { useState, useEffect } from 'react'
import { Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { APTITUDE_TESTS, getStoredResults, type TestResult } from '@/lib/aptitude-tests'
import { scoreColor } from '@/components/aptitude/score-helpers'
import { ScoreGauge } from '@/components/aptitude/score-gauge'
import { ScoreChart } from '@/components/aptitude/score-chart'
import { StatsBar } from '@/components/aptitude/stats-bar'
import { TestCard } from '@/components/aptitude/test-card'

export default function AptitudePage() {
  const [results, setResults] = useState<TestResult[]>([])

  useEffect(() => {
    setResults(getStoredResults())
  }, [])

  const getResult = (testId: string) => results.find((r) => r.testId === testId)

  const attempted = results.filter((r) => APTITUDE_TESTS.some((t) => t.id === r.testId))

  const overallScore =
    attempted.length > 0
      ? Math.round(attempted.reduce((s, r) => s + r.score, 0) / attempted.length)
      : 0

  const chartData = APTITUDE_TESTS.map((test) => {
    const result = getResult(test.id)
    return {
      name: test.title.split(' ')[0],
      score: result?.score ?? 0,
      color: result ? scoreColor(result.score) : '#6366f1',
    }
  })

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Target className="h-7 w-7 text-primary" />
          Aptitude Tests
        </h1>
        <p className="text-muted-foreground mt-1">
          Practice logical reasoning and mathematics. Scores are tracked on your scoreboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center justify-between py-6">
          <CardHeader className="pb-0 text-center pt-0">
            <CardTitle className="text-base">Overall Score</CardTitle>
            <CardDescription className="text-xs">Average across completed tests</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-2 pt-4">
            <ScoreGauge score={overallScore} attempted={attempted.length > 0} />
          </CardContent>
        </Card>

        <ScoreChart data={chartData} />
      </div>

      <StatsBar results={results} />

      <div>
        <h2 className="text-xl font-semibold mb-4">Available Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {APTITUDE_TESTS.map((test) => (
            <TestCard key={test.id} test={test} result={getResult(test.id)} />
          ))}
        </div>
      </div>
    </div>
  )
}
