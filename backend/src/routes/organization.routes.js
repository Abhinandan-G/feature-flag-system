const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organization.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Both routes are protected — superadmin only
router.use(authenticate);
router.use(authorize('superadmin'));

router.post('/', organizationController.createOrganization);
router.get('/', organizationController.getAllOrganizations);

module.exports = router;