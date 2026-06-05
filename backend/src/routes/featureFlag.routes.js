const express = require('express');
const router = express.Router();
const featureFlagController = require('../controllers/featureFlag.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// End user routes
router.post('/check',authenticate, authorize('user'), featureFlagController.checkFeatureFlags);
router.get('/my-org',authenticate, authorize('user'),  featureFlagController.getOrgFlagsForUser);

// Admin routes
router.post('/', authenticate, authorize('admin'), featureFlagController.createFeatureFlag);
router.get('/', authenticate, authorize('admin'), featureFlagController.getAllFeatureFlags);
router.put('/:id', authenticate, authorize('admin'), featureFlagController.updateFeatureFlag);
router.delete('/:id',authenticate, authorize('admin'), featureFlagController.deleteFeatureFlag);

module.exports = router;