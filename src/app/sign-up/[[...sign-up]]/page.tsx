"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SignUp } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { ThemeToggle } from '@/components/theme-toggle'
import { BlobBackground } from '@/components/landing/blob-background'
import { ArrowLeft } from 'lucide-react'
import logo from '../../../../logo.png'

export default function SignUpPage() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === 'dark'

  const clerkAppearance = {
    variables: {
      colorPrimary: isDark ? '#818cf8' : '#6366f1',
      colorBackground: isDark ? '#060d1f' : '#ffffff',
      colorText: isDark ? '#f1f5f9' : '#1e293b',
      colorTextSecondary: isDark ? '#94a3b8' : '#64748b',
      colorInputBackground: isDark ? '#0d1629' : '#f8fafc',
      colorInputText: isDark ? '#f1f5f9' : '#1e293b',
      colorDanger: '#ef4444',
      borderRadius: '0.625rem',
      fontFamily: 'DM Sans, sans-serif',
    },
    elements: {
      card: 'shadow-xl border border-border/50',
      formButtonPrimary: 'shadow-sm transition-opacity hover:opacity-90',
      footerActionLink: 'transition-opacity hover:opacity-80',
      badge: 'hidden',
      footer: { '& .cl-badge': { display: 'none' } },
    },
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
      <BlobBackground />

      {/* Back to home */}
      <div className="fixed top-4 left-4 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/80 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
      </div>

      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-10">
        <div className="rounded-lg border border-border/50 bg-background/80 backdrop-blur">
          <ThemeToggle />
        </div>
      </div>

      {/* Auth card */}
      <div className="relative z-10 w-full max-w-[400px]">
        {/* Logo + heading */}
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="mb-4 h-12 overflow-hidden">
            <Image
              src={logo}
              alt="HM"
              priority
              className="h-[82px] w-auto mix-blend-multiply dark:invert dark:mix-blend-screen"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Join Hiremind and start your journey
          </p>
        </div>

        {/* Clerk component */}
        <SignUp
          appearance={clerkAppearance}
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  )
}
