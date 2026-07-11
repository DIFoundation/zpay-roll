# ZPay-Roll

ZPay-Roll is a Zcash payroll management application built with Next.js and Supabase.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Supabase** - Backend database and authentication
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Hook Form + Zod** - Form validation
- **Framer Motion** - Animations

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `ZCASH_RPC_URL` - Zcash node RPC URL (optional, for broadcasting)
- `ZCASH_RPC_USER` - Zcash RPC username (optional)
- `ZCASH_RPC_PASS` - Zcash RPC password (optional)

3. Set up Supabase database:
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Run the SQL schema from `supabase/schema.sql`

4. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/` - Next.js App Router pages
- `src/components/` - Reusable React components
- `src/lib/` - Utility functions and Supabase client
- `supabase/` - Supabase database schema

## Supabase Setup

The Supabase schema is in `supabase/schema.sql`. This includes:
- Users table (linked to Supabase auth)
- Payroll batches table
- Payroll recipients table
- Row Level Security policies
- Triggers for automatic user creation

## Building for Production

```bash
pnpm build
pnpm start
```

## Features

- Dashboard with payroll statistics
- Create payroll batches with CSV/Excel import
- View payroll history and details
- Broadcast Zcash transactions
- Download payroll receipts
- User authentication via Supabase Auth
# zpay-roll
