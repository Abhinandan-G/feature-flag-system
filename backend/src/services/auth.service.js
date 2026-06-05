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
  
  const org = await validateAndGetOrg(org_name);
  await checkForExistingUserWhileSignup(email,org);
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

  const org = await validateAndGetOrg(org_name);

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

const endUserSignup = async ({ email, username, password, org_name }) => {

  const org = await validateAndGetOrg(org_name);
  await checkForExistingUserWhileSignup(email,org);
  const role = await authRepository.findRoleByName('end_user');
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await authRepository.createUser({
    email,
    username,
    password: hashedPassword,
    role_id: role.id,
    org_id: org.id,
  });

  const token = signToken({
    id: user.id,
    email: user.email,
    role: 'user',
    org_id: org.id,
  });

  return { token, role: 'user', user };

}

const endUserLogin = async({email,password,org_name}) => {
  const org = await validateAndGetOrg(org_name);

   const user = await authRepository.findUserByEmailAndOrg(email, org.id);
  if (!user || user.role_name !== 'user') {
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
    role: 'user',
    org_id: org.id,
  });

  return { token, role: 'user', user };
}

const validateAndGetOrg = async (org_name) => {
  const org = await organizationRepository.findOrgByName(org_name);

  if(!org){
    const error = new Error("No such organization exists");
    error.status = 400;
    throw error;
  }

  return org;
}

const checkForExistingUserWhileSignup = async(email,org)=>{
   const existingUser = await authRepository.findUserByEmail(email);

  if(existingUser){
    const existingUserOrgId = existingUser.org_id;

    let errorMessage;

    if(existingUserOrgId === org.id)
      errorMessage = "User with this email is already registered in this organization";
    
    else if(existingUserOrgId !== org.id)
        errorMessage = "User with this email is already registered in another organization";

    const error = new Error(errorMessage || "User is already registered");
    error.status = 409;
    throw error;
  }

}

module.exports = { superAdminLogin, adminSignup, adminLogin, endUserSignup, endUserLogin };