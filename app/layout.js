import './globals.css'

export const metadata = {
  title: 'Ceylon Crunch | Healthy Crunch for Every Home',
  description: 'Ceylon Crunch — Premium Sri Lankan nuts and healthy snacks. Sourced with patience, shared with intention.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
