"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { getTestById, saveResult, type TestResult } from '@/lib/aptitude-tests'
import { Progress } from '@/components/ui/progress'
import { TestHeader } from '@/components/aptitude/test-header'
import { QuestionCard } from '@/components/aptitude/question-card'
import { QuestionNav } from '@/components/aptitude/question-nav'
import { ResultsView } from '@/components/aptitude/results-view'

export default function AptitudeTestPage({
  params,
}: {
  params: { testId: string }
}) {
  const { testId } = params
  const test = getTestById(testId)

  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const answersRef = useRef<(number | null)[]>([])

  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  useEffect(() => {
    if (test) {
      const blank = new Array(test.questions.length).fill(null)
      setAnswers(blank)
      answersRef.current = blank
      setTimeLeft(test.timeLimitMinutes * 60)
      setCurrentQ(0)
      setSubmitted(false)
      setScore(0)
    }
  }, [test])

  const handleSubmit = useCallback(() => {
    if (!test) return
    const current = answersRef.current
    let correct = 0
    test.questions.forEach((q, i) => {
      if (current[i] === q.correctIndex) correct++
    })
    const s = Math.round((correct / test.questions.length) * 100)
    setScore(s)
    setSubmitted(true)
    const result: TestResult = {
      testId: test.id,
      score: s,
      correctAnswers: correct,
      totalQuestions: test.questions.length,
      completedAt: new Date().toISOString(),
    }
    saveResult(result)
  }, [test])

  useEffect(() => {
    if (submitted || !test || timeLeft <= 0) return
    const t = setTimeout(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearTimeout(t)
  }, [timeLeft, submitted, test, handleSubmit])

  const handleRetake = useCallback(() => {
    if (!test) return
    const blank = new Array(test.questions.length).fill(null)
    setAnswers(blank)
    answersRef.current = blank
    setCurrentQ(0)
    setSubmitted(false)
    setScore(0)
    setTimeLeft(test.timeLimitMinutes * 60)
  }, [test])

  const handleSelect = useCallback((optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[currentQ] = optionIndex
      return next
    })
  }, [currentQ])

  if (!test) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <AlertCircle className="h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground">Test not found.</p>
        <Link href="/candidate/aptitude">
          <Button variant="outline">Back to Aptitude Tests</Button>
        </Link>
      </div>
    )
  }

  if (submitted) {
    return (
      <ResultsView
        test={test}
        answers={answers}
        score={score}
        onRetake={handleRetake}
      />
    )
  }

  const answered = answers.filter((a) => a !== null).length
  const progress = (answered / test.questions.length) * 100

  const categoryLabel =
    test.category === 'mixed'
      ? currentQ < 5 ? 'Logical Reasoning' : 'Mathematics'
      : test.category === 'logical'
      ? 'Logical Reasoning'
      : 'Mathematics'

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <TestHeader
        title={test.title}
        currentQ={currentQ}
        totalQ={test.questions.length}
        timeLeft={timeLeft}
      />

      <div className="space-y-1.5">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {answered} of {test.questions.length} answered
        </p>
      </div>

      <QuestionCard
        question={test.questions[currentQ]}
        questionIndex={currentQ}
        categoryLabel={categoryLabel}
        selectedAnswer={answers[currentQ]}
        onSelect={handleSelect}
      />

      <QuestionNav
        currentQ={currentQ}
        totalQ={test.questions.length}
        answers={answers}
        onPrev={() => setCurrentQ((q) => Math.max(0, q - 1))}
        onNext={() => setCurrentQ((q) => Math.min(test.questions.length - 1, q + 1))}
        onJump={setCurrentQ}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
