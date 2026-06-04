const pool = require('../config/db');

const createFeatureFlag = async ({ feature_name, is_enabled, org_id }) => {
  const { rows } = await pool.query(
    `INSERT INTO feature_flags (feature_name, is_enabled, org_id)
     VALUES ($1, $2, $3)
     RETURNING id, feature_name, is_enabled, org_id, created_at`,
    [feature_name, is_enabled, org_id]
  );
  return rows[0];
};

const findFeatureByNameAndOrg = async (feature_name, org_id) => {
  const { rows } = await pool.query(
    `SELECT * FROM feature_flags
     WHERE feature_name = $1 AND org_id = $2 AND deleted_at IS NULL`,
    [feature_name, org_id]
  );
  return rows[0];
};

const findFeatureByIdAndOrg = async (id, org_id) => {
  const { rows } = await pool.query(
    `SELECT * FROM feature_flags
     WHERE id = $1 AND org_id = $2 AND deleted_at IS NULL`,
    [id, org_id]
  );
  return rows[0];
};

const getAllFeaturesByOrg = async (org_id) => {
  const { rows } = await pool.query(
    `SELECT id, feature_name, is_enabled, created_at, updated_at
     FROM feature_flags
     WHERE org_id = $1 AND deleted_at IS NULL
     ORDER BY created_at DESC`,
    [org_id]
  );
  return rows;
};

const updateFeatureFlag = async ({ id, feature_name, is_enabled, org_id }) => {
  const { rows } = await pool.query(
    `UPDATE feature_flags
     SET feature_name = $1, is_enabled = $2, updated_at = NOW()
     WHERE id = $3 AND org_id = $4 AND deleted_at IS NULL
     RETURNING id, feature_name, is_enabled, org_id, updated_at`,
    [feature_name, is_enabled, id, org_id]
  );
  return rows[0];
};

const deleteFeatureFlag = async (id, org_id) => {
  const { rows } = await pool.query(
    `UPDATE feature_flags
     SET deleted_at = NOW()
     WHERE id = $1 AND org_id = $2 AND deleted_at IS NULL
     RETURNING id, feature_name, deleted_at`,
    [id, org_id]
  );
  return rows[0];
};

module.exports = {
  createFeatureFlag,
  findFeatureByNameAndOrg,
  findFeatureByIdAndOrg,
  getAllFeaturesByOrg,
  updateFeatureFlag,
  deleteFeatureFlag,
};