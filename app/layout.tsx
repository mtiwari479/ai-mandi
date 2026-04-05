import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next' //tracks users(like google analytics)
import './globals.css' //loads styling (colors, fonts, tailwind) from globals.css
import { ThemeProvider } from "@/components/theme-provider" //this enable light/dark theme

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

// this controls the metadata of the app, such as title, description, and icons also sets up the root layout of the app, including the theme provider for light/dark mode and analytics tracking.
export const metadata: Metadata = {
  title: 'MyRefrence | AI Agents',
  description: 'Find the perfect AI agent for your workflow. Browse agents built to automate tasks, save time, and solve real business problems.',
  generator: 'v0.app',
  icons: {
  icon: '/prism.png',
  apple: '/prism.png',
},
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    /* 2. Add suppressHydrationWarning to the html tag */
    /* This prevents a common Next.js error when using light/dark themes */
    <html lang="en" suppressHydrationWarning> 
      <body className="font-sans antialiased overflow-x-hidden">
        {/* 3. Wrap children with the ThemeProvider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}