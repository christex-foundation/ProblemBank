import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "../components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Better font loading performance
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "ProblemBank",
  description: "Find inspiration for your next build with vetted ideas and step-by-step guidance",
  icons: {
    icon: "/images/black%20logo%20mark%20size=48@2x.png",
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'build.christex.foundation',
    siteName: 'ProblemBank',
    title: 'ProblemBank - Find Your Next Build Idea',
    description: 'Find inspiration for your next build with vetted ideas and step-by-step guidance',
    images: [
      {
        url: '/images/hero.png',
        width: 1200,
        height: 630,
        alt: 'ProblemBank - Build Ideas & Resources',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProblemBank - Find Your Next Build Idea',
    description: 'Find inspiration for your next build with vetted ideas and step-by-step guidance',
    images: ['/images/hero.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
