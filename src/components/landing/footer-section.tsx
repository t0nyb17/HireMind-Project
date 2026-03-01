import Link from 'next/link'
import Image from 'next/image'
import logo from '../../../logo.png'

export function FooterSection() {
  return (
    <footer className="border-t border-border/50">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <div className="h-7 overflow-hidden">
            <Image
              src={logo}
              alt="HM"
              className="h-[48px] w-auto mix-blend-multiply dark:invert dark:mix-blend-screen"
            />
          </div>
          <span className="text-sm text-muted-foreground">
            AI-powered interviews for modern hiring.
          </span>
        </div>
        <div className="flex gap-5 text-sm text-muted-foreground">
          <Link href="#" className="transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="#" className="transition-colors hover:text-foreground">
            How it works
          </Link>
        </div>
      </div>
    </footer>
  )
}
