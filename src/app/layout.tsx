import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "WeatherPlanner - Plan Your Day Based on Weather",
  description: "Plan your day based on weather conditions. Get personalized activity suggestions, track your favorites, find local events, and receive weather alerts. PWA-enabled for offline access.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WeatherPlanner",
  },
  keywords: ["weather", "planner", "activities", "events", "forecast", "outdoor", "indoor"],
  authors: [{ name: "WeatherPlanner" }],
  openGraph: {
    type: "website",
    title: "WeatherPlanner",
    description: "Plan your day based on weather conditions",
    siteName: "WeatherPlanner",
  },
  twitter: {
    card: "summary",
    title: "WeatherPlanner",
    description: "Plan your day based on weather conditions",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 dark:bg-gray-950`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
