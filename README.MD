# GearUp 🏋️

**A multi-vendor sports & outdoor gear rental marketplace API.**

Customers browse and rent gear from independent providers, pay via Stripe, and leave reviews after return. Providers manage their own inventory and incoming rental orders. Admins oversee users, listings, and platform-wide activity.

---

## Tech Stack

- **Runtime:** Node.js, Express, TypeScript
- **Database:** PostgreSQL, via Prisma ORM
- **Auth:** JWT (access + refresh tokens), bcrypt password hashing
- **Payments:** Stripe Checkout (hosted payment page + webhook confirmation)

---

## Roles

| Role | Can do |
|---|---|
| **Customer** | Browse gear, place rental orders, pay, track order status, leave reviews |
| **Provider** | Manage own gear inventory, view/confirm/reject incoming orders |
| **Admin** | Manage users (suspend/activate), view all gear and rentals platform-wide |

Role is selected at registration (customer/provider only) — admin accounts are never self-registered; they're created directly in the database or promoted by an existing admin.

---

## Architecture

Built with role-based feature modules rather than a single monolithic structure. Each module owns its own routes, controller, service, and interface:

```
src/modules/
  authentication/     — register, login, refresh token, profile
  gears/              — public gear browsing and filtering
  categories/          — public category listing, admin management
  providerManagement/  — provider gear CRUD, order confirm/reject
  rentalOrders/        — order creation, order history
  payments/             — Stripe Checkout sessions, webhook handling
  reviews/              — post-rental reviews
  adminManagement/      — user/gear/rental oversight
```

A shared `globalErrorHandler` normalizes Prisma errors, validation errors, and manually thrown errors into consistent JSON responses.

---

## Key Design Decisions

- **One gear item per order.** Customers renting multiple different items place multiple orders — this keeps payment, confirmation, and status tracking simple, since each order maps to exactly one provider.
- **Categories are auto-created and normalized.** Providers type a category name when listing gear; matching is case-insensitive and whitespace-trimmed to prevent duplicates like "Cycling" vs "cycling".
- **Soft deletes for gear.** Removing a listing sets `is_active: false` rather than deleting the row, preserving historical order/review integrity.
- **Payment status lives only on the `Payment` table**, not duplicated onto `RentOrders`, to avoid two sources of truth staying in sync.
- **Stock (`available_quantity`) decrements at order placement**, not at provider confirmation, to prevent double-booking the last unit; it's restored automatically if an order is cancelled.

---

## Setup

```bash
npm install
```

Create a `.env` file as the .env.example:


Run migrations and generate the Prisma Client:
```bash
npx prisma migrate dev
```

Start the dev server:
```bash
npm run dev
```

For Stripe webhook testing locally, run the Stripe CLI alongside the server:
```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

---

## API Overview

| Resource | Base path |
|---|---|
| Auth | `/api/auth` |
| Gear (public) | `/api/gear` |
| Categories | `/api/categories` |
| Provider management | `/api/provider` |
| Rental orders | `/api/rentals` |
| Payments | `/api/payments` |
| Reviews | `/api/reviews` |
| Admin | `/api/admin` |

Full endpoint-by-endpoint testing steps and sample payloads are in [`TESTING.md`](./TESTING.md).

