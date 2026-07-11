# GearUp API Testing Guide

This document outlines the manual testing procedure for all GearUp API endpoints, covering happy paths, authorization boundaries, and edge cases.

## Prerequisites

- Server running locally (`npm run dev`)
- Postman (or similar) with cookies enabled for the base URL
- Stripe CLI running for webhook forwarding: `stripe listen --forward-to localhost:5000/api/payments/webhook`
- Fresh or seeded database

---

## Seed Data

Use these request bodies, in order, to populate a fresh database before running the test matrix below.

### Users

**Register — Provider 1**
```json
{
  "name": "Rasel Ahmed",
  "email": "rasel.provider@example.com",
  "password": "Password123!",
  "role": "PROVIDER"
}
```

**Register — Provider 2**
```json
{
  "name": "Nusrat Jahan",
  "email": "nusrat.provider@example.com",
  "password": "Password123!",
  "role": "PROVIDER"
}
```

**Register — Customer 1**
```json
{
  "name": "Fahim Chowdhury",
  "email": "fahim.customer@example.com",
  "password": "Password123!",
  "role": "CUSTOMER"
}
```

**Register — Customer 2**
```json
{
  "name": "Tania Islam",
  "email": "tania.customer@example.com",
  "password": "Password123!",
  "role": "CUSTOMER"
}
```

**Admin** — Admin can't register through the public endpoint, with this credential, admin can be logged in. 
```json
{

  "email": "admin@example.com",
  "password": "ADmin123!",

}
```

### Gear items (create as Provider 1 / Provider 2, via `POST /api/provider/gear`)

**Provider 1 — Trek Mountain Bike** (save response `item_id` as `gearId1`)
```json
{
  "item_name": "Trek Mountain Bike",
  "description": "21-speed mountain bike, great for trails and city rides.",
  "brand": "Trek",
  "price": 15.00,
  "quantity": 3,
  "category_name": "Cycling"
}
```

**Provider 1 — 4-Person Camping Tent**
```json
{
  "item_name": "4-Person Camping Tent",
  "description": "Waterproof tent, easy setup, includes ground sheet.",
  "brand": "Coleman",
  "price": 25.00,
  "quantity": 2,
  "category_name": "Camping"
}
```

**Provider 2 — Inflatable Kayak** (save response `item_id` as `gearId2`)
```json
{
  "item_name": "Inflatable Kayak",
  "description": "Single-person kayak with paddle and pump included.",
  "brand": "Intex",
  "price": 30.00,
  "quantity": 2,
  "category_name": "Water Sports"
}
```

**Provider 2 — Adjustable Dumbbell Set**
```json
{
  "item_name": "Adjustable Dumbbell Set",
  "description": "5-25kg adjustable dumbbells, pair.",
  "brand": "Bowflex",
  "price": 10.00,
  "quantity": 5,
  "category_name": "Fitness"
}
```

**Provider 1 — Hiking Backpack 50L**
```json
{
  "item_name": "Hiking Backpack 50L",
  "description": "Durable trekking backpack with rain cover.",
  "brand": "Osprey",
  "price": 12.00,
  "quantity": 4,
  "category_name": "Hiking"
}
```

### Rental order (create as Customer 1, via `POST /api/rentals`)

**Order on `gearId2`** (save response `order_id` as `orderId1`)
```json
{
  "item_id": "REPLACE_WITH_gearId2",
  "quantity": 1,
  "pickup_date": "2026-07-20",
  "end_date": "2026-07-23"
}
```

### Payment (create as Customer 1, via `POST /api/payments/create`)

```json
{
  "order_id": "REPLACE_WITH_orderId1",
  "method": "card",
  "provider": "Stripe"
}
```
Complete checkout in the browser using Stripe's test card:
```
Card number: 4242 4242 4242 4242
Expiry: 12/34
CVC: 123
ZIP: 12345
```

### Review (create as Customer 1, after order status is `RETURNED`, via `POST /api/reviews`)

```json
{
  "order_id": "REPLACE_WITH_orderId1",
  "rating": 5,
  "review": "Bike was in great condition, smooth gears and easy pickup."
}
```

**Notes on seeding:**
- Categories ("Cycling," "Camping," "Water Sports," "Fitness," "Hiking") are created automatically via find-or-create when the gear items above are submitted — no separate category-creation step needed.
- Replace every `REPLACE_WITH_...` placeholder with the real ID returned from the corresponding prior response.
- For a faster, repeatable reset between test runs, consider wrapping the above into a Postman Collection with test scripts that auto-save `gearId1`, `gearId2`, `orderId1`, etc. as environment variables after each response, rather than copying manually each time.

---

## 1. Authentication (`/api/auth`)

