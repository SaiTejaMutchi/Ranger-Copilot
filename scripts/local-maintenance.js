#!/usr/bin/env node
/**
 * Local profile & password maintenance for Ranger Copilot
 * Uses SQLite + bcrypt for simple local user management.
 *
 * Usage:
 *   node scripts/local-maintenance.js init              # Create DB and tables
 *   node scripts/local-maintenance.js add <email> <pw>  # Add user
 *   node scripts/local-maintenance.js list              # List users
 *   node scripts/local-maintenance.js reset <email> <pw> # Reset password
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DB_PATH = path.join(__dirname, "..", "local-auth.db");

function getId() {
  return crypto.randomBytes(16).toString("hex");
}

function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

// Use bcrypt if available, else simple hash (for demo only - use bcrypt in production)
function hashPassword(password) {
  try {
    const bcrypt = require("bcryptjs");
    return bcrypt.hashSync(password, 10);
  } catch {
    console.warn("Install bcryptjs: npm i bcryptjs");
    return crypto.scryptSync(password, "ranger-salt", 64).toString("hex");
  }
}

function verifyPassword(password, hash) {
  try {
    const bcrypt = require("bcryptjs");
    return bcrypt.compareSync(password, hash);
  } catch {
    return false;
  }
}

function getDb() {
  try {
    const Database = require("better-sqlite3");
    return new Database(DB_PATH);
  } catch {
    console.error("Install better-sqlite3: npm i better-sqlite3");
    process.exit(1);
  }
}

function init() {
  const schemaPath = path.join(__dirname, "auth-schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");
  const db = getDb();
  db.exec(sql);
  console.log("Database initialized at", DB_PATH);
  db.close();
}

function addUser(email, password, organization, role, site) {
  const db = getDb();
  const id = getId();
  const now = getTimestamp();
  const hash = hashPassword(password);

  try {
    db.prepare("INSERT INTO users (id, email, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)").run(id, email, email.split("@")[0], now, now);
    db.prepare("INSERT INTO user_profiles (user_id, organization, role, site, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)").run(id, organization || null, role || null, site || null, now, now);
    db.prepare("INSERT INTO auth_accounts (id, user_id, provider, provider_account_id, secret, created_at) VALUES (?, ?, 'password', ?, ?, ?)").run(getId(), id, email, hash, now);
  } catch (e) {
    if (e.message && e.message.includes("UNIQUE")) {
      console.error("User with this email already exists.");
    } else {
      throw e;
    }
    db.close();
    return;
  }
  db.close();
  console.log("User added:", email);
}

function listUsers() {
  const db = getDb();
  const rows = db.prepare(`
    SELECT u.id, u.email, u.name, p.organization, p.role, p.site, u.created_at
    FROM users u
    LEFT JOIN user_profiles p ON u.id = p.user_id
    ORDER BY u.created_at DESC
  `).all();
  db.close();
  console.table(rows);
}

function resetPassword(email, password) {
  const db = getDb();
  const user = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (!user) {
    console.error("User not found:", email);
    db.close();
    return;
  }
  const hash = hashPassword(password);
  db.prepare("UPDATE auth_accounts SET secret = ? WHERE user_id = ? AND provider = 'password'").run(hash, user.id);
  db.close();
  console.log("Password reset for:", email);
}

// CLI
const [,, cmd, ...args] = process.argv;

switch (cmd) {
  case "init":
    init();
    break;
  case "add":
    if (args.length >= 2) {
      addUser(args[0], args[1], args[2], args[3], args[4]);
    } else {
      console.log("Usage: node local-maintenance.js add <email> <password> [org] [role] [site]");
    }
    break;
  case "list":
    listUsers();
    break;
  case "reset":
    if (args.length >= 2) {
      resetPassword(args[0], args[1]);
    } else {
      console.log("Usage: node local-maintenance.js reset <email> <new_password>");
    }
    break;
  default:
    console.log(`
Ranger Copilot - Local Auth Maintenance

  init                    Create SQLite DB and tables
  add <email> <pw> [...]  Add user (optional: org, role, site)
  list                    List all users
  reset <email> <pw>      Reset user password

Install deps: npm i better-sqlite3 bcryptjs
`);
}
