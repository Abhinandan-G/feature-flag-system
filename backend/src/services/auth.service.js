const bcrypt = require('bcryptjs');
const authRepository = require('../repositories/auth.repository');
const organizationRepository = require('../repositories/organization.repository');
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

const adminSignup = async ({ email, username, password, org_name }) => {
  const org = await organizationRepository.findOrgByName(org_name);
  if (!org) {
    const error = new Error('Organization not found');
    error.status = 404;
    throw error;
  }

  const existingUser = await authRepository.findUserByEmailAndOrg(email, org.id);
  if (existingUser) {
    const error = new Error('Email already registered in this organization');
    error.status = 409;
    throw error;
  }
  const role = await authRepository.findRoleByName('org_admin');

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await authRepository.createUser({
    email,
    username,
    password: hashedPassword,
    role_id: role.id,
    org_id : org.id,
  });

  const token = signToken({
    id: user.id,
    email: user.email,
    role: 'admin',
    org_id: user.org_id,
  });

  return { token, role: 'admin', user };
};

const adminLogin = async ({ email, password, org_name }) => {

  const org = await organizationRepository.findOrgByName(org_name);

  if(!org){
    const error = new Error("No such organization exists");
    error.status = 400;
    throw error;
  }

  const user = await authRepository.findUserByEmailAndOrg(email, org.id);

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