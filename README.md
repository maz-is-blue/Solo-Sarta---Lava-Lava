# Solo Sarto & Lava Lava

A full-stack luxury fashion e-commerce website for two interconnected brands — **Solo Sarto**, a bespoke couture atelier, and **Lava Lava**, its bold, colorful diffusion line.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v7, Framer Motion, Axios |
| Backend | Laravel 11, SQLite |
| Styling | Inline styles + CSS custom properties |
| Fonts | Cormorant Garamond · DM Sans · Dancing Script |

---

## Project Structure

```
Solo Sarta - Lava Lava/
├── frontend/          # React + Vite app (port 5173)
│   ├── public/
│   │   └── assets/    # Images and brand assets
│   └── src/
│       ├── components/
│       │   ├── landing/   # Split-screen landing page
│       │   ├── solo/      # Solo Sarto experience
│       │   ├── lava/      # Lava Lava pages (Home, Collection, Product, Story, Contact)
│       │   └── shared/    # LavaWordmark, ProductSilhouette, CollectionCard, LavaGlass
│       ├── context/       # CartContext
│       ├── data/          # Product data
│       └── services/      # Axios API service
└── backend/           # Laravel 11 REST API (port 8000)
    ├── app/
    │   ├── Http/Controllers/Api/
    │   └── Models/
    ├── database/
    │   ├── migrations/
    │   └── seeders/
    └── routes/
        └── api.php
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PHP 8.3+
- Composer

### 1. Backend

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Run migrations and seed the database (12 Lava Lava products)
php artisan migrate --seed

# Start the development server
php artisan serve
# → http://localhost:8000
```

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
# → http://localhost:5173
```

Both servers must be running. The Vite dev server proxies all `/api` requests to Laravel automatically.

---

## API Endpoints

Base URL: `http://localhost:8000/api/v1`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/products` | List all products (filter by `?cat=Tops`) |
| `GET` | `/products/:slug` | Single product detail |
| `GET` | `/cart` | Get cart items (session-based) |
| `POST` | `/cart` | Add item to cart |
| `PUT` | `/cart/:id` | Update cart item quantity |
| `DELETE` | `/cart/:id` | Remove cart item |
| `POST` | `/contact` | Submit contact form |
| `POST` | `/newsletter` | Subscribe to newsletter |

---

## Pages & Routes

| Route | Page |
|---|---|
| `/` | Split-screen landing — choose Solo Sarto or Lava Lava |
| `/solo` | Solo Sarto — dark luxury couture experience |
| `/lava` | Lava Lava — home with hero, product grid, manifesto |
| `/lava/collection` | Filterable full product collection |
| `/lava/product/:slug` | Product detail with size/colour picker |
| `/lava/story` | Brand story & timeline |
| `/lava/contact` | Contact form & FAQ |

---

## Brands

### Solo Sarto
Bespoke couture atelier established 2018. Dark charcoal aesthetic, hand-drawn SVG dress sketches, gold accents. 11 master tailors, 148 pieces per year.

### Lava Lava
Diffusion line launched 2024. Warm coral → lavender gradient palette, colorful product silhouettes, Drop 04 "Solar Bloom" — 12 pieces, 200–400 editions each.

**Drop 04 products:** The Halo Slip · Neon Bloom · Soft Riot · Velvet Mango · Disco Petal · Tangerine Daze · Lilac Pulse · Cherry Halo · Cosmic Sorbet · Sun Spell · Orchid Flame · Sherbet Blazer

---

## Production Build

```bash
# Frontend
cd frontend
npm run build
# Output: frontend/dist/

# Backend
cd backend
php artisan config:cache
php artisan route:cache
```

---

## License

Private project — all rights reserved. © 2026 Solo Sarto / Lava Lava.
