import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ThemeProvider } from '@/components/theme-provider'

const font = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hiremind - AI-Powered Interview Automation',
  description:
    'Advanced AI-powered interview automation platform designed to modernize and streamline the technical hiring process.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `localStorage.removeItem('theme')` }} />
      </head>
      <body className={font.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
