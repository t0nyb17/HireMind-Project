"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock } from 'lucide-react'
import { formatTime } from './score-helpers'

interface TestHeaderProps {
  title: string
  currentQ: number
  totalQ: number
  timeLeft: number
}

export function TestHeader({ title, currentQ, totalQ, timeLeft }: TestHeaderProps) {
  const timerClass =
    timeLeft < 60
      ? 'text-red-500'
      : timeLeft < 180
      ? 'text-yellow-500'
      : 'text-foreground'

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <Link href="/candidate/aptitude">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Exit
            </Button>
          </Link>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <p className="text-xs text-muted-foreground pl-1">
          Question {currentQ + 1} of {totalQ}
        </p>
      </div>

      <div className={`flex items-center gap-1.5 text-sm font-mono font-semibold tabular-nums ${timerClass}`}>
        <Clock className="h-4 w-4" />
        {formatTime(timeLeft)}
        {timeLeft < 60 && (
          <span className="text-[10px] animate-pulse ml-1">Time running out!</span>
        )}
      </div>
    </div>
  )
}
