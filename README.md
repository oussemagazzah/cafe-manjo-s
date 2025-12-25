# Orderly Table - Restaurant Management System

A modern restaurant and cafe management system built with React, TypeScript, and Supabase. Manage orders, reservations, products, and users with an intuitive interface.

## 🚀 Live Demo

**[View Live Demo](https://YOUR_USERNAME.github.io/orderly-table-main/)**

> **Note**: Replace `YOUR_USERNAME` with your GitHub username in the URL above. The demo is automatically deployed via GitHub Pages.

## Features

- 📊 **Dashboard** - Real-time overview of orders, revenue, and reservations
- 🍽️ **Table Management** - Visual table status tracking (available, occupied, reserved)
- 📝 **Order Management** - Create and track orders with product details
- 📅 **Reservations** - Manage table reservations and bookings
- 🛍️ **Product Management** - Manage menu items and products
- 👥 **User Management** - Handle staff and user accounts
- 🔐 **Authentication** - Secure login with Supabase Auth

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL + Auth)
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to install)
- A Supabase project (for backend services)

### Installation

1. Clone the repository:

```bash
git clone <YOUR_GIT_URL>
cd orderly-table-main
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

   - Create a `.env` file in the root directory
   - Add your Supabase credentials:

   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run database migrations:

   - Navigate to your Supabase dashboard
   - Run the SQL migrations from the `supabase/migrations/` directory

5. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/       # React components
│   ├── layout/      # Layout components (Sidebar, MainLayout)
│   ├── orders/      # Order-related components
│   ├── tables/      # Table management components
│   └── ui/          # shadcn/ui components
├── contexts/        # React contexts (Auth)
├── hooks/           # Custom React hooks
├── integrations/    # External service integrations (Supabase)
├── pages/           # Page components
├── types/           # TypeScript type definitions
└── lib/             # Utility functions
```

## Deployment

### GitHub Pages (Automatic)

This project is configured for automatic deployment to GitHub Pages:

1. **Enable GitHub Pages**:

   - Go to your repository Settings → Pages
   - Under "Source", select "GitHub Actions"

2. **Set up Secrets** (if using Supabase):

   - Go to Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `VITE_SUPABASE_URL` - Your Supabase project URL
     - `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key

3. **Deploy**:
   - Push to the `main` branch
   - GitHub Actions will automatically build and deploy your site
   - The site will be available at: `https://YOUR_USERNAME.github.io/orderly-table-main/`

### Manual Build

Build the project for production:

```bash
npm run build
```

The `dist` folder will contain the production-ready files that can be deployed to any static hosting service (Vercel, Netlify, etc.).

### Custom Base Path

If your repository has a different name, update the base path in `vite.config.ts` or set the `VITE_BASE_PATH` environment variable:

```bash
VITE_BASE_PATH=/your-repo-name/ npm run build
```

## License

This project is private and proprietary.
