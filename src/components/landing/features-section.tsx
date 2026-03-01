import {
  Bot,
  BarChart2,
  Target,
  Zap,
  ShieldCheck,
  Gauge,
} from 'lucide-react'
import { FadeIn } from './fade-in'

const features = [
  {
    icon: Bot,
    title: 'AI Interviews',
    desc: 'Context-aware conversations that adapt to each candidate in real-time.',
  },
  {
    icon: BarChart2,
    title: 'Deep Analytics',
    desc: 'Skills breakdown, performance metrics, and benchmark comparisons at a glance.',
  },
  {
    icon: Target,
    title: 'Zero Bias',
    desc: 'Structured evaluations focused purely on skills and competency.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Conduct interviews and get detailed reports in minutes, not days.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Private',
    desc: 'Enterprise-grade security with end-to-end encryption and access controls.',
  },
  {
    icon: Gauge,
    title: 'Scalable',
    desc: 'Handle any volume of candidates while maintaining consistent quality.',
  },
]

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28 lg:py-32">
      <FadeIn>
        <div className="mx-auto mb-14 max-w-lg text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to hire&nbsp;better
          </h2>
          <p className="mt-3 text-[15px] text-muted-foreground">
            Powerful tools designed to make every hire the right one.
          </p>
        </div>
      </FadeIn>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <FadeIn key={f.title} delay={i * 80}>
            <div className="group h-full rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-[15px] font-semibold leading-snug">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
