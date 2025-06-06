import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { RootProvider } from "./_components/providers/root-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Whiteboard Editor",
  description: "A collaborative whiteboard editor built with Next.js and TLDraw",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
