import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "tvOS 27 | Your Android TV, reimagined",
  description:
    "A friendly, reversible setup guide for tvOS 27 on Android TV and Google TV. Not compatible with non-Android smart TVs."
}

export const viewport: Viewport = {
  themeColor: "#080b10",
  colorScheme: "dark",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
