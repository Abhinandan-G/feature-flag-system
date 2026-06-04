require('dotenv').config();
const pool = require('../config/db');

const migrations = [

  // 1. Roles
  `CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL
  )`,

  `CREATE UNIQUE INDEX IF NOT EXISTS idx_roles_role_name 
    ON roles(role_name) 
    WHERE deleted_at IS NULL`,

  // Seed the two roles we need
  `INSERT INTO roles (role_name) VALUES ('super_admin'),('org_admin'), ('end_user')
    ON CONFLICT DO NOTHING`,

  // 2. Organizations
  `CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    org_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL
  )`,

  `CREATE UNIQUE INDEX IF NOT EXISTS idx_organizations_org_name 
    ON organizations(org_name) 
    WHERE deleted_at IS NULL`,

  // 3. Users
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL REFERENCES roles(id),
    org_id INTEGER NOT NULL REFERENCES organizations(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL
  )`,

  `CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email
    ON users(email) 
    WHERE deleted_at IS NULL`,

  // 4. Feature Flags
  `CREATE TABLE IF NOT EXISTS feature_flags (
    id SERIAL PRIMARY KEY,
    feature_name VARCHAR(255) NOT NULL,
    is_enabled BOOLEAN DEFAULT false,
    org_id INTEGER NOT NULL REFERENCES organizations(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL
  )`,

  `CREATE UNIQUE INDEX IF NOT EXISTS idx_feature_flags_name_org 
    ON feature_flags(feature_name, org_id) 
    WHERE deleted_at IS NULL`,
];

async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log('Running migrations...');
    for (const sql of migrations) {
      await client.query(sql);
    }
    console.log('✅ All migrations ran successfully');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();