import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getFeatureFlags,
  createFeatureFlag,
  updateFeatureFlag,
  deleteFeatureFlag,
} from '../api/features.api';
import Toast from '../shared/components/Toast';
import useToast from '../shared/hooks/useToast';
import './Dashboard.css';

const EMPTY_FORM = { feature_name: '', is_enabled: false };

const Dashboard = () => {
  const { logout, user } = useAuth();
  const { toasts, showToast, removeToast } = useToast();

  const [flags, setFlags] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchFlags = useCallback(async () => {
    setFetching(true);
    try {
      const res = await getFeatureFlags();
      setFlags(res.data.data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.feature_name.trim()) {
      showToast('Feature name is required', 'error');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await updateFeatureFlag(editingId, {
          feature_name: form.feature_name.trim(),
          is_enabled: form.is_enabled,
        });
        showToast('Feature flag updated', 'success');
      } else {
        await createFeatureFlag({
          feature_name: form.feature_name.trim(),
          is_enabled: form.is_enabled,
        });
        showToast('Feature flag created', 'success');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      fetchFlags();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (flag) => {
    setEditingId(flag.id);
    setForm({ feature_name: flag.feature_name, is_enabled: flag.is_enabled });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteFeatureFlag(id);
      showToast('Feature flag deleted', 'success');
      fetchFlags();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleToggle = async (flag) => {
    try {
      await updateFeatureFlag(flag.id, {
        feature_name: flag.feature_name,
        is_enabled: !flag.is_enabled,
      });
      showToast(
        `"${flag.feature_name}" ${!flag.is_enabled ? 'enabled' : 'disabled'}`,
        'success'
      );
      fetchFlags();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />
      <div className="dashboard">

        <header className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            {user && <span className="header-sub">{user.email}</span>}
          </div>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </header>

        <main className="dashboard-main">

          {/* Create / Edit Form */}
          <section className="card">
            <h2>{editingId ? 'Edit Feature Flag' : 'Create Feature Flag'}</h2>
            <form className="flag-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="feature_name"
                placeholder="Feature name e.g. dark_mode"
                value={form.feature_name}
                onChange={handleFormChange}
                disabled={loading}
              />
              <label className="toggle-label">
                <input
                  type="checkbox"
                  name="is_enabled"
                  checked={form.is_enabled}
                  onChange={handleFormChange}
                  disabled={loading}
                />
                Enabled
              </label>
              <div className="form-actions">
                <button className="btn-primary" type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Flags List */}
          <section className="card">
            <h2>Feature Flags</h2>
            {fetching ? (
              <p className="state-msg">Loading...</p>
            ) : flags.length === 0 ? (
              <p className="state-msg">No feature flags yet. Create one above.</p>
            ) : (
              <table className="flags-table">
                <thead>
                  <tr>
                    <th>Feature Name</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flags.map((flag) => (
                    <tr key={flag.id}>
                      <td>{flag.feature_name}</td>
                      <td>
                        <span className={`badge ${flag.is_enabled ? 'badge--on' : 'badge--off'}`}>
                          {flag.is_enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td>{new Date(flag.created_at).toLocaleDateString()}</td>
                      <td className="actions">
                        <button
                          className="btn-toggle"
                          onClick={() => handleToggle(flag)}
                        >
                          {flag.is_enabled ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(flag)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(flag.id, flag.feature_name)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

        </main>
      </div>
    </>
  );
};

export default Dashboard;