"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Users, UserCheck, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroSectionProps {
  isSignedIn: boolean
}

const trustBadges = [
  'Reduces hiring time',
  'Free to explore',
  'Unbiased evaluation',
]

export function HeroSection({ isSignedIn }: HeroSectionProps) {
  const [visible, setVisible] = useState(false)
  useEffect(() => setVisible(true), [])

  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-24 lg:pb-32 lg:pt-36">
      <div
        className={`mx-auto max-w-3xl text-center transition-all duration-700 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Headline */}
        <h1 className="text-[2.75rem] font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
          Hire smarter with
          <br />
          <span className="text-primary">AI interviews</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-lg text-[17px] leading-relaxed text-muted-foreground sm:text-lg">
          Intelligent interviews, data-driven insights, and unbiased
          candidate evaluation — all in one platform.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {isSignedIn ? (
            <>
              <Link href="/recruiter">
                <Button size="lg" className="group h-12 px-7 text-[15px] font-medium shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30">
                  <Users className="mr-2 h-4 w-4" />
                  Recruiter Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/candidate">
                <Button variant="outline" size="lg" className="h-12 px-7 text-[15px] font-medium">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Candidate Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign-up?role=recruiter">
                <Button size="lg" className="group h-12 px-7 text-[15px] font-medium shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30">
                  Start hiring
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/sign-up?role=candidate">
                <Button variant="outline" size="lg" className="h-12 px-7 text-[15px] font-medium">
                  Join as candidate
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
          {trustBadges.map((text) => (
            <span key={text} className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-primary/70" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
