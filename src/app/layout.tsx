import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

import { RootProvider } from "./_components/providers/root-provider";

// Load the Inter font with the 'latin' subset
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
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
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
