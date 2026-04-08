# Claude.md — Danaco E-Commerce Project Guidelines

## Tech Stack

- **Frontend:** React + Three.js (3D product visualization)
- **Backend:** Spring Boot (Java 17+)
- **Database:** PostgreSQL (14+)
- **Build:** Maven (backend), npm/vite (frontend)
- **Testing:** JUnit 5 (backend), Vitest/React Testing Library (frontend)
- **Authentication:** JWT tokens with Spring Security RBAC

## Code Organization

### Backend Structure
```
backend/
  danaco/
    src/
      main/
        java/com/danaco/
          api/          # REST controllers
          service/      # Business logic
          repository/   # Data access (JPA)
          entity/       # JPA entities
          config/       # Spring configuration
          security/     # JWT, RBAC
          exception/    # Custom exceptions
          dto/          # Request/response DTOs
        resources/
          db/migration/ # Flyway migrations
          application.yml
      test/
        java/com/danaco/
    pom.xml
```

### Frontend Structure
```
frontend/
  src/
    components/       # React components
    pages/            # Page-level components
    lib/              # Utils, hooks, Three.js helpers
    api/              # API client (fetch/axios)
    context/          # React contexts (auth, user)
    styles/           # CSS/Tailwind
    types/            # TypeScript types
  index.jsx
  vite.config.js
```

## Key Conventions

### API Naming
- RESTful endpoints: `/api/v1/{resource}/{id}/{action}`
- GET: Retrieve (read-only)
- POST: Create new resource
- PUT: Update entire resource
- PATCH: Partial update
- DELETE: Remove resource

### Database Naming
- Tables: `snake_case` (e.g., `user_roles`, `order_items`)
- Columns: `snake_case` with meaningful prefixes (e.g., `created_at`, `updated_at`)
- Foreign keys: `{table}_id` (e.g., `user_id`, `product_id`)
- Primary keys: `id` (UUID preferred)

### Authentication
- JWT format: `Authorization: Bearer {token}`
- Token expiry: 15 minutes (access), 7 days (refresh)
- Stored in `httpOnly` cookies (frontend)
- Claims: `userId`, `email`, `roles` array

### RBAC Roles
- `CUSTOMER` — Browse, order, track
- `INVENTORY_MANAGER` — Manage products and stock
- `ORDER_MANAGER` — Process and track orders
- `FINANCE_MANAGER` — View payments, issue refunds
- `DELIVERY_STAFF` — View assigned deliveries, update status
- `ADMIN` — System-wide oversight

### Error Handling
- Validation errors: 400 Bad Request with field messages
- Auth errors: 401 Unauthorized
- Permission errors: 403 Forbidden
- Not found: 404 Not Found
- Server errors: 500 Internal Server Error with error ID

### Testing Strategy
- Unit tests: Business logic, utilities (90%+ coverage)
- Integration tests: API endpoints, database interactions
- E2E tests: Critical user journeys (Phase 11)
- No static component snapshots (prone to breaking)

## Development Workflow

1. Implement feature per phase plan
2. Run tests: `mvn test` (backend), `npm test` (frontend)
3. Verify API contracts match plan
4. Commit with atomic message: `feat(phase-01): describe change`
5. Push to feature branch

## Database Migrations

- Use Flyway for all schema changes
- File naming: `V{YYYYMMDD}__{description}.sql`
- Never modify committed migrations
- Test migrations locally before commit

## Frontend State Management

- Use React Context for auth state (user, roles, token)
- Use component state for UI (modals, forms, filters)
- Use custom hooks for reusable logic
- Fetch data in useEffect (with proper cleanup)

## Security Checklist

- Validate all input (backend + frontend)
- Never store sensitive data in localStorage (use httpOnly cookies)
- CORS properly configured (spring.web.cors)
- SQL: Use parameterized queries (JPA prevents injection)
- XSS: React auto-escapes by default
- CSRF: Spring Security handles CSRF tokens
- Passwords: bcrypt hashing (Spring Security)

## No-Nos

- ❌ Hardcoded API URLs (use env vars)
- ❌ Storing passwords in logs
- ❌ Mocking authentication in tests (test real JWT)
- ❌ Skipping RBAC checks (always validate permissions)
- ❌ Direct SQL (always use JPA)
- ❌ Storing business logic in React components (use services)

## Useful Commands

### Backend
```bash
cd backend/danaco
mvn clean install
mvn spring-boot:run
mvn test
mvn test -Dtest=ClassName
```

### Frontend
```bash
cd frontend
npm install
npm run dev      # Vite dev server
npm test
npm run build
```

### Database
```bash
psql -U postgres -d danaco
\dt              # List tables
\d table_name    # Describe table
```

## Documentation

- Api docs: Use Swagger/SpringFox (auto-generated from controllers)
- Database ERD: Update as schema changes (Phase 1 deliverable)
- Postman collection: Update as endpoints are added
- README: Keep deployment instructions current
