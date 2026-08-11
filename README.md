NovaShop

NovaShop is a production-oriented ecommerce application built with Next.js App Router, TypeScript, MongoDB, and Mongoose.

The project is designed as both a realistic online store and a backend-engineering learning project. Its goal is to demonstrate secure authentication, layered architecture, maintainable business logic, database design, and production practices without unnecessary TypeScript complexity.

Project status: Active development. Authentication, session management, authorization, and the Category module are implemented. Product development is currently in progress.

Architecture

NovaShop follows a layered backend architecture:

Request
↓
Next.js Route Handler
↓
Service Layer
↓
Repository Layer
↓
Mongoose Model
↓
MongoDB

Each layer has a focused responsibility:

Route handlers manage HTTP requests, authentication, validation, and responses.

Services contain business rules and coordinate workflows.

Repositories perform database queries.

Models define and protect MongoDB document structures.

Zod schemas validate untrusted API input before it reaches business logic.

This project intentionally does not use a separate controller layer because Next.js Route Handlers already perform the HTTP-controller role.

Technology Stack

Next.js App Router

TypeScript

MongoDB

Mongoose

Zod

JSON Web Tokens

bcrypt

React Hook Form

Tailwind CSS

Postman

Implemented Features

Authentication

User registration and login

Password hashing with bcrypt

Access and refresh tokens

HTTP-only authentication cookies

Refresh-token rotation

Hashed refresh-token storage

Generic credential errors to reduce account discovery

Current-user endpoint

Logout from the current device

Logout from all devices

Session management

Multiple-device login

One database session per login/device

Session-specific refresh tokens

Device user-agent tracking

Session expiry and revocation

MongoDB TTL index for expired sessions

Active-session listing

Current-device identification

Remote session removal

Authorization

Protected API routes

User and admin roles

Admin-only route guard

Correct 401 Unauthorized and 403 Forbidden behavior

Category management

Admin category creation

Automatic slug generation

Duplicate name and slug protection

Admin listing of active and inactive categories

Public listing of active categories only

Category activation and deactivation

Partial name and description updates

Automatic slug regeneration after renaming

Zod and Mongoose validation

API infrastructure

Cached Mongoose connection for development hot reloads

Consistent ApiResponse format

Custom ApiError class

Reusable asynchronous route wrapper

Separate handling for expected, Zod, and unexpected errors

Safe response objects that do not expose passwords or token hashes

Current API Routes

Authentication and sessions

POST /api/auth/signup
POST /api/auth/login
POST /api/auth/refresh
GET /api/auth/me
POST /api/auth/logout
POST /api/auth/logout-all
GET /api/auth/sessions
DELETE /api/auth/sessions/:sessionId

Categories

POST /api/admin/categories
GET /api/admin/categories
PATCH /api/admin/categories/:categoryId
PATCH /api/admin/categories/:categoryId/status
GET /api/categories

Response Format

Successful responses use a consistent structure:

{
"statusCode": 200,
"success": true,
"message": "Request completed successfully",
"data": {}
}

Expected errors use:

{
"success": false,
"message": "Error message",
"errors": [],
"data": null
}

Project Structure

app/
api/
admin/
auth/
categories/

lib/
bcrypt.ts
env.ts
jwt.ts
mongodb.ts
tokenHash.ts

models/
Category.model.ts
Session.model.ts
User.model.ts

repositories/
category.repository.ts
session.repository.ts
user.repository.ts

schemas/
categorySchema.ts
loginSchema.ts
signupSchema.ts

services/
auth.service.ts
category.service.ts

types/
category.types.ts
session.types.ts
token.types.ts
user.types.ts

utils/
ApiError.ts
ApiResponse.ts
asyncHandler.ts
createSlug.ts
requireAdmin.ts
requireAuth.ts

Some filenames may use the project's existing plural naming convention, such as User.models.ts. Keep imports consistent with the actual repository.

Getting Started

1. Clone the repository

git clone https://github.com/HiiamRaman/NovaShop.git
cd NovaShop

2. Install dependencies

npm install

3. Configure environment variables

Create .env.local in the project root:

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_random_secret_with_at_least_64_characters
ACCESS_TOKEN_EXPIRY=900

REFRESH_TOKEN_SECRET=your_different_random_secret_with_at_least_64_characters
REFRESH_TOKEN_EXPIRY=604800

Expiry values are measured in seconds:

900 = 15 minutes
604800 = 7 days

Use different cryptographically random secrets for access and refresh tokens. Never commit .env.local.

4. Start the development server

npm run dev

Open:

http://localhost:3000

API Testing

The API is currently tested with Postman. Create a Postman environment containing:

baseUrl = http://localhost:3000

Example request:

POST {{baseUrl}}/api/admin/categories
Content-Type: application/json

{
"name": "Mobile Phones",
"description": "Smartphones and mobile devices"
}

Postman stores the HTTP-only authentication cookies returned by the login endpoint. Log in using an admin account before testing admin routes.

Security Decisions

Passwords are never stored or returned in plain text.

confirmPassword is validated by Zod but is never stored in MongoDB.

Refresh tokens are hashed before being stored in session documents.

Authentication tokens are stored in HTTP-only cookies.

Access and refresh tokens use separate secrets and token types.

Protected routes verify token issuer, audience, algorithm, and payload shape.

Admin endpoints require both authentication and authorization.

User-facing login failures use a generic message.

Repository update methods run Mongoose validators.

Database responses are transformed into safe API objects.

Development Roadmap

Product management — in progress

Product model and validation

Category relationship

Pricing in minor currency units

SKU and inventory tracking

Product lifecycle status

Multiple product images

Cloudinary integration

Admin product CRUD

Public product listing and detail endpoints

Product discovery

Pagination

Search

Filtering by category, brand, price, and availability

Sorting

Database indexes and query optimization

Ecommerce workflows

Persistent cart

Guest-cart strategy and cart merging

Address management

Checkout validation

Order snapshots and lifecycle

Inventory-safe order creation

Stripe payments and webhook verification

Reviews and ratings

Coupons and promotions

Production engineering

Unit and integration tests

Rate limiting and brute-force protection

Structured logging and monitoring

Audit logs

Redis caching

Background jobs and email workers

Docker and CI/CD

Production deployment and backups

Future AI features

Semantic product search

AI shopping assistant

Product recommendations

Retrieval-augmented product support chatbot

User-behavior analysis

Engineering Goals

NovaShop is being built to develop the ability to:

Design secure and maintainable backend systems.

Explain engineering decisions and trade-offs.

Debug errors systematically.

Write readable TypeScript suitable for teamwork.

Protect business data at multiple validation layers.

Build backend foundations that can later support AI-powered features.

Author

Raman Singh
GitHub: HiiamRaman
