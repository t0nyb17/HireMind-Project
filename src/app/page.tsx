"use client"

import { useAuth } from '@clerk/nextjs'
import { BlobBackground } from '@/components/landing/blob-background'
import { Navbar } from '@/components/landing/navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { StatsSection } from '@/components/landing/stats-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { HowItWorksSection } from '@/components/landing/how-it-works'
import { CtaSection } from '@/components/landing/cta-section'
import { FooterSection } from '@/components/landing/footer-section'

export default function LandingPage() {
  const { isSignedIn } = useAuth()
  const signedIn = isSignedIn === true

  return (
    <div className="relative min-h-screen text-foreground">
      <BlobBackground />
      <Navbar isSignedIn={signedIn} />
      <main>
        <HeroSection isSignedIn={signedIn} />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection isSignedIn={signedIn} />
      </main>
      <FooterSection />
    </div>
  )
}
