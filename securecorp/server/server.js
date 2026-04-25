const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const cors = require('cors');
const pool = require('./db/pool');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Session Configuration ───
app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: 'session',
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || 'securecorp-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,           // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2, // 2 hours
    sameSite: 'lax',
  },
}));

// ─── API Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/user', userRoutes);

// ─── Health Check ───
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Error Handler ───
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ─── Start Server ───
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════╗`);
  console.log(`║   SecureCorp API Server                ║`);
  console.log(`║   Running on http://localhost:${PORT}      ║`);
  console.log(`╚════════════════════════════════════════╝\n`);
});
