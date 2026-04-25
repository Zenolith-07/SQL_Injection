# SecureCorp — SQL Injection Demo Attacks

> ⚠️ **WARNING:** These attacks are for educational purposes only in a controlled local lab environment. Never use these techniques against production systems or systems you do not own.

---

## Prerequisites

- SecureCorp portal running locally (frontend + backend)
- Database seeded with `database.sql`
- The **VULNERABLE** query is active in `server/routes/auth.js` (default)

---

## Attack 1: Login Bypass

**Goal:** Log in without knowing any valid credentials.

| Field    | Value                |
|----------|----------------------|
| Email    | `' OR '1'='1' --`    |
| Password | `anything`           |

**What happens:**
The SQL query becomes:
```sql
SELECT * FROM users WHERE email='' OR '1'='1' --' AND password='anything'
```
- `'1'='1'` is always true → returns ALL rows
- `--` comments out the password check
- The app logs you in as the **first user** in the database (Alexandra Reid)

**Result:** ✅ Logged in as first user (admin)

---

## Attack 2: Admin Access (Targeted)

**Goal:** Gain access to a specific admin account without their password.

| Field    | Value                        |
|----------|------------------------------|
| Email    | `admin@securecorp.com' --`   |
| Password | `anything`                   |

**What happens:**
The SQL query becomes:
```sql
SELECT * FROM users WHERE email='admin@securecorp.com' --' AND password='anything'
```
- The `--` comments out everything after the email check
- Only email is verified, password is completely ignored

**Result:** ✅ Logged in as Alexandra Reid (admin) — bypassed password

---

## Attack 3: Role-Based Bypass

**Goal:** Log in as any admin, without knowing their email.

| Field    | Value                    |
|----------|--------------------------|
| Email    | `' OR role='admin' --`   |
| Password | `anything`               |

**What happens:**
The SQL query becomes:
```sql
SELECT * FROM users WHERE email='' OR role='admin' --' AND password='anything'
```
- Returns the first user with `role='admin'`
- Password check is commented out

**Result:** ✅ Logged in as first admin in the database

---

## Attack 4: View Sensitive Data

**Prerequisite:** Gain admin access via any of the above attacks.

After logging in as admin, navigate to the **Employee Records** panel. You can now see:

| Data Exposed       | Example                  |
|---------------------|--------------------------|
| Full names          | All employee names       |
| Email addresses     | All company emails       |
| Phone numbers       | All personal phones      |
| Salaries            | $45,000 – $115,000       |
| Roles               | admin / user             |
| Departments         | Engineering, HR, etc.    |

**Impact:** Complete breach of employee PII (Personally Identifiable Information)

---

## Attack 5: Modify Data (Privilege Escalation)

**Prerequisite:** Admin access via SQL injection.

Use the **Promote** button in the admin panel to:
1. Select any regular user
2. Click "Promote" to escalate them to admin role
3. The user now has full admin privileges

**Impact:** Unauthorized privilege escalation

---

## Attack 6: Delete Data (Data Destruction)

**Prerequisite:** Admin access via SQL injection.

Use the **Delete** button in the admin panel to:
1. Select any employee record
2. Confirm deletion in the modal
3. The record is permanently removed from the database

**Impact:** Irreversible data loss

---

## Mitigation Demo

### How to fix the vulnerabilities:

#### Step 1: Open `server/routes/auth.js`

1. **Comment out** the vulnerable query block:
```js
// const query = `SELECT * FROM users WHERE email='${email}' AND password='${password}'`;
// const result = await pool.query(query);
```

2. **Uncomment** the secure parameterized version:
```js
const query = 'SELECT * FROM users WHERE email=$1 AND password=$2';
const result = await pool.query(query, [email, password]);
```

#### Step 2: Open `server/routes/employees.js`

1. **Comment out** the vulnerable UPDATE query
2. **Uncomment** the secure parameterized version

#### Step 3: Restart the server
```bash
# Stop the server (Ctrl+C) and restart
node server.js
```

#### Step 4: Test the same attacks again

| Attack                     | Before Fix | After Fix |
|----------------------------|------------|-----------|
| `' OR '1'='1' --`          | ✅ Bypass   | ❌ Fails   |
| `admin@securecorp.com' --` | ✅ Bypass   | ❌ Fails   |
| `' OR role='admin' --`     | ✅ Bypass   | ❌ Fails   |

### Why parameterized queries work:
- User input is treated as **data**, never as **SQL code**
- Even if a user enters `' OR '1'='1'--`, it's passed as a literal string
- The database engine separates the query structure from the data
- This is the **industry-standard** defense against SQL injection
