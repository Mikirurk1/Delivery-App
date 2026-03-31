# Delivery App

Food delivery web application where users can browse shops, add products to cart, apply coupons, place orders, and reorder previous purchases.

## Project Summary

This repository contains:

- `client` - Next.js 16 + React + TypeScript frontend
- `server` - NestJS + GraphQL + Prisma backend
- MongoDB as the primary database

The app includes:

- shops catalog with filters/sorting/pagination
- shopping cart and checkout with validation
- order history with search and reorder
- coupons workflow (single active coupon, category-based discount)
- JWT-based API access

## Tech Stack

### Frontend (`client`)

- Next.js 16 (App Router)
- React 19 + TypeScript
- Apollo Client (GraphQL)
- Redux Toolkit
- SCSS modules + `clsx`
- `libphonenumber-js` for international phone formatting

### Backend (`server`)

- NestJS 11
- GraphQL (Apollo)
- Prisma ORM
- MongoDB
- `jsonwebtoken` for JWT issuing/validation

### Infrastructure / Deployment

- Vercel for frontend
- Railway for backend
- MongoDB (Railway Mongo or external MongoDB provider)

## Task Coverage (ElifTech School - Delivery app)

### Base Level

- Shops page with products loaded from DB
- Add products to cart
- Cart page with quantity editing/removal
- Checkout form with email/phone/address validation
- Order saved to DB after submit
- Public hosted architecture supported (Vercel + Railway)

### Middle Level

- Responsive layout for desktop/tablet/mobile
- Product filtering by category (multi-select)
- Product sorting (name A-Z, price asc/desc)
- Shop filtering by rating range

### Advanced Level

- Product pagination with navigation controls
- Reorder from order history (merges into existing cart quantities)
- Order search by email/phone/order ID

### Additional Ideas Implemented

- Coupons page with coupon cards + filters
- Single active coupon rule
- Coupon discount applied by product category
- Discount reflected in product cards and cart totals
- Delivery Details prefill from reorder
- Local order history persisted in `localStorage`
- Global toast notifications with readable error mapping
- JWT-based API access flow

## Environment Variables

### Server (`server/.env`)

Required:

- `PORT` - server port (example: `4000`)
- `CLIENT_URL` - allowed frontend origins (comma-separated if multiple)
- `DATABASE_URL` - MongoDB connection URL
- `JWT_SECRET` - secret used to sign/verify JWT tokens

See `server/.env.example`.

### Client (`client/.env`)

Required:

- `NEXT_PUBLIC_GRAPHQL_URL` - public backend GraphQL URL (example: `http://localhost:4000/graphql`)

See `client/.env.example`.

## Local Development

## Option 0: Run from root scripts (recommended)

From repository root:

```bash
npm install
npm run setup
npm run dev
```

Useful root scripts:

- `npm run setup` - install dependencies for both `server` and `client`
- `npm run dev` - start backend and frontend concurrently
- `npm run build` - build both backend and frontend
- `npm run lint` - run lints for both backend and frontend
- `npm run seed` - run database seed script
- `npm run docker:up` - start Docker Compose stack
- `npm run docker:down` - stop Docker Compose stack

## Option 1: Docker Compose

From repository root:

```bash
docker compose up --build
```

Services:

- client: `http://localhost:3000`
- server: `http://localhost:4000/graphql`
- mongo: `mongodb://localhost:27017`

## Option 2: Run manually

### 1) Start backend

```bash
cd server
npm install
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
npm run start:dev
```

### 2) Start frontend

```bash
cd client
npm install
npm run dev
```

## Production Deployment

## Backend on Railway

1. Create Railway project for `server`.
2. Set env variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `CLIENT_URL` (your Vercel URL)
   - `PORT` (optional, Railway usually injects)
3. Deploy from `server` folder.
4. Ensure app is reachable at `https://<railway-domain>/graphql`.

## Frontend on Vercel

1. Create Vercel project for `client`.
2. Set env variable:
   - `NEXT_PUBLIC_GRAPHQL_URL=https://<railway-domain>/graphql`
3. Deploy.
4. Update backend `CLIENT_URL` to include your Vercel production domain.

## Build Settings for Deployment

### Vercel (Frontend)

Use these project settings:

- Root Directory: `client`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: auto (Next.js default)
- Start Command: not required for Vercel

### Railway (Backend, non-Docker mode)

Use these service settings:

- Root Directory: `server`
- Install Command: `npm install`
- Build Command: `npm run prisma:generate && npm run build`
- Start Command: `npx prisma db push && node dist/src/main.js`

### Railway (Backend, Docker mode)

If using Docker deployment on Railway, Build/Start commands are taken from `server/Dockerfile` automatically:

- Build stage runs: `npm run prisma:generate && npm run build`
- Runtime command: `npx prisma db push && node dist/src/main.js`

## Scripts

### Client

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

### Server

- `npm run start:dev`
- `npm run build`
- `npm run lint`
- `npm run prisma:generate`
- `npm run prisma:push`
- `npm run prisma:seed`

## Notes

- `JWT_SECRET` must never be exposed to the frontend.
- CORS uses `CLIENT_URL`; include all required origins.
- Local order history and auth token are stored in browser `localStorage`.
