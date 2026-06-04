const featureFlagService = require('../services/featureFlag.service');
const { sendSuccess, sendError } = require('../utils/response');

const createFeatureFlag = async (req, res) => {
  try {
    const { feature_name, is_enabled } = req.body;
    const org_id = req.user.org_id; 

    if (!feature_name || feature_name.trim() === '') {
      return sendError(res, 'Feature name is required', 400);
    }

    const flag = await featureFlagService.createFeatureFlag({
      feature_name: feature_name.trim(),
      is_enabled,
      org_id,
    });

    return sendSuccess(res, flag, 'Feature flag created successfully', 201);
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

const getAllFeatureFlags = async (req, res) => {
  try {
    const org_id = req.user.org_id; 
    const flags = await featureFlagService.getAllFeatureFlags(org_id);
    return sendSuccess(res, flags, 'Feature flags fetched successfully');
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

const updateFeatureFlag = async (req, res) => {
  try {
    const { feature_name, is_enabled } = req.body;
    const { id } = req.params;
    const org_id = req.user.org_id;

    if (!feature_name || feature_name.trim() === '') {
      return sendError(res, 'Feature name is required', 400);
    }

    if (is_enabled === undefined || is_enabled === null) {
      return sendError(res, 'is_enabled is required', 400);
    }

    const flag = await featureFlagService.updateFeatureFlag({
      id,
      feature_name: feature_name.trim(),
      is_enabled,
      org_id,
    });

    return sendSuccess(res, flag, 'Feature flag updated successfully');
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

const deleteFeatureFlag = async (req, res) => {
  try {
    const { id } = req.params;
    const org_id = req.user.org_id;

    const flag = await featureFlagService.deleteFeatureFlag(id, org_id);
    return sendSuccess(res, flag, 'Feature flag deleted successfully');
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

module.exports = {
  createFeatureFlag,
  getAllFeatureFlags,
  updateFeatureFlag,
  deleteFeatureFlag,
};