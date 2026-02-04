import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ScrollToTop } from "@/components/scroll-to-top";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SleepyLeo Hub | Fullstack Dev & Professional Oversleeper",
    template: "%s | SleepyLeo Hub",
  },
  description:
    "Portfolio of a Fullstack Developer who codes during the day and dreams in TypeScript at night. Warning: May contain excessive caffeine and sarcasm.",
  keywords: [
    "fullstack developer",
    "portfolio",
    "typescript",
    "react",
    "next.js",
    "web development",
  ],
  authors: [{ name: "SleepyLeo" }],
  openGraph: {
    title: "SleepyLeo Hub",
    description: "Fullstack Dev | Professional Oversleeper | Bugs' Worst Nightmare",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SleepyLeo Hub",
    description: "Fullstack Dev | Professional Oversleeper | Bugs' Worst Nightmare",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-zinc-900`}
      > 
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}


