import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
// Remove Script import as we don't need spa-redirect.js for Vercel

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LFG.tech | AI Automation Agency",
  description: "Free up time, reduce cost, and scale faster with our AI automation solutions for forward-thinking businesses.",
  keywords: ["AI automation", "business automation", "AI solutions", "workflow automation", "customer support AI", "data processing"],
  authors: [{ name: "LFG.tech" }],
  creator: "LFG.tech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="any" />
        {/* Removed spa-redirect.js script as it's only needed for GitHub Pages */}
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
