"use client"

import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'

interface QuestionNavProps {
  currentQ: number
  totalQ: number
  answers: (number | null)[]
  onPrev: () => void
  onNext: () => void
  onJump: (index: number) => void
  onSubmit: () => void
}

export function QuestionNav({
  currentQ,
  totalQ,
  answers,
  onPrev,
  onNext,
  onJump,
  onSubmit,
}: QuestionNavProps) {
  const isFirst = currentQ === 0
  const isLast = currentQ === totalQ - 1
  const allAnswered = answers.filter((a) => a !== null).length === totalQ

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" size="sm" onClick={onPrev} disabled={isFirst}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Prev
        </Button>

        <div className="flex gap-1 flex-wrap justify-center max-w-[260px]">
          {Array.from({ length: totalQ }).map((_, i) => (
            <button
              key={i}
              onClick={() => onJump(i)}
              title={`Question ${i + 1}`}
              className={`w-7 h-7 rounded-full text-xs font-semibold transition-all ${
                i === currentQ
                  ? 'bg-primary text-primary-foreground scale-110 shadow'
                  : answers[i] !== null
                  ? 'bg-primary/20 text-primary border border-primary/40'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {isLast ? (
          <Button size="sm" onClick={onSubmit} className="bg-green-600 hover:bg-green-700 text-white">
            Submit
            <CheckCircle className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        ) : (
          <Button size="sm" onClick={onNext}>
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>

      {allAnswered && !isLast && (
        <div className="flex justify-end">
          <Button size="sm" onClick={onSubmit} className="bg-green-600 hover:bg-green-700 text-white">
            <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
            Submit All Answers
          </Button>
        </div>
      )}
    </div>
  )
}
