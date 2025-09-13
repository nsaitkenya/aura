import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { VoiceInterface } from "@/components/voice-interface"
import { Suspense } from "react"
import { SearchProvider } from "@/lib/SearchContext"
import Script from "next/script"
import "./globals.css"

export const metadata: Metadata = {
  title: "AURA Platform - AI-Powered Environmental Intelligence",
  description: "AI-Powered Unified Resilience Platform for Africa",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Load Google Maps API */}
        <Script 
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=visualization`}
          strategy="beforeInteractive"
        />
        {/* Load Earth Engine API */}
        <Script 
          src="https://ajax.googleapis.com/ajax/libs/earthengine/0.1.365/earthengine-api.min.js"
          strategy="beforeInteractive"
        />
        {/* Load Mapbox GL JS (fallback) */}
        <link 
          href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" 
          rel="stylesheet" 
        />
        <Script 
          src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SearchProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="flex h-screen bg-background">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-auto">{children}</main>
              </div>
              <VoiceInterface />
            </div>
          </Suspense>
          <Analytics />
        </SearchProvider>
      </body>
    </html>
  )
}

