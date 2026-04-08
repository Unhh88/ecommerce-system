# Danaco Frozen Food E-Commerce System

A comprehensive e-commerce platform for Danaco frozen food distribution with role-based dashboards for customers, administrators, inventory managers, order managers, finance managers, and delivery staff.

## 🏗️ Project Structure

```
danaco/
├── backend/danaco/        # Spring Boot REST API
├── frontend/              # React + Three.js SPA
├── docs/                  # Documentation
├── docker-compose.yml     # PostgreSQL + pgAdmin
├── CLAUDE.md              # Project conventions & guidelines
└── .planning/             # GSD planning documents
```

## 📋 Tech Stack

- **Frontend:** React 18 + Three.js (3D product visualization) + Tailwind CSS
- **Backend:** Spring Boot 4.0.5 (Java 17+)
- **Database:** PostgreSQL 15
- **Build:** Maven (backend), Vite (frontend)
- **Authentication:** JWT tokens with Spring Security
- **API Documentation:** Swagger/OpenAPI 3.0

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Java 17+
- Node.js 18+
- Maven 3.8+

### 1. Start PostgreSQL

```bash
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- pgAdmin (port 5050) — admin@danaco.local / admin_password

### 2. Build & Run Backend

```bash
cd backend/danaco
mvn clean install
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`  
API docs: `http://localhost:8080/swagger-ui.html`

**Default credentials (will be created after Phase 2):**
- Email: admin@danaco.local or phone: +1234567890
- Password: (will be defined in auth implementation)

### 3. Install & Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` or `http://localhost:3000` (Vite default)

### 4. Verify Setup

- ✅ **Backend API:** http://localhost:8080/swagger-ui.html
- ✅ **Frontend:** http://localhost:5173
- ✅ **pgAdmin:** http://localhost:5050
- ✅ **Database:** psql -U danaco_user -d danaco -h localhost

---

## 📚 Development Workflow

See [CLAUDE.md](CLAUDE.md) for:
- Code organization conventions
- API naming patterns
- Database naming standards
- RBAC role definitions
- Error handling guidelines
- Testing strategy
- Security checklist

---

## 📖 Project Planning

### Phases Overview

| # | Name | Status | Plans |
|----|------|--------|-------|
| 1 | Database & API Foundation | Planning | 1 |
| 2 | Authentication & Authorization | Pending | 2 |
| 3 | Product Catalog & Inventory | Pending | 2 |
| 4 | Shopping Cart & Checkout | Pending | 2 |
| 5 | Order Tracking | Pending | 2 |
| 6 | Order Management | Pending | 3 |
| 7 | Inventory Notifications | Pending | 2 |
| 8 | Finance Manager Dashboard | Pending | 2 |
| 9 | Admin Dashboard | Pending | 2 |
| 10 | Delivery Tracking | Pending | 2 |
| 11 | Testing & Deployment | Pending | 3 |

**Full roadmap:** See [.planning/ROADMAP.md](.planning/ROADMAP.md)

---

## 📁 Key Files

- **Backend Configuration:** `backend/danaco/src/main/resources/application.yml`
- **Database Schema:** `backend/danaco/src/main/resources/db/migration/V20260408__initial_schema.sql`
- **Frontend Config:** `frontend/vite.config.js`, `frontend/tailwind.config.js`
- **Project Guidelines:** `CLAUDE.md`
- **Planning Docs:** `.planning/PROJECT.md`, `.planning/ROADMAP.md`, `.planning/STATE.md`

---

## 🐛 Troubleshooting

### PostgreSQL Connection Error
```
ERROR: connect to server at "localhost" (127.0.0.1), port 5432 failed
```
**Solution:** Make sure Docker is running and postgresql container is healthy
```bash
docker-compose ps
docker-compose logs postgres
```

### Maven Build Failure
```
[ERROR] COMPILATION ERROR
```
**Solution:** Ensure Java 17 is installed and set in JAVA_HOME
```bash
java -version
mvn -version
```

### Frontend API Connection
If backend runs on a different port, update `frontend/vite.config.js` proxy configuration.

---

## 🔐 Security Notes

- JWT tokens expire in 15 minutes (access) / 7 days (refresh)
- Passwords are bcrypt-hashed in the database
- CORS is configured for development (localhost:3000, localhost:5173)
- All input is validated on both frontend and backend
- SQL injection is prevented by JPA parameterized queries

---

## 📝 Database Schema

Current schema includes:
- Users & Roles (6 roles: CUSTOMER, ADMIN, INVENTORY_MANAGER, ORDER_MANAGER, FINANCE_MANAGER, DELIVERY_STAFF)
- Products & Stock History
- Orders & Order Items
- Payments & Refunds
- Deliveries & Tracking
- Notifications & Complaints
- Audit Logs

See `backend/danaco/src/main/resources/db/migration/` for full schema details.

---

## 🧪 Testing

### Backend
```bash
cd backend/danaco
mvn test                     # Run all tests
mvn test -Dtest=ClassName   # Run specific test
```

### Frontend
```bash
cd frontend
npm test                     # Run tests with Vitest
npm run test:ui             # Run tests with UI
```

---

## 📞 Support

For project conventions, see [CLAUDE.md](CLAUDE.md)  
For detailed planning, see [.planning/PROJECT.md](.planning/PROJECT.md)  
For development roadmap, see [.planning/ROADMAP.md](.planning/ROADMAP.md)

---

**Last Updated:** April 8, 2026  
**Current Version:** 0.0.1-SNAPSHOT
