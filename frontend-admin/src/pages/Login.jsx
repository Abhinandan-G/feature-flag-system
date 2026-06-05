import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginAdmin } from '../api/features.api';
import AuthForm from '../shared/components/AuthForm';
import Toast from '../shared/components/Toast';
import useToast from '../shared/hooks/useToast';
import { validateLoginForm, hasErrors } from '../shared/validators/authValidators';

const FIELDS = [
  { name: 'email',    label: 'Email',    type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'org_name', label: 'Organization Name', type: 'text' },
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  const [values, setValues] = useState({ email: '', password: '', org_name: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(values);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await loginAdmin(values);
      login(res.data.data.token);
      showToast('Login successful', 'success');
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
        title="Admin Login"
        fields={FIELDS}
        values={values}
        errors={errors}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Login"
        footer={<>Don't have an account? <Link to="/signup">Sign up</Link></>}
      />
    </>
  );
};

export default Login;