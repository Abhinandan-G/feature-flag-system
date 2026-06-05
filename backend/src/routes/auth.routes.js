const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Super admin
router.post('/superadmin/login', authController.superAdminLogin);

// Admin
router.post('/admin/signup', authController.adminSignup);
router.post('/admin/login', authController.adminLogin);

// End user
router.post('/user/signup', authController.userSignup);
router.post('/user/login', authController.userLogin);

module.exports = router;