# Ranger Copilot – Local Auth Maintenance

Simple SQL schema and local scripts for profile creation and password management.

## SQL Schema

`auth-schema.sql` defines tables for:

- **users** – Core identity (email, name, image)
- **user_profiles** – Extended sign-up fields (organization, role, site)
- **auth_accounts** – Provider credentials (password hashes)
- **auth_sessions** – Session storage

SQLite-compatible; works with PostgreSQL with minor adjustments.

## Maintenance Script

Requires optional dependencies:

```bash
npm i better-sqlite3 bcryptjs
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run auth:init` | Create SQLite DB and tables |
| `npm run auth:add <email> <password> [org] [role] [site]` | Add a user |
| `npm run auth:list` | List all users |
| `npm run auth:reset <email> <new_password>` | Reset user password |

### Examples

```bash
# Initialize local DB
npm run auth:init

# Add user with full profile
npm run auth:add ranger@org.org secret123 "Wildlife Trust" Ranger "Serengeti Park"

# List users
npm run auth:list

# Reset password
npm run auth:reset ranger@org.org newsecret456
```

### Direct usage

```bash
node scripts/local-maintenance.js init
node scripts/local-maintenance.js add ranger@org.org mypassword
node scripts/local-maintenance.js list
node scripts/local-maintenance.js reset ranger@org.org newpassword
```

---

**Note:** The production app uses Convex Auth (cloud). This SQL + maintenance script is for local development, data migration, or off-Convex workflows.
