# 🚀 Xeno – Multi-Tenant Shopify Data Ingestion & Insights Service
**Xeno FDE Internship Assignment – 2025** is a simulated enterprise-grade Shopify integration platform.  
It ingests multi-tenant Shopify store data (customers, orders, products, and events), stores it in a relational database, and provides an insights dashboard for business metrics — all with clean architecture, extensibility, and deployment readiness.

---

## ⚙️ Tech Stack Overview

### 🖥️ Frontend
| Tech | Description |
|------|-------------|
| ![Next.js](https://img.shields.io/badge/Next.js-SSR-black?logo=nextdotjs) | React-based frontend framework |
| ![React](https://img.shields.io/badge/React-18-blue?logo=react) | Component-based UI |
| ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue?logo=tailwind-css) | Utility-first CSS |
| ![Recharts](https://img.shields.io/badge/Recharts-Charts-orange?logo=chart.js) | Dashboard visualizations |
| ![Lucide](https://img.shields.io/badge/Lucide-Icons-green?logo=lucide) | Modern icon library |

### 🌐 Backend
| Tech | Description |
|------|-------------|
| ![Node](https://img.shields.io/badge/Node.js-JS-green?logo=node.js) | Backend runtime |
| ![Express](https://img.shields.io/badge/Express.js-REST-black?logo=express) | API framework |
| ![Postgres](https://img.shields.io/badge/PostgreSQL-DB-blue?logo=postgresql) | Relational database |
| ![Prisma](https://img.shields.io/badge/Prisma-ORM-purple?logo=prisma) | ORM with multi-tenant support |
| ![JWT](https://img.shields.io/badge/JWT-Auth-blue?logo=json-web-tokens) | Secure authentication |
| ![Render](https://img.shields.io/badge/Render-Deployment-purple?logo=render) | Hosted backend |

### 🧾 Shopify Integration
| Tech | Description |
|------|-------------|
| ![Shopify](https://img.shields.io/badge/Shopify-API-green?logo=shopify) | Customers, Orders, Products ingestion |
| ![Webhooks](https://img.shields.io/badge/Shopify-Webhooks-yellow?logo=webhooks) | Real-time sync |
| ![Scheduler](https://img.shields.io/badge/Cron-Sync-lightgrey?logo=clockify) | Scheduled jobs for sync |

### 📦 Other Tools
| Tech | Description |
|------|-------------|
| ![Redis](https://img.shields.io/badge/Redis-Cache-red?logo=redis) | Caching layer (optional) |
| ![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Queue-orange?logo=rabbitmq) | Async ingestion (optional) |
| ![Docker](https://img.shields.io/badge/Docker-Containerization-blue?logo=docker) | Containerized deployment |

---

## 🧠 Core Features

### 🔐 Authentication & Multi-Tenancy
- JWT-based email login  
- Secure tenant onboarding (store isolation via tenantId)  
- Role-agnostic (store admins can add/manage users)

### 📥 Shopify Data Ingestion
- Ingest Customers, Orders, Products  
- Bonus: Custom Events (cart abandoned, checkout started)  
- Prisma models ensure clean relational design

### 📊 Insights Dashboard
- Total customers, orders, and revenue  
- Orders by date with filtering  
- Top 5 customers by spend  
- Trend charts with Recharts (line, bar, pie)

### ⚡ Data Sync & Reliability
- Webhooks to auto-update data from Shopify  
- Scheduler for periodic sync  
- Draft ingestion pipeline (for resiliency & retry mechanism)

---

## 📸 Screenshots
| Login | Dashboard | Orders |
|-------|-----------|--------|
| ![](assets/login.png) | ![](assets/dashboard.png) | ![](assets/orders.png) |

| Customers | Products | Events |
|-----------|----------|--------|
| ![](assets/customers.png) | ![](assets/products.png) | ![](assets/events.png) |

| Settings | Profile | Tenant |
|----------|---------|--------|
| ![](assets/settings.png) | ![](assets/profile.png) | ![](assets/tenant.png) |

---

## 🧩 Folder Structure
```bash
Xeno-FDE/
├── frontend/
│   ├── src/
│   │   ├── pages/         # Login, Dashboard, Metrics
│   │   ├── components/    # Charts, Tables, Cards
│   │   └── styles/
├── backend/
│   ├── src/
│   │   ├── routes/        # /auth, /shopify, /insights
│   │   ├── controllers/   # ingestionController.js
│   │   ├── middlewares/   # auth, tenant isolation
│   │   ├── prisma/        # schema.prisma
│   │   └── server.ts
├── docs/                  # Architecture diagrams, assumptions
├── .env
└── README.md
```
🧪 Architecture Diagram

flowchart LR
```
  Shopify[Shopify Store] -->|API/Webhooks| Backend
  Backend -->|Prisma ORM| Postgres[(PostgreSQL DB)]
  Backend --> Frontend[Next.js Dashboard]
  User[Authenticated User] --> Frontend
```
🌐 Deployment Info
Service	Link
🖥️ Frontend	https://theinsights.onrender.com
⚙️ Backend	https://theinsights-e7a0.onrender.com
📊 Demo Video	Google Drive Link
📦 Setup Instructions
1. Clone repo
```
git clone https://github.com/tejash05/Xeno-FDE.git
cd Xeno-FDE
```
2. Start backend
```
cd backend
npm install
npm run dev
```
3. Start frontend
```
cd ../frontend
npm install
npm run dev
```
4. Database setup
```
cd backend
npx prisma migrate dev --name init
```
5. Configure environment variables

DATABASE_URL=postgresql://user:password@localhost:5432/xeno
JWT_SECRET=your_jwt_secret
SHOPIFY_API_KEY=xxx
SHOPIFY_API_SECRET=xxx

📑 APIs & Data Models
🔗 Endpoints
```
    POST /auth/register – Register tenant/user

    POST /auth/login – JWT login

    POST /shopify/webhook – Ingest Shopify data

    GET /insights/overview – Metrics summary

    GET /insights/orders?start&end – Orders by date
```
📊 Models
```
    Tenant – id, name, domain

    User – id, email, password, tenantId

    Customer – id, shopifyId, email, tenantId

    Order – id, shopifyId, total, date, tenantId

    Product – id, shopifyId, title, price, tenantId

    Event – type, payload, tenantId (for abandoned carts, etc.)
```
🧑‍💻 Author

Name: Tejash Tarun
Role: Full Stack Developer | AI + Web3 Engineer | Shopify FDE Candidate
GitHub: @tejash05

⭐ Star the repo if you found this project interesting! Contributions & forks welcome 🧑‍💻
