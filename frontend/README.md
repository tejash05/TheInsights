# 🖥️ TheIns Frontend

The **Xeno Frontend** is a modern dashboard built using **Next.js + React**.  
It provides tenants with **authentication, data insights, and visualizations** for their Shopify store customers, orders, products, and events.



## 🏗️ Project Architecture

The Xeno platform follows a **modular architecture** with clear separation of concerns:

1. **Frontend (Next.js + React + Tailwind)**  
   - Handles **authentication (JWT)** and tenant login.  
   - Provides a **dashboard UI** to visualize customers, orders, products, and events.  
   - Fetches data securely from backend APIs.  

2. **Backend (Node.js + Express + Prisma + PostgreSQL)**  
   - Manages **multi-tenant data ingestion** with Prisma ORM.  
   - Provides REST APIs for tenants: `/auth`, `/insights`, `/shopify`.  
   - Stores data in a **tenant-isolated relational database**.  
   - Handles **webhook events** from Shopify.  

3. **Shopify Integration**  
   - **APIs** used to fetch Customers, Orders, Products.  
   - **Webhooks** to sync data in real-time (e.g., order created).  
   - **Scheduler (Cron Jobs)** ensures periodic re-sync for reliability.  
   - Supports **Draft Orders & Events** to track cart abandonment, checkout started.  

4. **Optional Tools**  
   - **Redis** for caching hot queries.  
   - **RabbitMQ** for async job queueing (future scalability).  
   - **Docker** for containerized deployment.  

---

### 📐 Architecture Diagram

```mermaid
flowchart TD
  subgraph Shopify
    API[Shopify REST API] --> Webhooks[Shopify Webhooks]
  end

  subgraph Backend["Backend (Node.js + Express)"]
    Routes[/API Routes/]
    Prisma[Prisma ORM]
    DB[(PostgreSQL)]
    Scheduler[Scheduler / Cron Jobs]
    Routes --> Prisma --> DB
    Webhooks --> Routes
    Scheduler --> Routes
  end

  subgraph Frontend["Frontend (Next.js + React)"]
    UI[Dashboard UI]
  end

  Shopify --> Backend
  Backend --> Frontend
  User[Authenticated User] --> UI

---
```
## 🌐 Frontend Deployment Info

| Service   | Link |
|-----------|------|
| 🖥️ Frontend | [https://theinsights.onrender.com](https://theinsights.onrender.com) |

---

## ⚙️ Frontend Tech Stack

| Tech | Description |
|------|-------------|
| ![Next.js](https://img.shields.io/badge/Next.js-SSR-black?logo=nextdotjs) | [Next.js](https://nextjs.org/) – React-based frontend framework |
| ![React](https://img.shields.io/badge/React-18-blue?logo=react) | [React](https://react.dev/) – Component-based UI |
| ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue?logo=tailwind-css) | [Tailwind](https://tailwindcss.com/) – Utility-first CSS |
| ![Recharts](https://img.shields.io/badge/Recharts-Charts-orange?logo=chart.js) | [Recharts](https://recharts.org/en-US/) – Data visualizations |
| ![Lucide](https://img.shields.io/badge/Lucide-Icons-green?logo=lucide) | [Lucide Icons](https://lucide.dev/) – Modern icon library |

---

## 📸 Frontend Screenshots

### 🔐 Authentication
| Login | Register |
|-------|----------|
| ![](assets/login.png) | ![](assets/register.png) |

### 📊 Dashboard & Orders
| Dashboard | Orders |
|-----------|--------|
| ![](assets/dashboard.png) | ![](assets/orders.png) |

### 👥 Customers & 📦 Products
| Customers | Products |
|-----------|----------|
| ![](assets/customers.png) | ![](assets/products.png) |

### ⚡ Events & ⚙️ Settings
| Events | Settings |
|--------|----------|
| ![](assets/events.png) | ![](assets/settings.png) |

### 👤 Profile & 🏢 Tenant Info
| Profile | Tenant |
|---------|--------|
| ![](assets/profile.png) | ![](assets/tenant.png) |


## 📦 Frontend Setup Instructions

### 1. Navigate to frontend
```bash

```
cd frontend
```

2. Install dependencies
```
npm install
```
3. Start development server
```
npm run dev
```


4. Configure environment variables

Create a .env.local file inside the frontend directory:

```
```
NEXT_PUBLIC_API_URL=https://theinsights-e7a0.onrender.com

```
This ensures the frontend communicates with the backend service.
📸 Frontend Screenshots
🔐 Authentication
Login	Register
	
📊 Dashboard & Orders
Dashboard	Orders
	
👥 Customers & 📦 Products
Customers	Products
	
⚡ Events & ⚙️ Settings
Events	Settings
	
👤 Profile & 🏢 Tenant Info
Profile	Tenant
