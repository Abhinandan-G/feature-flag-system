export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) ? '' : 'Enter a valid email address';
};

export const validatePassword = (password, validateLength = false) => {
  if (!password) return 'Password is required';
  if (validateLength && password.length < 8) return 'Password must be at least 8 characters';
  return '';
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') return `${fieldName} is required`;
  return '';
};

export const validateLoginForm = ({ email, password, org_name }) => {
  const errors = {};
  errors.email = validateEmail(email);
  errors.password = validatePassword(password,false);
  if (org_name !== undefined) {
    errors.org_name = validateRequired(org_name, 'Organization name');
  }
  return errors;
};

export const validateSignupForm = ({ email, password, username, org_name }) => {
  const errors = {};
  errors.email = validateEmail(email);
  errors.password = validatePassword(password,true);
  errors.username = validateRequired(username, 'Username');
  if (org_name !== undefined) {
    errors.org_name = validateRequired(org_name, 'Organization name');
  }
  return errors;
};

export const hasErrors = (errors) => {
  return Object.values(errors).some((e) => e !== '');
};