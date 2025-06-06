# Whiteboard Editor

A collaborative whiteboard editor built with Next.js, Tldraw, and tRPC. This application allows users to create and modify drawings in real-time with type-safe API calls.

## Features

- 🎨 Interactive whiteboard using Tldraw
- 🔄 Real-time updates
- 🛠️ Type-safe API with tRPC
- 🎨 Modern UI with Shadcn components
- 🚀 Server-side rendering with Next.js

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Tldraw](https://tldraw.com/) - Whiteboard library
- [tRPC](https://trpc.io/) - End-to-end typesafe APIs
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn](https://ui.shadcn.com/) - UI components
- [TypeScript](https://www.typescriptlang.org/) - Type checking

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/whiteboard-editor.git
   cd whiteboard-editor
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Set up the database
   ```bash
   # Create a .env file and add your database URL
   cp .env.example .env
   # Edit .env and add your database connection string
   
   # Run database migrations
   npx prisma migrate dev --name init
   # This will create the database tables and generate the Prisma Client
   
   # For production deployments, use:
   # npx prisma migrate deploy
   ```

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app` - Next.js app router pages and layouts
- `/src/components` - Reusable React components
- `/src/server` - tRPC router and API endpoints
- `/src/styles` - Global styles and Tailwind configuration
- `/public` - Static assets

## Available Scripts

- `npm run dev` - Start development server with Turbopack for faster development
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint with auto-fix for code quality
- `npm run format` - Format code using Prettier

> **Note**: The `postinstall` script automatically runs `prisma generate` after package installation to generate the Prisma Client.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
