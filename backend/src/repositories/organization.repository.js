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

const deleteOrganization= async(org_id) => {
  const { rows } = await pool.query(
    `UPDATE organizations SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL
     RETURNING id, org_name, deleted_at`,
    [org_id]
  );
  return rows[0];
}


module.exports = {
  createOrganization,
  findOrgByName,
  getAllOrganizations,
  deleteOrganization
};