const pool = require('../config/db');

const findUserByEmailAndOrg = async (email, org_id) => {
  const { rows } = await pool.query(
    `SELECT u.*, r.role_name 
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.email = $1 
     AND u.org_id = $2 
     AND u.deleted_at IS NULL`,
    [email, org_id]
  );
  return rows[0];
};

const findUserByEmail = async (email) => {
  const { rows } = await pool.query(
    `SELECT u.*, r.role_name 
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.email = $1 
     AND u.deleted_at IS NULL`,
    [email]
  );
  return rows[0];
};

const findOrgById = async (org_id) => {
  const { rows } = await pool.query(
    `SELECT * FROM organizations 
     WHERE id = $1 AND deleted_at IS NULL`,
    [org_id]
  );
  return rows[0];
};

const findRoleByName = async (role_name) => {
  const { rows } = await pool.query(
    `SELECT * FROM roles 
     WHERE role_name = $1 AND deleted_at IS NULL`,
    [role_name]
  );
  return rows[0];
};

const createUser = async ({ email, username, password, role_id, org_id }) => {
  const { rows } = await pool.query(
    `INSERT INTO users (email, username, password, role_id, org_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, username, role_id, org_id, created_at`,
    [email, username, password, role_id, org_id]
  );
  return rows[0];
};

const findOrgByName = async (org_name) => {
  const { rows } = await pool.query(
    `SELECT * FROM organizations 
     WHERE org_name = $1 AND deleted_at IS NULL`,
    [org_name]
  );
  return rows[0];
};

module.exports = {
  findUserByEmailAndOrg,
  findUserByEmail,
  findOrgById,
  findRoleByName,
  createUser,
  findOrgByName
};