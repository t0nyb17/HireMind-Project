"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Question } from '@/lib/aptitude-tests'

interface QuestionCardProps {
  question: Question
  questionIndex: number
  categoryLabel: string
  selectedAnswer: number | null
  onSelect: (optionIndex: number) => void
}

export function QuestionCard({
  question,
  questionIndex,
  categoryLabel,
  selectedAnswer,
  onSelect,
}: QuestionCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs w-fit">
            {categoryLabel}
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">
            Q{questionIndex + 1}
          </span>
        </div>
        <CardTitle className="text-base leading-relaxed font-medium mt-3">
          {question.question}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2.5">
        {question.options.map((option, j) => {
          const isSelected = selectedAnswer === j
          return (
            <button
              key={j}
              onClick={() => onSelect(j)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150 ${
                isSelected
                  ? 'border-primary bg-primary/10 text-primary font-medium shadow-sm'
                  : 'border-border hover:border-primary/40 hover:bg-muted/50'
              }`}
            >
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold mr-2 ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}
              >
                {String.fromCharCode(65 + j)}
              </span>
              {option}
            </button>
          )
        })}
      </CardContent>
    </Card>
  )
}
