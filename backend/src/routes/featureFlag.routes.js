const express = require('express');
const router = express.Router();
const featureFlagController = require('../controllers/featureFlag.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.use(authenticate);
router.use(authorize('admin'));

router.post('/', featureFlagController.createFeatureFlag);
router.get('/', featureFlagController.getAllFeatureFlags);
router.put('/:id', featureFlagController.updateFeatureFlag);
router.delete('/:id', featureFlagController.deleteFeatureFlag);

module.exports = router;