import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "RAG Chat Interface",
  description: "A chat interface for RAG interactions",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script 
          src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs" 
          type="module"
        ></script>
      </head>
      <body className={montserrat.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
} 