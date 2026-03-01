import { Briefcase, Bot, TrendingUp } from 'lucide-react'
import { FadeIn } from './fade-in'

const steps = [
  {
    num: '1',
    icon: Briefcase,
    title: 'Create a job',
    desc: 'Define roles, skills, and focus areas. Our AI generates tailored interview flows and scoring rubrics automatically.',
  },
  {
    num: '2',
    icon: Bot,
    title: 'AI interviews',
    desc: 'Candidates engage in structured, adaptive conversations with real-time competency analysis.',
  },
  {
    num: '3',
    icon: TrendingUp,
    title: 'Get insights',
    desc: 'Receive detailed reports and compare candidates side-by-side with comprehensive analytics.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="bg-muted/30 backdrop-blur-sm">
      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="mx-auto max-w-6xl px-6 py-28 lg:py-32">
        <FadeIn>
          <div className="mx-auto mb-14 max-w-lg text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Three steps to better hiring
            </h2>
            <p className="mt-3 text-[15px] text-muted-foreground">
              A simple, streamlined process from job posting to final decision.
            </p>
          </div>
        </FadeIn>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <FadeIn key={step.num} delay={i * 100}>
              <div className="group h-full rounded-2xl border border-border/60 bg-card/60 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {step.num}
                  </span>
                  <step.icon className="h-5 w-5 text-muted-foreground/40 transition-colors group-hover:text-primary" />
                </div>
                <h3 className="text-[15px] font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  )
}
