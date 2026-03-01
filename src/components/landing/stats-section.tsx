import { FadeIn } from './fade-in'

const stats = [
  { value: 'Swift', sub: 'Hiring, made faster' },
  { value: 'Fair', sub: 'Data-driven decisions' },
  { value: 'Insightful', sub: 'AI-powered analytics' },
]

export function StatsSection() {
  return (
    <>
      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <section className="bg-muted/40 backdrop-blur-sm">
        <FadeIn>
          <div className="mx-auto grid max-w-4xl grid-cols-1 divide-y divide-border/50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map((s) => (
              <div key={s.value} className="px-6 py-10 text-center">
                <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </>
  )
}