| # | Test | Request | Expected Result |
|---|---|---|---|
| 1.1 | Register provider 1 | `POST /register` | 201, user created, password excluded from response |
| 1.2 | Register provider 2 | `POST /register` | 201 |
| 1.3 | Register customer 1 | `POST /register` | 201 |
| 1.4 | Register customer 2 | `POST /register` | 201 |
| 1.5 | Duplicate email | `POST /register` with existing email | 4xx, "user already exists" |
| 1.6 | **Security:** role injection | `POST /register` with `"role": "ADMIN"` | Must NOT create an admin account |
| 1.7 | Login | `POST /login` correct credentials | 200, auth cookies set |
| 1.8 | Login wrong password | `POST /login` bad password | 4xx, clean error (not 500) |
| 1.9 | Get profile unauthenticated | `GET /me` no cookie | 401 |
| 1.10 | Get profile authenticated | `GET /me` | 200, correct user data |
| 1.11 | **Security:** role escalation | `PUT /editProfile` with `"role": "ADMIN"` | Role must NOT change — verify via `/me` |
| 1.12 | Refresh token | `POST /refresh-token` | 200, new access token issued |

---

## 2. Categories (`/api/categories`)

| # | Test | Request | Expected Result |
|---|---|---|---|
| 2.1 | List categories | `GET /` | 200, list (may be empty initially) |
| 2.2 | Normalization — lowercase | Create gear with `category_name: "cycling"` | Category "Cycling" created |
| 2.3 | Normalization — uppercase | Create gear with `category_name: "CYCLING"` | Reuses existing "Cycling", no duplicate |
| 2.4 | Normalization — whitespace | Create gear with `category_name: "  Cycling  "` | Reuses existing "Cycling", no duplicate |
| 2.5 | Update category (admin) | `PATCH /:id` | 200, name updated |
| 2.6 | Update category (non-admin) | `PATCH /:id` as customer | 403 |
| 2.7 | Delete category in use | `DELETE /:id` on a category linked to gear | 4xx, blocked with clear message |
| 2.8 | Delete unused category | `DELETE /:id` on an orphaned category | 200, deleted |

---

## 3. Provider — Gear Management (`/api/provider`)

| # | Test | Request | Expected Result |
|---|---|---|---|
| 3.1 | Create gear (provider 1) | `POST /gear` | 201, save as `gearId1` |
| 3.2 | Create gear (provider 2) | `POST /gear` | 201, save as `gearId2` |
| 3.3 | Create gear as customer | `POST /gear` | 403 |
| 3.4 | Price precision | `POST /gear` with `price: 15.999` | Stored rounded to 2 decimals |
| 3.5 | Missing required field | `POST /gear` without `item_name` | Clean 4xx via error handler |
| 3.6 | Get own gear | `GET /gear` as provider 1 | 200, only provider 1's items |
| 3.7 | Update another provider's gear | `PUT /gear/:gearId2` as provider 1 | 4xx, "not authorized" |
| 3.8 | Update own gear | `PUT /gear/:gearId1` | 200, updated |
| 3.9 | Update gear category | `PUT /gear/:gearId1` with new `category_name` | New category created, linked correctly |
| 3.10 | Soft delete gear | `DELETE /gear/:gearId1` | 200, `is_active: false` |
| 3.11 | Deleted gear hidden publicly | `GET /api/gear` after 3.10 | `gearId1` does not appear |

*Re-create a fresh active gear item after this section for later steps.*

---

## 4. Public Gear Browsing (`/api/gear`)

| # | Test | Request | Expected Result |
|---|---|---|---|
| 4.1 | List all gear | `GET /` | 200, all active items with category + provider |
| 4.2 | Filter by category | `GET /?category_id=<id>` | Correctly filtered |
| 4.3 | Filter by brand | `GET /?brand=Trek` | Case-insensitive match |
| 4.4 | Filter by price range | `GET /?minPrice=10&maxPrice=30` | Correct range |
| 4.5 | Search term | `GET /?searchTerm=tent` | Partial, case-insensitive match |
| 4.6 | Filter by availability | `GET /?availability=true` | Only items with stock > 0 |
| 4.7 | Invalid price param | `GET /?minPrice=abc` | Clean error, not a crash |
| 4.8 | Get gear details | `GET /:gearId2` | 200, full details with category + provider |
| 4.9 | Nonexistent gear ID | `GET /00000000-0000-0000-0000-000000000000` | 404 via `P2025` handling |

---

## 5. Rental Orders (`/api/rentals`)

