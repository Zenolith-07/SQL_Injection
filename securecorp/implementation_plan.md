# SecureCorp Employee Portal — Implementation Plan

A full-stack SQL injection educational lab with a production-quality UI, Express.js backend, and PostgreSQL database.

---

## User Review Required

> [!IMPORTANT]
> **Tailwind CSS**: Your spec requests Tailwind CSS. I'll use **Tailwind CSS v3** with PostCSS. This overrides the default vanilla CSS guideline since you explicitly requested it.

> [!IMPORTANT]
> **shadcn/ui**: I'll use **Radix UI primitives directly** (Dialog, Dropdown, etc.) rather than the full shadcn/ui CLI setup, since shadcn requires specific project scaffolding. This gives us the same accessible components with less overhead. Custom-styled to match the dark enterprise theme.

> [!WARNING]
> **PostgreSQL Required**: The backend requires a running PostgreSQL instance. The `SETUP.md` will guide configuration, but you must have PostgreSQL installed and running locally before testing.

---

## Open Questions

> [!IMPORTANT]
> **Database credentials**: Should I hardcode default PostgreSQL credentials (`postgres`/`postgres`) in a `.env.example` file, or do you have specific credentials you'd like to use?

> [!NOTE]
> **connect-pg-simple**: This requires a `session` table in PostgreSQL. I'll auto-create it in `database.sql`. Just confirming this approach is acceptable.

---

## Proposed Changes

The entire project is new. Structure:

```
securecorp/
├── client/          # React + Vite + Tailwind frontend
├── server/          # Express.js backend
├── database.sql     # Schema + seed data
├── SETUP.md         # Local setup guide
└── ATTACKS.md       # SQL injection demo cheatsheet
```

---

### Phase 1 — Frontend (React + Vite + Tailwind)

#### [NEW] Project Scaffolding
- Initialize Vite React project in `securecorp/client/`
- Install dependencies: `react-router-dom`, `axios`, `lucide-react`, `@radix-ui/react-dialog`, `@radix-ui/react-checkbox`
- Configure Tailwind with the dark enterprise color palette
- Add Google Fonts: **DM Sans** (body) + **Space Grotesk** (headings)

#### [NEW] [index.css](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/client/src/index.css)
- Tailwind directives + CSS custom properties for the design system
- Global styles: dark background, font families, smooth scrolling
- Custom animations: fade-slide-up, shake, pulse-glow
- Diagonal mesh/grid pattern CSS for login branding panel

#### [NEW] [logo.svg](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/client/src/assets/logo.svg)
- Simple shield icon SVG with SecureCorp branding

#### [NEW] [axios.js](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/client/src/api/axios.js)
- Axios instance with `baseURL: 'http://localhost:5000/api'`
- `withCredentials: true` for session cookies

#### [NEW] [AuthContext.jsx](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/client/src/context/AuthContext.jsx)
- React context for auth state management
- `login()`, `logout()`, `checkAuth()` functions
- Auto-check session on mount via `GET /api/user/me`
- Exposes `user`, `loading`, `error` state

#### [NEW] [ProtectedRoute.jsx](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/client/src/components/ProtectedRoute.jsx)
- Wraps routes requiring authentication
- Redirects to `/login` if no session
- Optional `adminOnly` prop for admin-gated routes

#### [NEW] [Login.jsx](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/client/src/pages/Login.jsx)
- Split-panel layout: 40% branding (diagonal mesh, logo, tagline) / 60% form
- Email input with mail icon, password with lock + show/hide toggle
- Remember me checkbox, full-width blue sign-in button with loading spinner
- Red dismissible error alert, form shake animation on failure
- Staggered fade-slide-up entrance animations
- Footer: © 2025 SecureCorp Technologies

#### [NEW] [Sidebar.jsx](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/client/src/components/Sidebar.jsx)
- Fixed left sidebar with SecureCorp logo
- Navigation items with Lucide icons
- Different items for user vs admin role
- Active state: blue left border + brighter background
- Bottom section: user avatar (initials), name, role badge, logout

#### [NEW] [Navbar.jsx](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/client/src/components/Navbar.jsx)
- Top bar with greeting (time-aware: morning/afternoon/evening)
- Current date display, notification bell icon

#### [NEW] [StatCard.jsx](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/client/src/components/StatCard.jsx)
- Reusable stat card with icon, label, value
- Subtle border glow, hover lift animation

