# NovaShop

A production-ready full-stack e-commerce platform built with Next.js, TypeScript, MongoDB, Stripe, and Cloudinary.

NovaShop provides a complete customer shopping experience alongside a protected administration dashboard for managing products, categories, inventory, customers, payments, and orders.

## Live Application

- [Customer Store](https://nova-shop-teal.vercel.app)
- [Admin Panel](https://nova-shop-teal.vercel.app/admin/login)
- [GitHub Repository](https://github.com/HiiamRaman/NovaShop)

> Administrator credentials are available upon request. They are not published to prevent unauthorized modification of production data.

## Test Payment

NovaShop currently uses Stripe Test Mode. No real payment is collected.

Use the following test card during checkout:

```text
Card number: 4242 4242 4242 4242
Expiry date: Any future date
CVC: Any 3 digits
```

## Features

### Customer Features

- Account registration and login
- Secure JWT authentication using HTTP-only cookies
- Access and refresh token session management
- Logout from the current session or all sessions
- Personal profile page
- Password change
- Browse and search products
- Filter products by category
- Sort products by price, name, and date
- Product detail pages
- Responsive shopping cart
- Stock-aware checkout validation
- Saved delivery addresses
- Set a default address
- Edit and delete addresses
- Stripe-hosted checkout
- Payment confirmation through Stripe webhooks
- Order history
- Individual order details
- Order cancellation for eligible unpaid orders
- Automatic stock restoration after cancellation or checkout expiration

### Admin Features

- Protected admin authentication
- Dashboard navigation
- Product management
- Create and update products
- Soft-delete and restore products
- Change product status
- Update inventory
- Upload, remove, and reorder product images
- Category management
- Activate and deactivate categories
- Customer management
- View all customer orders
- View individual order details
- Update order delivery status
- Payment-status visibility
- Revenue and store settings sections

## Technology Stack

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- Lucide React
- Sonner

### Backend

- Next.js Route Handlers
- MongoDB
- Mongoose
- JWT authentication
- bcrypt
- Stripe Checkout
- Stripe Webhooks
- Cloudinary

### Deployment

- Vercel
- MongoDB Atlas
- Stripe
- Cloudinary

## Architecture

NovaShop follows a layered backend architecture:

```text
Request
  ↓
Route Handler
  ↓
Validation Schema
  ↓
Service Layer
  ↓
Repository Layer
  ↓
Mongoose Model
  ↓
MongoDB
```

Responsibilities are separated as follows:

```text
app/api/          HTTP routes and responses
schemas/          Request validation
services/         Business logic
repositories/     Database operations
models/           Mongoose schemas
utils/            Authentication and shared utilities
components/       Reusable interface components
types/            Shared TypeScript types
```

## Project Structure

```text
NovaShop/
├── app/
│   ├── admin/
│   │   ├── (dashboard)/
│   │   │   ├── categories/
│   │   │   ├── customers/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   ├── revenue/
│   │   │   └── settings/
│   │   └── login/
│   ├── api/
│   │   ├── addresses/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── payment/
│   │   └── products/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── products/
│   ├── profile/
│   └── success/
├── components/
│   ├── admin/
│   ├── cart/
│   ├── checkout/
│   ├── common/
│   ├── layout/
│   ├── order-details/
│   ├── product/
│   └── profile/
├── lib/
├── models/
├── repositories/
├── schemas/
├── services/
├── store/
├── types/
└── utils/
```

## Order and Payment Workflow

```text
Customer selects products
        ↓
Checkout validates products, prices, address, and stock
        ↓
Order is created inside a MongoDB transaction
        ↓
Product stock is reserved
        ↓
Stripe Checkout Session is created
        ↓
Customer completes the test payment
        ↓
Stripe sends checkout.session.completed
        ↓
Webhook signature is verified
        ↓
Order payment status becomes paid
```

When an unpaid Stripe Checkout Session expires, NovaShop cancels the order and restores the reserved product quantities.

## Order Status Workflow

```text
Pending
   ↓
Confirmed
   ↓
Shipped
   ↓
Delivered
```

An eligible unpaid pending order can instead become:

```text
Pending → Cancelled
```

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/HiiamRaman/NovaShop.git
cd NovaShop
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file:

```env
MONGODB_URI=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=900

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=604800

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

APP_URL=http://localhost:3000
```

Never commit `.env.local` or expose secret values.

Generate secure token secrets with:

```bash
openssl rand -base64 64
```

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Local Stripe Webhook

Install and authenticate the Stripe CLI, then forward Stripe events to the local webhook:

```bash
stripe login
```

```bash
stripe listen \
  --events checkout.session.completed,checkout.session.expired \
  --forward-to http://localhost:3000/api/payment/stripe/webhook
```

Stripe prints a local webhook signing secret:

```text
whsec_...
```

Add it to `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

Restart the development server after changing environment variables.

## Production Stripe Webhook

The deployed Stripe webhook endpoint is:

```text
https://nova-shop-teal.vercel.app/api/payment/stripe/webhook
```

It listens for:

```text
checkout.session.completed
checkout.session.expired
```

The production webhook signing secret is stored securely in Vercel and is different from the local Stripe CLI secret.

## Environment Variables

| Variable                | Scope  | Purpose                          |
| ----------------------- | ------ | -------------------------------- |
| `MONGODB_URI`           | Server | MongoDB Atlas connection         |
| `ACCESS_TOKEN_SECRET`   | Server | Signs short-lived access tokens  |
| `ACCESS_TOKEN_EXPIRY`   | Server | Access-token duration            |
| `REFRESH_TOKEN_SECRET`  | Server | Signs refresh tokens             |
| `REFRESH_TOKEN_EXPIRY`  | Server | Refresh-token duration           |
| `CLOUDINARY_CLOUD_NAME` | Server | Cloudinary account identifier    |
| `CLOUDINARY_API_KEY`    | Server | Cloudinary API authentication    |
| `CLOUDINARY_API_SECRET` | Server | Cloudinary secret                |
| `STRIPE_SECRET_KEY`     | Server | Creates Stripe Checkout Sessions |
| `STRIPE_WEBHOOK_SECRET` | Server | Verifies Stripe webhook requests |
| `APP_URL`               | Server | Application base URL             |

## Main API Routes

### Authentication

```text
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/logout-all
GET    /api/auth/me
POST   /api/auth/refresh
PATCH  /api/auth/changePassword
```

### Products and Categories

```text
GET    /api/products
GET    /api/products/[slug]
GET    /api/categories
```

### Addresses and Orders

```text
GET    /api/addresses
POST   /api/addresses
PATCH  /api/addresses/[addressId]
DELETE /api/addresses/[addressId]

GET    /api/orders
POST   /api/orders
GET    /api/orders/[orderId]
PATCH  /api/orders/[orderId]/cancel
```

### Payments

```text
POST   /api/checkout/validate
POST   /api/payment/stripe/checkout
POST   /api/payment/stripe/webhook
```

### Administration

```text
GET    /api/admin/products
POST   /api/admin/products
PATCH  /api/admin/products/[productId]
DELETE /api/admin/products/[productId]

GET    /api/admin/categories
POST   /api/admin/categories
PATCH  /api/admin/categories/[categoryId]

GET    /api/admin/orders
GET    /api/admin/orders/[orderId]

GET    /api/admin/customers
GET    /api/admin/customers/[customerId]
```

Administrative APIs require a valid authenticated administrator.

## Production Build

Check the production build locally:

```bash
npm run build
```

Start the optimized production server:

```bash
npm start
```

## Deployment

NovaShop is deployed through Vercel and connected to the GitHub repository.

Updates pushed to the `main` branch trigger a new production deployment:

```bash
git add .
git commit -m "describe the update"
git push origin main
```

Production secrets are configured through:

```text
Vercel → Project Settings → Environment Variables
```

They are never stored in GitHub.

## Security

NovaShop includes:

- Password hashing with bcrypt
- HTTP-only authentication cookies
- Access and refresh token separation
- Role-based administrator authorization
- Zod request validation
- User-owned address and order queries
- Stripe webhook signature verification
- MongoDB transactions for inventory-sensitive operations
- Server-side pricing and stock validation
- Protected administrator API routes
- Secrets stored through environment variables

## Screenshots

Add project screenshots inside:

```text
public/screenshots/
```

Suggested screenshots:

```text
public/screenshots/home.png
public/screenshots/products.png
public/screenshots/product-details.png
public/screenshots/checkout.png
public/screenshots/orders.png
public/screenshots/admin-dashboard.png
public/screenshots/admin-products.png
public/screenshots/admin-orders.png
```

Then display them here:

```markdown
![NovaShop Homepage](public/screenshots/home.png)

![NovaShop Products](public/screenshots/products.png)

![NovaShop Admin Dashboard](public/screenshots/admin-dashboard.png)
```

## Future Improvements

- Email verification
- Forgot-password and password-reset flow
- Order confirmation emails
- Product reviews and ratings
- Wishlist
- Discount coupons
- Product variants
- Automated testing
- Rate limiting
- Read-only portfolio administrator account
- Low-stock notifications
- Refund management

## Author

**Raman Singh**

- GitHub: [@HiiamRaman](https://github.com/HiiamRaman)
- Project: [NovaShop](https://nova-shop-teal.vercel.app)
