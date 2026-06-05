const featureFlagRepository = require('../repositories/featureFlag.repository');

const createFeatureFlag = async ({ feature_name, is_enabled = false, org_id }) => {
  const existing = await featureFlagRepository.findFeatureByNameAndOrg(feature_name, org_id);
  if (existing) {
    const error = new Error('Feature flag with this name already exists in your organization');
    error.status = 409;
    throw error;
  }

  return await featureFlagRepository.createFeatureFlag({ feature_name, is_enabled, org_id });
};

const getAllFeatureFlags = async (org_id) => {
  return await featureFlagRepository.getAllFeaturesByOrg(org_id);
};

const updateFeatureFlag = async ({ id, feature_name, is_enabled, org_id }) => {
  const existingFeatureFlag = await featureFlagRepository.findFeatureByIdAndOrg(id, org_id);

  if(!existingFeatureFlag){
    const error = new Error("Feature flag does not exists");
    error.status = 400;
    throw error;
  }

  const existingFeatureFlagByName = await featureFlagRepository.findFeatureByNameAndOrg(feature_name,org_id);

  if (existingFeatureFlagByName && existingFeatureFlagByName.id !== parseInt(id)) {
    const error = new Error('Another feature flag with this name already exists in your organization');
    error.status = 409;
    throw error;
  }

  return await featureFlagRepository.updateFeatureFlag({ id, feature_name, is_enabled, org_id });
};

const deleteFeatureFlag = async (id, org_id) => {
  const deleted = await featureFlagRepository.deleteFeatureFlag(id, org_id);
  if (!deleted) {
    const error = new Error('Feature flag not found');
    error.status = 404;
    throw error;
  }

  return deleted;
};

const checkFeatureFlags = async (feature_ids, org_id) => {
  if (!Array.isArray(feature_ids) || feature_ids.length === 0) {
    const error = new Error('feature_ids must be a non-empty array');
    error.status = 400;
    throw error;
  }

  return await featureFlagRepository.findFeaturesByIdsAndOrg(feature_ids, org_id);
};

module.exports = {
  createFeatureFlag,
  getAllFeatureFlags,
  updateFeatureFlag,
  deleteFeatureFlag,
  checkFeatureFlags
};