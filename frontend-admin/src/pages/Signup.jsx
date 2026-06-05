import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signupAdmin } from '../api/features.api';
import AuthForm from '../shared/components/AuthForm';
import Toast from '../shared/components/Toast';
import useToast from '../shared/hooks/useToast';
import { validateSignupForm, hasErrors } from '../shared/validators/authValidators';

const FIELDS = [
  { name: 'username', label: 'Username', type: 'text' },
  { name: 'email',    label: 'Email',    type: 'email' },
  { name: 'password', label: 'Password', type: 'password'},
  { name: 'org_name', label: 'Organization Name', type: 'text'},
];

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  const [values, setValues] = useState({ username: '', email: '', password: '', org_name: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignupForm(values);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await signupAdmin(values);
      login(res.data.data.token);
      showToast('Account created successfully', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />
      <AuthForm
        title="Admin Signup"
        fields={FIELDS}
        values={values}
        errors={errors}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Sign Up"
        footer={<>Already have an account? <Link to="/login">Login</Link></>}
      />
    </>
  );
};

export default Signup;