# BlackLuxe Commerce (Supabase Full-Stack E-commerce)

A premium dark-themed, production-oriented e-commerce web app using React + Supabase.

## Features

- Supabase Auth (signup/login/logout)
- Protected routes for cart, checkout, orders, admin
- Dynamic product listing from Supabase
- Search + price filtering
- Shopping cart with quantity management (persisted in Supabase)
- Checkout + order history
- Admin dashboard (create, edit, delete, image upload)
- Toast notifications, loading states, error handling
- Responsive black glassmorphism UI
- Vercel/Netlify deployment ready

## Tech Stack

- Frontend: React (Vite), CSS
- Backend/DB/Auth/Storage: Supabase

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Add your Supabase credentials in `.env`.

4. Run the app:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## Supabase Database Setup

Run SQL from `supabase/schema.sql` in your Supabase SQL editor.

Create a public storage bucket named `product-images` for product uploads.

## Recommended RLS

- Products: public read, admin write
- Cart/Orders: user can only access own rows
- Users: user can read own profile, admins manageable via server-side process

## Deployment

Works on Vercel and Netlify.

- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables.
- Build command: `npm run build`
- Publish directory: `dist`
