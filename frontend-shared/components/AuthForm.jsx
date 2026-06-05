import './AuthForm.css';

const AuthForm = ({
  title,
  fields,
  values,
  errors,
  onChange,
  onSubmit,
  loading,
  submitLabel,
  footer,
}) => {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">{title}</h2>
        <form onSubmit={onSubmit} noValidate>
          {fields.map((field) => (
            <div className="form-group" key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              <input
                id={field.name}
                type={field.type || 'text'}
                name={field.name}
                value={values[field.name] || ''}
                onChange={onChange}
                placeholder={field.placeholder || ''}
                disabled={loading}
              />
              {errors[field.name] && (
                <span className="form-error">{errors[field.name]}</span>
              )}
            </div>
          ))}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : submitLabel}
          </button>
        </form>
        {footer && <div className="auth-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default AuthForm;