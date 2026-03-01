"use client"

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, LogIn, Users, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import logo from '../../../logo.png'

interface NavbarProps {
  isSignedIn: boolean
}

export function Navbar({ isSignedIn }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <Image
            src={logo}
            alt="HM"
            height={36}
            className="block w-auto mix-blend-multiply dark:invert dark:mix-blend-screen"
          />
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isSignedIn ? (
            <Link href="/dashboard">
              <Button size="sm" className="group text-sm">
                Dashboard
                <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  <LogIn className="mr-1.5 h-3.5 w-3.5" />
                  Sign in
                </Button>
              </Link>

              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="text-sm">
                    Get started
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Get started</DialogTitle>
                    <DialogDescription>
                      Choose how you want to use Hiremind.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-2 pt-2">
                    <Link href="/sign-up?role=recruiter">
                      <div className="group flex items-center gap-3 rounded-xl border border-border/60 p-4 transition-colors hover:border-primary/40 hover:bg-primary/5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">Recruiter</p>
                          <p className="text-xs text-muted-foreground">
                            Hire top talent with AI
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                      </div>
                    </Link>
                    <Link href="/sign-up?role=candidate">
                      <div className="group flex items-center gap-3 rounded-xl border border-border/60 p-4 transition-colors hover:border-primary/40 hover:bg-primary/5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <UserCheck className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">Candidate</p>
                          <p className="text-xs text-muted-foreground">
                            Showcase your skills
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                      </div>
                    </Link>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
