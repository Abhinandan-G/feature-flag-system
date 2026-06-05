# Multi-Tenant Feature Flag Management System

A SaaS-like feature flag management system with role-based access across three portals — Super Admin, Organization Admin, and End User.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Frontend | React |
| Auth | Custom JWT |
| Containerization | Docker |

---

## Setup & Running

### Prerequisites
- Docker installed

### Steps

**1. Clone the repository and navigate to the root**
```bash
cd feature-flag-system
```

**2. Start all services**
```bash
docker compose up --build
```

**3. Run database migrations (in a new terminal)**
- Inside the docker backend container's terminal run the command
```bash
npm run migrate
```

That's it. All services are now running.

---

## Accessing the Applications

| Portal | URL | Who Uses It |
|--------|-----|-------------|
| Super Admin | http://localhost:3001 | System host |
| Admin | http://localhost:3002 | Organization admins |
| User | http://localhost:3003 | End users |
| API | http://localhost:5000 | Backend |
| pgAdmin | http://localhost:5050 | DB UI |

- All the credentials which are to be added in the .env file is given in a .env.template file in each project. Copy those and paste them in the .env file.


---

### 1. Super Admin (localhost:3001)
- Login with static credentials
- Create an organization
- View and delete organizations from the dashboard

### 2. Organization Admin (localhost:3002)
- Sign up with your email, username, password, and the organization name created by the super admin
- Create feature flags
- Enable, disable, edit, or delete flags from the dashboard

### 3. End User (localhost:3003)
- Sign up with your email, username, password, and your organization name
- Dashboard loads all feature flags for your organization as checkboxes
- Select the flags you want to check and hit Submit
- See which are enabled or disabled

---

## Tradeoffs & Known Limitations

### 1. Open Admin Signup (No Invite System)
Currently any user can sign up as an organization admin as long as they know the organization name. Ideally this should be invite-based — the super admin creates the org and sends an invite link via email to the intended admin. The admin signs up only through that link. This was skipped due to time constraints.

### 2. Validations in Controllers (No DTO Layer)
Input validations are done directly in the controllers. In a proper production system we would use an ORM with model-level validators and Data Transfer Objects (DTOs) for each request. With TypeScript and a DI framework like Inversify, we could define interfaces and classes for each layer — making the codebase more maintainable and testable.

### 3. No Database Transactions
Since every write or update operation in this system touches only one table at a time, transactions were not used.

### 4. No Session Invalidation on Organization Deletion
When an organization is soft deleted, the JWT tokens of its admins and users are still valid until they naturally expire. The tokens and the sessions must be invalidated.

### 5. No API Rate Limiting or Security Practices
The API has no rate limiting, meaning endpoints like login are vulnerable to brute-force attacks. Additionally, while JWT verification is in place, security practices like CORS whitelisting per environment, CSRF protection, and HTTP security headers (beyond basic Helmet defaults) are not fully configured.

### 6. No JWT Refresh Tokens
Once the JWT expires the user is simply logged out. There is no refresh token mechanism for silent re-authentication. In production, a short-lived access token paired with a long-lived refresh token (stored securely) is the standard approach.

### 7. No Pagination
List endpoints (organizations, feature flags) return all records. For small datasets this is fine, but in production pagination, filtering, and sorting would be necessary.



