import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlobalBackground } from "@/components/canvas/global-background";

const interSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "404Lab.agency | Engineering the Unseen",
  description: "Elite digital collective bridging Surreal Design, Autonomous AI, and Cryptographic Infrastructure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${interSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0B]" suppressHydrationWarning>
        <GlobalBackground />
        <Header />
        <div className="relative z-10 flex flex-col min-h-full">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
