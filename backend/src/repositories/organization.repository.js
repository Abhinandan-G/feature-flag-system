const pool = require('../config/db');

const createOrganization = async (org_name) => {
  const { rows } = await pool.query(
    `INSERT INTO organizations (org_name)
     VALUES ($1)
     RETURNING id, org_name, created_at`,
    [org_name]
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

const getAllOrganizations = async () => {
  const { rows } = await pool.query(
    `SELECT id, org_name, created_at FROM organizations
     WHERE deleted_at IS NULL
     ORDER BY created_at DESC`
  );
  return rows;
};

module.exports = {
  createOrganization,
  findOrgByName,
  getAllOrganizations,
};