#### [NEW] [Dashboard.jsx](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/client/src/pages/Dashboard.jsx)
- Sidebar + Navbar layout
- 3 stat cards: Department, Job Role, Member Since
- Profile card: initials avatar, name, role badge, details grid
- Recent Activity section with mock log entries

#### [NEW] [EmployeeTable.jsx](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/client/src/components/EmployeeTable.jsx)
- Full interactive table with all specified columns
- Color-coded role badges (red=admin, blue=user)
- Formatted salary (`$87,000`)
- Promote/Demote/Delete action buttons per row
- Hover highlight, zebra striping
- Live search filter
- Pagination (10 per page)

#### [NEW] [AdminPanel.jsx](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/client/src/pages/AdminPanel.jsx)
- Admin sidebar layout
- Header: "Employee Records" + CONFIDENTIAL badge
- Stats row: Total Employees, Admins, Active Departments
- Search bar + Export button (cosmetic)
- EmployeeTable component
- Delete confirmation modal (Radix Dialog, blur backdrop)

#### [NEW] [App.jsx](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/client/src/App.jsx)
- React Router v6 setup
- Routes: `/login`, `/dashboard`, `/admin`
- ProtectedRoute wrappers
- AuthContext provider

---

### Phase 2 — Backend (Express.js + PostgreSQL)

#### [NEW] [pool.js](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/server/db/pool.js)
- PostgreSQL connection pool using `pg` library
- Reads config from environment variables with defaults

#### [NEW] [sessionCheck.js](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/server/middleware/sessionCheck.js)
- Middleware checking `req.session.user`
- Returns 401 if not authenticated

#### [NEW] [auth.js](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/server/routes/auth.js)
- `POST /login` — initially safe parameterized query
- `POST /logout` — destroy session
- Session stores full user object

#### [NEW] [employees.js](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/server/routes/employees.js)
- `GET /` — return all employees
- `PATCH /:id/role` — update role (initially safe)
- `DELETE /:id` — delete employee

#### [NEW] [user.js](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/server/routes/user.js)
- `GET /me` — return session user data

#### [NEW] [server.js](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/server/server.js)
- Express setup with CORS, JSON parsing
- `express-session` with `connect-pg-simple` store
- Mount all route groups
- Listen on port 5000

#### [NEW] [.env.example](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/server/.env.example)
- Template for database credentials

---

### Phase 3 — SQL Injection Vulnerabilities

#### [MODIFY] [auth.js](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/server/routes/auth.js)
- Replace parameterized login query with string-concatenated vulnerable version
- Add prominent warning comment block with demo payloads
- Keep secure version commented out below

#### [MODIFY] [employees.js](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/server/routes/employees.js)
- Replace parameterized role update query with vulnerable string concatenation
- Add warning comments + secure version commented below

---

### Phase 4 — Documentation

#### [NEW] [database.sql](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/database.sql)
- `session` table for connect-pg-simple
- `users` table with full schema
- 8+ seed records (2 admins, 6 users)

#### [NEW] [ATTACKS.md](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/ATTACKS.md)
- All 6 attack scenarios with payloads and expected results
- Mitigation demo instructions

#### [NEW] [SETUP.md](file:///c:/Users/Aditya Raj Bohora/Desktop/SQL_Injection/securecorp/SETUP.md)
- Prerequisites, step-by-step setup, demo credentials

---

## Verification Plan

### Automated Tests
1. **Frontend build**: `cd client && npm run build` — must compile without errors
2. **Backend start**: `cd server && node server.js` — must connect to PostgreSQL and listen on port 5000
3. **Database seed**: `psql -d securecorp -f database.sql` — must execute cleanly

### Browser Testing
1. Navigate to `http://localhost:5173` → should show login page
2. Login with `admin@securecorp.com` / `admin123` → should redirect to admin panel
3. Login with `marcus@securecorp.com` / `pass1234` → should redirect to dashboard
4. Test SQL injection: `' OR '1'='1' --` in email field → should bypass login
5. Test secure version: uncomment parameterized queries → injection should fail
6. Test employee table: search, promote, demote, delete operations
7. Test logout → should redirect to login, block access to protected routes

### Manual Verification
- Visual inspection of all pages against design spec
- Responsive layout check at various viewport sizes
- Animation/transition smoothness verification
