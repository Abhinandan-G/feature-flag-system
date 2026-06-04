const organizationService = require('../services/organization.service');
const { sendSuccess, sendError } = require('../utils/response');

const createOrganization = async (req, res) => {
  try {
    const { org_name } = req.body;
    if (!org_name || org_name.trim() === '') {
      return sendError(res, 'Organization name is required', 400);
    }
    const org = await organizationService.createOrganization(org_name.trim());
    return sendSuccess(res, org, 'Organization created successfully', 201);
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

const getAllOrganizations = async (req, res) => {
  try {
    const orgs = await organizationService.getAllOrganizations();
    return sendSuccess(res, orgs, 'Organizations fetched successfully');
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

const deleteOrganization = async(req,res) => {
  try{
    const {id} = req.params;

    if(!id){
      return sendError(res,'Organization id is required',400);
    }
    const org = await organizationService.deleteOrganization(id);
    return sendSuccess(res,org,"Organization deleted successfully");
  }
  catch(error){
    return sendError(res, error.message,error.status || 500);
  }
}

module.exports = { createOrganization, getAllOrganizations, deleteOrganization };