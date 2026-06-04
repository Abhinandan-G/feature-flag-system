const bcrypt = require('bcryptjs');
const authRepository = require('../repositories/auth.repository');
const { signToken } = require('../utils/jwt');

const superAdminLogin = async ({ email, password }) => {
  const isValidEmail = email === process.env.SUPER_ADMIN_EMAIL;
  const isValidPassword = password === process.env.SUPER_ADMIN_PASSWORD;

  if (!isValidEmail || !isValidPassword) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const token = signToken({
    role: 'superadmin',
    email,
  });

  return { token, role: 'superadmin' };
};

const adminSignup = async ({ email, username, password, org_id }) => {
  // Check org exists
  const org = await authRepository.findOrgById(org_id);
  if (!org) {
    const error = new Error('Organization not found');
    error.status = 404;
    throw error;
  }

  // Check if email already exists in this org
  const existingUser = await authRepository.findUserByEmailAndOrg(email, org_id);
  if (existingUser) {
    const error = new Error('Email already registered in this organization');
    error.status = 409;
    throw error;
  }

  // Get the admin role id
  const role = await authRepository.findRoleByName('admin');

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await authRepository.createUser({
    email,
    username,
    password: hashedPassword,
    role_id: role.id,
    org_id,
  });

  const token = signToken({
    id: user.id,
    email: user.email,
    role: 'admin',
    org_id: user.org_id,
  });

  return { token, role: 'admin', user };
};

const adminLogin = async ({ email, password, org_id }) => {
  const user = await authRepository.findUserByEmailAndOrg(email, org_id);

  if (!user || user.role_name !== 'admin') {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    role: 'admin',
    org_id: user.org_id,
  });

  return { token, role: 'admin', user };
};

module.exports = { superAdminLogin, adminSignup, adminLogin };