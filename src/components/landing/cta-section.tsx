"use client"

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FadeIn } from './fade-in'

interface CtaSectionProps {
  isSignedIn: boolean
}

export function CtaSection({ isSignedIn }: CtaSectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28 lg:py-32">
      <FadeIn>
        <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-12 text-center backdrop-blur-sm sm:p-16">
          {/* Gradient glow behind card */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to transform your&nbsp;hiring?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[15px] text-muted-foreground">
              Join forward-thinking companies using AI to build exceptional teams.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {isSignedIn ? (
                <>
                  <Link href="/recruiter">
                    <Button size="lg" className="group h-12 px-7 text-[15px] font-medium shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30">
                      Recruiter Dashboard
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </Link>
                  <Link href="/candidate">
                    <Button variant="outline" size="lg" className="h-12 px-7 text-[15px] font-medium">
                      Candidate Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/sign-up?role=recruiter">
                    <Button size="lg" className="group h-12 px-7 text-[15px] font-medium shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30">
                      Get started free
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </Link>
                  <Link href="/sign-up?role=candidate">
                    <Button variant="outline" size="lg" className="h-12 px-7 text-[15px] font-medium">
                      Explore as candidate
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
