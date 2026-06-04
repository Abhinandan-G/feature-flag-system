const organizationRepository = require('../repositories/organization.repository');

const createOrganization = async (org_name) => {
  const existing = await organizationRepository.findOrgByName(org_name);
  if (existing) {
    const error = new Error('Organization with this name already exists');
    error.status = 409;
    throw error;
  }

  const org = await organizationRepository.createOrganization(org_name);
  return org;
};

const getAllOrganizations = async () => {
  const orgs = await organizationRepository.getAllOrganizations();
  return orgs;
};

module.exports = { createOrganization, getAllOrganizations };