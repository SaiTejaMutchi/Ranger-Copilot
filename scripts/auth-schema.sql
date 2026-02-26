-- Ranger Copilot: Auth & Profile Schema (SQLite/PostgreSQL compatible)
-- Mirrors Convex Auth structure + extended user profiles
-- Use for local dev, migration reference, or maintenance scripts

-- Users (core identity)
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  name          TEXT,
  image         TEXT,
  email_verified_at INTEGER,
  created_at    INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at    INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

-- User profiles (extended sign-up fields)
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id       TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  organization  TEXT,
  role          TEXT,
  site          TEXT,
  created_at    INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at    INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

-- Auth accounts (provider + password hash)
-- For Password provider: provider='password', provider_account_id=email, secret=bcrypt_hash
CREATE TABLE IF NOT EXISTS auth_accounts (
  id                 TEXT PRIMARY KEY,
  user_id            TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider           TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  secret             TEXT,  -- bcrypt hash for password provider
  email_verified     TEXT,
  created_at         INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  UNIQUE(provider, provider_account_id)
);

CREATE INDEX IF NOT EXISTS idx_auth_accounts_user ON auth_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_accounts_provider ON auth_accounts(provider, provider_account_id);

-- Sessions
CREATE TABLE IF NOT EXISTS auth_sessions (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at      INTEGER NOT NULL,
  created_at      INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_user ON auth_sessions(user_id);
