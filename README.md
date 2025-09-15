Xeno – Multi-Tenant Shopify Data Ingestion & Insights Service

Xeno FDE Internship Assignment – 2025 is a simulated enterprise-grade Shopify integration platform.
It ingests multi-tenant Shopify store data (customers, orders, products, and events), stores it in a relational database, and provides an insights dashboard for business metrics — all with clean architecture, extensibility, and deployment readiness.
⚙️ Tech Stack Overview
🖥️ Frontend
Tech	Description
React-based frontend framework
React
Component-based UI
Tailwind
Utility-first CSS
Dashboard visualizations
Modern icon library
🌐 Backend
Tech	Description
Node.js
Backend runtime
Express
REST API framework
Relational database
Clean ORM with multi-tenant support
JWT
Secure authentication
Render
Hosted backend
🧾 Shopify Integration
Tech	Description
Customers, Orders, Products ingestion
Real-time sync
Scheduled jobs for sync
📦 Other Tools
Tech	Description
Caching layer (optional)
Message broker (optional for async ingestion)
Containerized deployment
🧠 Core Features
🔐 Authentication & Multi-Tenancy

    JWT-based email login

    Secure tenant onboarding (store isolation via tenantId)

    Role-agnostic (store admins can add/manage users)

📥 Shopify Data Ingestion

    Ingest Customers, Orders, Products

    Bonus: Custom Events (cart abandoned, checkout started)

    Prisma models ensure clean relational design

📊 Insights Dashboard

    Total customers, orders, and revenue

    Orders by date with filtering

    Top 5 customers by spend

    Trend charts with Recharts (line, bar, pie)

⚡ Data Sync & Reliability

    Webhooks to auto-update data from Shopify

    Scheduler for periodic sync

    Draft ingestion pipeline (for resiliency & retry mechanism)

📸 Screenshots
Login	Dashboard	Orders Chart
	
	
Customers	Products	Payments
	
	
🧩 Folder Structure

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

🧪 Architecture Diagram

flowchart LR
  Shopify[Shopify Store] -->|API/Webhooks| Backend
  Backend -->|Prisma ORM| Postgres[(PostgreSQL DB)]
  Backend --> Frontend[Next.js Dashboard]
  User[Authenticated User] --> Frontend

🌐 Deployment Info
Service	Link
🖥️ Frontend	https://theinsights.onrender.com
⚙️ Backend	https://theinsights-e7a0.onrender.com
📊 Demo Video	Google Drive Link
📦 Setup Instructions
1. Clone repo

git clone https://github.com/tejash05/Xeno-FDE.git
cd Xeno-FDE

2. Start backend

cd backend
npm install
npm run dev

3. Start frontend

cd ../frontend
npm install
npm run dev

4. Database setup

cd backend
npx prisma migrate dev --name init

5. Configure environment variables

DATABASE_URL=postgresql://user:password@localhost:5432/xeno
JWT_SECRET=your_jwt_secret
SHOPIFY_API_KEY=xxx
SHOPIFY_API_SECRET=xxx

📑 APIs & Data Models
🔗 Endpoints

    POST /auth/register – Register tenant/user

    POST /auth/login – JWT login

    POST /shopify/webhook – Ingest Shopify data

    GET /insights/overview – Metrics summary

    GET /insights/orders?start&end – Orders by date

📊 Models

    Tenant – id, name, domain

    User – id, email, password, tenantId

    Customer – id, shopifyId, email, tenantId

    Order – id, shopifyId, total, date, tenantId

    Product – id, shopifyId, title, price, tenantId

    Event – type, payload, tenantId (for abandoned carts, etc.)

🧑‍💻 Author

Name: Tejash Tarun
Role: Full Stack Developer | AI + Web3 Engineer | Shopify FDE Candidate
GitHub: @tejash05

⭐ Star the repo if you found this project interesting! Contributions & forks welcome.
