import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AlgoEdge',
  description: 'alogorithmic trading platform',
  generator: 'algotradeing',
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
