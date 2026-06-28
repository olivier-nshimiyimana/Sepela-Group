import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Navbar } from "@/components/layout/navbar";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sepela Group | Enterprise Technology Solutions",
  description:
    "Sepela Group builds production-grade media, retail, and event infrastructure for enterprises across Africa and beyond.",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <Navbar />
        {children}
      </body>
    </html>
  );
}