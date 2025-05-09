import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Moskal | AI Powered Social Media Monitoring',
  description: 'AI-powered social media monitoring and analytics platform',
  icons: {
    icon: '/moskal-logo.png',
    apple: '/moskal-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
