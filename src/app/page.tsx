'use client';

import Link from 'next/link';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <section>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Whiteboard Editor
        </h1>
        <p className="mt-4 max-w-prose text-lg text-muted-foreground">
          A collaborative real-time whiteboard built with Next.js, TLDraw, tRPC
          &amp; TailwindCSS.
        </p>
      </section>

      <div className="flex gap-4">
        <Link href="/editor">
          <Button size="lg">Open Editor</Button>
        </Link>
        <Link
          href="https://github.com/Pablo-Barros/whiteboard-editor"
          target="_blank"
          rel="noreferrer"
        >
          <Button variant="secondary" size="lg">
            <Github className="mr-2 h-4 w-4" /> GitHub
          </Button>
        </Link>
      </div>
    </main>
  );
}