| # | Test | Request | Expected Result |
|---|---|---|---|
| 5.1 | Create order | `POST /` as customer 1, renting `gearId2` | 201, `total_amount` correct, stock decremented |
| 5.2 | Self-rental attempt | `POST /` as provider 2 renting `gearId2` | 4xx, blocked |
| 5.3 | Invalid date range | `POST /` with `end_date` before `pickup_date` | 4xx |
| 5.4 | Quantity exceeds stock | `POST /` with excessive `quantity` | 4xx |
| 5.5 | Get own orders | `GET /` as customer 1 | 200, only their orders |
| 5.6 | View another customer's order | `GET /:orderId1` as customer 2 | 4xx, blocked |
| 5.7 | View as owning provider | `GET /:orderId1` as provider 2 | 200, allowed |
| 5.8 | View as admin | `GET /:orderId1` as admin | 200, allowed |
| 5.9 | Provider views incoming orders | `GET /api/provider/orders` as provider 2 | 200, includes order from 5.1 |
| 5.10 | Update order not owned | `PATCH /api/provider/orders/:orderId1` as provider 1 | 4xx, blocked |
| 5.11 | Confirm order | `PATCH /api/provider/orders/:orderId1` → `CONFIRMED` | 200 |
| 5.12 | Cancel order — stock restore | `PATCH .../orders/:id` → `CANCELLED` on a separate order | 200, verify stock restored via `GET /api/gear/:id` |

---

## 6. Payments (`/api/payments`) — Stripe Checkout

| # | Test | Request | Expected Result |
|---|---|---|---|
| 6.1 | Create payment session | `POST /create` with `order_id: orderId1` | 201, returns `checkoutUrl` |
| 6.2 | Complete checkout | Open `checkoutUrl`, pay with `4242 4242 4242 4242` | Redirects to success URL |
| 6.3 | Verify webhook fired | Check `stripe listen` terminal | `checkout.session.completed --> 200` |
| 6.4 | Confirm payment status | `GET /:paymentId1` | `status: COMPLETED`, `paidAt` set |
| 6.5 | Duplicate payment attempt | `POST /create` on already-paid order | 4xx, "already paid" |
| 6.6 | Payment history | `GET /` as customer 1 | 200, full list |
| 6.7 | View another user's payment | `GET /:paymentId1` as customer 2 | 4xx, blocked |
| 6.8 | Pay for another customer's order | `POST /create` as customer 1 for customer 2's order | 4xx, blocked |
| 6.9 | Declined card | Checkout with `4000 0000 0000 0002` | Payment fails, status reflects failure |

---

## 7. Reviews (`/api/reviews`)

| # | Test | Request | Expected Result |
|---|---|---|---|
| 7.1 | Review before return | `POST /` on a `CONFIRMED` (not `RETURNED`) order | 4xx, blocked |
| 7.2 | Mark order returned | `PATCH /api/provider/orders/:id` → `RETURNED` | 200 |
| 7.3 | Valid review | `POST /` with `rating: 5` on returned order | 201 |
| 7.4 | Duplicate review | `POST /` again on same order | 4xx, "already reviewed" |
| 7.5 | Invalid rating | `POST /` with `rating: 6` | 4xx |
| 7.6 | Review someone else's order | `POST /` as non-owning customer | 4xx, blocked |
| 7.7 | Get gear reviews | `GET /gear/:gearId2` | 200, shows submitted review(s) |

---

## 8. Admin (`/api/admin`)

| # | Test | Request | Expected Result |
|---|---|---|---|
| 8.1 | Non-admin access | `GET /users` as customer | 403 |
| 8.2 | List all users | `GET /users` as admin | 200, no passwords exposed |
| 8.3 | Suspend user | `PATCH /users/:id` → `SUSPENDED` | 200 |
| 8.4 | Suspended user login | `POST /api/auth/login` as suspended user | Blocked |
| 8.5 | List all gear | `GET /gear` as admin | 200, includes inactive items |
| 8.6 | List all rentals | `GET /rentals` as admin | 200, all orders platform-wide |

---

## 9. Error Handling Sanity Checks

| # | Test | Request | Expected Result |
|---|---|---|---|
| 9.1 | Malformed UUID | Any `GET /:id` with invalid UUID format | Clean JSON error, no stack trace dump |
| 9.2 | Missing required fields | `POST /api/provider/gear` incomplete body | Clean 4xx, `PrismaClientValidationError` handled |
| 9.3 | Invalid/expired auth token | Any protected route | 401, no crash |
| 9.4 | Duplicate unique constraint | Re-register existing email | 409/400, readable message |

---

## Out of Scope

- **SSLCommerz** integration is not implemented — `PaymentProvider` enum includes it for schema completeness, but only Stripe is functional.

- **Overlapping-date availability checks** are not implemented — stock is tracked by running quantity only, not per-date-range conflicts.
