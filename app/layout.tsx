import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ScrollToTop } from "@/components/scroll-to-top";
import { JsonLd } from "@/components/json-ld";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sleepyleo.com"), // Change to your actual domain
  title: {
    default: "SleepyLeo - Fullstack Developer Portfolio | Professional Oversleeper",
    template: "%s | SleepyLeo",
  },
  description:
    "SleepyLeo's Portfolio - A Fullstack Developer who codes during the day and dreams in TypeScript at night. Explore projects, skills, and more. Warning: May contain excessive caffeine and sarcasm.",
  keywords: [
    "sleepyleo",
    "sleepy leo",
    "sleepyleo portfolio",
    "sleepyleo developer",
    "fullstack developer",
    "portfolio",
    "typescript",
    "react",
    "next.js",
    "web development",
    "software engineer",
  ],
  authors: [{ name: "SleepyLeo", url: "https://www.sleepyleo.com" }],
  creator: "SleepyLeo",
  publisher: "SleepyLeo",
  openGraph: {
    title: "SleepyLeo - Fullstack Developer Portfolio",
    description: "SleepyLeo's Portfolio - Fullstack Dev | Professional Oversleeper | Bugs' Worst Nightmare",
    type: "website",
    locale: "en_US",
    url: "https://www.sleepyleo.com",
    siteName: "SleepyLeo",
    images: [
      {
        url: "/og-image.png", // Create this image for social sharing
        width: 1200,
        height: 630,
        alt: "SleepyLeo Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SleepyLeo - Fullstack Developer Portfolio",
    description: "SleepyLeo's Portfolio - Fullstack Dev | Professional Oversleeper | Bugs' Worst Nightmare",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add these after setting up Google Search Console
    // google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://www.sleepyleo.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <JsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-zinc-900`}
      > 
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}


