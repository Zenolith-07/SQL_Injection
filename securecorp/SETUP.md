# SecureCorp — Local Setup Guide

## Prerequisites

| Software    | Version  | Check Command          |
|-------------|----------|------------------------|
| Node.js     | v18+     | `node --version`       |
| PostgreSQL  | v14+     | `psql --version`       |
| npm         | v9+      | `npm --version`        |

---

## Steps

### 1. Clone / Download the project

Download or clone the `securecorp` folder to your machine.

---

### 2. Set up the database

Open a terminal and run:

```bash
# Create the database (if it doesn't exist)
createdb securecorp

# Load the schema and seed data
psql -d securecorp -f database.sql
```

**On Windows (if psql is in PATH):**
```powershell
psql -U postgres -c "CREATE DATABASE securecorp;"
psql -U postgres -d securecorp -f database.sql
```

**Verify the data loaded:**
```bash
psql -d securecorp -c "SELECT id, name, email, role FROM users;"
```

You should see 8 employee records (2 admins, 6 users).

---

### 3. Configure and start the backend

```bash
cd server

# Copy environment template
cp .env.example .env

# Edit .env with your PostgreSQL credentials:
#   DB_USER=your_pg_username       (default: postgres)
#   DB_PASSWORD=your_pg_password   (default: postgres)
#   DB_NAME=securecorp
#   DB_HOST=localhost
#   DB_PORT=5432
#   SESSION_SECRET=securecorp-demo-secret

# Install dependencies
npm install

# Start the server
node server.js
```

You should see:
```
╔════════════════════════════════════════╗
║   SecureCorp API Server                ║
║   Running on http://localhost:5000      ║
╚════════════════════════════════════════╝

✓ PostgreSQL connected successfully
```

---

### 4. Run the frontend

Open a **new terminal**:

```bash
cd client

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend runs on `http://localhost:5173`.

---

### 5. Open the portal

Visit: **http://localhost:5173**

---

## Demo Credentials

| Role  | Email                    | Password   |
|-------|--------------------------|------------|
| Admin | `admin@securecorp.com`   | `admin123` |
| User  | `marcus@securecorp.com`  | `pass1234` |

---

## SQL Injection Demo

See [ATTACKS.md](./ATTACKS.md) for the full list of attack payloads and mitigation steps.

---

## Troubleshooting

### "PostgreSQL connection error"
- Ensure PostgreSQL is running: `pg_isready`
- Check credentials in `server/.env`
- Verify the `securecorp` database exists: `psql -l`

### "CORS error in browser"
- Make sure the backend is running on port 5000
- Make sure the frontend is running on port 5173
- The Vite dev server proxies `/api` requests to the backend

### "Session not persisting"
- Check that the `session` table was created in the database
- Try clearing browser cookies and logging in again
- Ensure `credentials: true` is set in CORS config

---

## Project Structure

```
securecorp/
├── client/                   # React frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── api/              # Axios instance
│   │   ├── assets/           # Logo SVG
│   │   ├── components/       # UI components
│   │   ├── context/          # Auth context
│   │   ├── pages/            # Login, Dashboard, AdminPanel
│   │   ├── App.jsx           # Router setup
│   │   └── index.css         # Design system
│   └── vite.config.js
├── server/                   # Express backend
│   ├── db/pool.js            # PostgreSQL connection
│   ├── middleware/            # Auth middleware
│   ├── routes/               # API routes
│   └── server.js             # Entry point
├── database.sql              # Schema + seed data
├── ATTACKS.md                # SQL injection demo guide
└── SETUP.md                  # This file
```
