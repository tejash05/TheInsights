
# ⚙️ TheInsights Backend

The **TheInsights Backend** is built using **Node.js + Express + Prisma + PostgreSQL**.  
It handles **multi-tenant data ingestion from Shopify**, manages authentication, and exposes REST APIs for the frontend to fetch insights.

---

## 🌐 Backend Deployment Info

| Service   | Link |
|-----------|------|
| ⚙️ Backend | [https://theinsights-e7a0.onrender.com](https://theinsights-e7a0.onrender.com) |

---

## ⚙️ Backend Tech Stack

| Tech | Description |
|------|-------------|
| ![Node.js](https://img.shields.io/badge/Node.js-JS-green?logo=node.js) | [Node.js](https://nodejs.org/) – Backend runtime |
| ![Express](https://img.shields.io/badge/Express.js-REST-black?logo=express) | [Express.js](https://expressjs.com/) – REST API framework |
| ![Postgres](https://img.shields.io/badge/PostgreSQL-DB-blue?logo=postgresql) | [PostgreSQL](https://www.postgresql.org/) – Relational database |
| ![Prisma](https://img.shields.io/badge/Prisma-ORM-purple?logo=prisma) | [Prisma](https://www.prisma.io/) – ORM with multi-tenant support |
| ![JWT](https://img.shields.io/badge/JWT-Auth-blue?logo=json-web-tokens) | [JWT](https://jwt.io/) – Secure authentication |
| ![Render](https://img.shields.io/badge/Render-Deployment-purple?logo=render) | [Render](https://render.com/) – Hosted backend |

---

## 📦 Backend Setup Instructions

### 1. Navigate to backend
```bash
cd backend
```
2. Install dependencies
```
npm install
```
3. Start development server
```
npm run dev
```
4. Setup database with Prisma
```
npx prisma migrate dev --name init
```
5. Configure environment variables

Create a .env file inside the backend directory:
```
DATABASE_URL=postgresql://user:password@localhost:5432/theinsights
JWT_SECRET=your_jwt_secret
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
```
## 🏗️ Project-Level Architecture

```mermaid
flowchart TD
    subgraph Shopify["Shopify Platform"]
        API[Shopify REST API]
        Webhooks[Shopify Webhooks]
    end

    subgraph Backend["Backend - Node.js + Express + Prisma"]
        Routes[API Routes]
        Prisma[Prisma ORM]
        DB[(PostgreSQL Database)]
        Scheduler[Scheduler / Cron Jobs]
    end

    subgraph Frontend["Frontend - TheInsights (Next.js + React)"]
        UI[Dashboard UI]
        Auth[Login & JWT Auth]
        Insights[Insights Pages]
    end

    User[Tenant User] --> UI
    UI --> Routes
    Routes --> Prisma --> DB
    API --> Routes
    Webhooks --> Routes
    Scheduler --> Routes
```

🔑 Key Features

    Multi-tenant authentication with JWT

    Shopify API + Webhook ingestion (Customers, Orders, Products, Events)

    Scheduler (Cron jobs) for periodic sync

    Prisma ORM for database schema management

    PostgreSQL for reliable relational storage

    REST APIs for insights consumed by the frontend
