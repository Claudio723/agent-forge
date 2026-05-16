# AgentForge

Your personal AI workbench — manage skills, MCPs, prompts, API keys, projects, and notes. Built with Next.js 16, Shadcn/UI, and Supabase.

## Prerequisites

- Node.js 18+
- npm
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for local dev)
- A Supabase project (free tier works)

## Setup

### 1. Clone and install

```bash
git clone <repo-url> agent-forge
cd agent-forge
npm install
```

### 2. Environment variables

Copy the example and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

You can find these in your Supabase dashboard under **Project Settings → API**.

### 3. Database setup

Push the initial migration to your Supabase database:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

This creates:
- `profiles` table
- Auto-profile-creation trigger on user signup
- Row Level Security policies

### 4. Auth configuration

In your Supabase dashboard, go to **Authentication → URL Configuration**:

- **Site URL:** `http://localhost:3000`
- **Redirect URLs:** add `http://localhost:3000/auth/callback`

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- **`/`** — Public landing page (redirects to `/dashboard` if logged in)
- **`/login`** — Sign in / sign up
- **`/dashboard`** — Main workspace (requires login)

## Project Structure

```
src/
  app/
    (auth)/            # Auth pages (login, actions)
    (dashboard)/       # Dashboard routes (protected)
    auth/callback/     # Supabase OAuth callback
    layout.tsx         # Root layout (theme, providers)
    page.tsx           # Landing page (redirects if authed)
  components/
    app-shell.tsx      # Conditional sidebar + cmd menu
    providers.tsx      # ThemeProvider + TooltipProvider
    theme-toggle.tsx   # Dark/light mode toggle
    landing/           # Landing page components
    layout/            # Sidebar, Command Menu
    ui/                # Shadcn/UI components
  lib/
    supabase/          # SSR clients (server, middleware, browser)
    utils.ts           # cn() helper
  middleware.ts        # Auth redirect middleware
supabase/
  migrations/          # SQL migrations
```

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** + Shadcn/UI
- **Supabase** (Auth, Postgres, RLS)
- **@supabase/ssr** (Server Components + Middleware)
- **next-themes** (Dark mode)
- **framer-motion** (Animations)
- **lucide-react** (Icons)
- **cmdk** (⌘K command menu)

## Phases

- ✅ **Phase 1** — Setup, Auth, Landing Page, Dashboard shell
- ⬜ **Phase 2** — Full database schema + RLS
- ⬜ **Phase 3** — Core features (Notes, Skills, Prompt Builder, Projects, Vault)
- ⬜ **Phase 4** — Polish, Export, Onboarding, PWA

## License

MIT
