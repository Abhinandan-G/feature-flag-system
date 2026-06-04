const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/response');

const superAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }
    const result = await authService.superAdminLogin({ email, password });
    return sendSuccess(res, result, 'Login successful');
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

const adminSignup = async (req, res) => {
  try {
    const { email, username, password, org_name } = req.body;
    if (!email || !username || !password || !org_name) {
      return sendError(res, 'All fields are required', 400);
    }
    const result = await authService.adminSignup({ email, username, password, org_name });
    return sendSuccess(res, result, 'Admin registered successfully', 201);
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password, org_name } = req.body;
    if (!email || !password || !org_name) {
      return sendError(res, 'Email, password and org_id are required', 400);
    }
    const result = await authService.adminLogin({ email, password, org_name });
    return sendSuccess(res, result, 'Login successful');
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

module.exports = { superAdminLogin, adminSignup, adminLogin };