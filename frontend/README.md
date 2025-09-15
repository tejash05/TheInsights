# 🖥️ TheInsights Frontend

The **Xeno Frontend** is a modern dashboard built using **Next.js + React**.  
It provides tenants with **authentication, data insights, and visualizations** for their Shopify store customers, orders, products, and events.




## 🖥️ TheInsights – Frontend Architecture

```mermaid
flowchart TD
    subgraph Frontend["TheInsights Frontend (Next.js + React)"]
        UI[Pages & Components] --> Router[Next.js Router]
        Router --> State[State Management / React Hooks]
        State --> APIClient[API Client]
        APIClient --> Env[Environment Config (.env.local)]
    end

    subgraph Backend["Backend APIs"]
        Auth[/Auth API/]
        Insights[/Insights API/]
        Shopify[/Shopify Sync API/]
    end

    APIClient --> Auth
    APIClient --> Insights
    APIClient --> Shopify

    User[👤 Tenant User] --> UI
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
