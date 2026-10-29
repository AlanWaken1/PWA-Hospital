# MediStock

**Offline-first medical inventory management PWA for small clinics with unreliable internet.**

MediStock was built as a project around the real needs of a small clinic in Guanajuato, Mexico: 1–2 users, constant stock movement, and an internet connection that drops regularly. The core requirement was simple: *the clinic can't stop working when the Wi-Fi does.*

> **Status:** functional prototype, not deployed in production. See [Known limitations](#known-limitations) and [Roadmap](#roadmap).

## Features

**Inventory**
- Product catalog with categories, units of measure, min/max stock and reorder points
- Batch and expiration tracking, multiple storage locations
- Stock entries and exits with a full movement history (entry, exit, adjustment, waste, expired, return)
- Special product flags: controlled substances, prescription required, refrigeration, fragile

**Alerts & monitoring**
- Real-time alerts via Supabase Realtime (low stock, critical stock, upcoming expirations)
- In-app notification center with sound
- Dashboard with live stats, critical supplies, recent movements and staff activity
- Analytics charts (Recharts)

**Reports**
- Configurable reports with preview
- Export to **PDF** (jsPDF) and **Excel** (SheetJS)

**Offline & PWA**
- Installable PWA (manifest, icons, install prompt)
- Custom service worker: cache-first for static assets, network-first with fallback for navigation, network-only for API calls
- IndexedDB cache (Dexie) for products, inventory and alerts
- Pending-actions queue that syncs automatically when the connection returns
- Offline-aware auth: the session persists locally so the app opens without internet
- Online/offline indicator and sync status banner

**UX**
- Full i18n: Spanish and English (`next-intl`, 400+ keys per language)
- Light/dark mode and selectable accent color themes
- Mobile-first, responsive layout with modal-based workflows
- User manuals in Spanish and English (`/public/manuales`)

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Backend / DB | Supabase (Postgres, Auth, Realtime, Row Level Security) |
| Offline | Dexie (IndexedDB), custom service worker |
| UI | Tailwind CSS, shadcn/ui (Radix), Framer Motion, GSAP |
| Charts & export | Recharts, jsPDF + autotable, SheetJS |
| i18n | next-intl |

## Architecture

```
app/[locale]/        Localized routes (dashboard, inventory, alerts, reports, analytics, staff, settings)
components/          UI: inventory modals, notifications, reports, shared widgets
hooks/               Data hooks (useInventory, useAlerts, useNotifications, useOfflineSync, ...)
contexts/            Auth (offline-aware), theme and accent-color providers
lib/supabase/        Browser / server / middleware Supabase clients
lib/offline/         Dexie schema (db.ts) and sync engine (sync.ts)
public/sw.js         Service worker
messages/            es.json / en.json translations
types/               Database types
```

**Offline flow:** reads go to Supabase when online and refresh the local IndexedDB cache; when offline they are served from the cache. Writes made offline are stored in a `pendingActions` queue and replayed in order when the `online` event fires.

**Main Supabase tables:** `productos`, `categorias`, `inventario`, `ubicaciones`, `movimientos`, `alertas`, `profiles`, `user_preferences`, plus views `vista_stock_total` and `vista_productos_por_caducar`.

## Getting started

**Requirements:** Node.js 18+ and a Supabase project.

```bash
git clone https://github.com/AlanWaken1/PWA-Hospital.git
cd PWA-Hospital
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

Then run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to the default locale (`/es`).

> Note: the service worker only registers in production builds. To test offline mode, run `npm run build && npm start`, open DevTools → Application → Service Workers, and toggle *Offline*.

## Known limitations

I'm documenting these deliberately; they are the next things to fix:

- The offline sync queue does not yet check the error returned by Supabase before marking an action as synced.
- Offline stock movements are queued in a raw shape and are not yet applied transactionally; stock updates should move into a Postgres function (RPC).
- Stock entry/exit currently does read–modify–write from the client (no transaction).
- Conflict resolution is last-write-wins.
- No automated tests yet.
- The database schema and RLS policies are not yet versioned in this repo.
- TypeScript build errors are currently ignored in `next.config.ts`, and there are leftover template components and a duplicated route tree to clean up.

## Roadmap

- [ ] Transactional stock movements via Postgres RPC
- [ ] Reliable sync queue with error handling, retries and conflict strategy
- [ ] Unit and integration tests for sync and stock logic
- [ ] Versioned SQL migrations and RLS policies
- [ ] Patient records module (offline-capable) with role-based access and audit logging
- [ ] Remove dead code and enable strict type checking in the build

## License

Copyright © 2025 Alan Ambriz. All rights reserved.
The source is publicly viewable for evaluation purposes only; it may not be copied, modified or redistributed without permission.
