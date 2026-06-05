import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getOrganizations,
  createOrganization,
  deleteOrganization,
} from '../api/organizations.api';
import Toast from '../shared/components/Toast';
import useToast from '../shared/hooks/useToast';
import './Dashboard.css';

const Dashboard = () => {
  const { logout } = useAuth();
  const { toasts, showToast, removeToast } = useToast();

  const [orgs, setOrgs] = useState([]);
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchOrgs = useCallback(async () => {
    setFetching(true);
    try {
      const res = await getOrganizations();
      setOrgs(res.data.data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchOrgs();
  }, [fetchOrgs]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!orgName.trim()) {
      showToast('Organization name is required', 'error');
      return;
    }

    setLoading(true);
    try {
      await createOrganization(orgName.trim());
      setOrgName('');
      showToast('Organization created successfully', 'success');
      fetchOrgs();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteOrganization(id);
      showToast('Organization deleted', 'success');
      fetchOrgs();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />
      <div className="dashboard">

        <header className="dashboard-header">
          <h1>Super Admin Dashboard</h1>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </header>

        <main className="dashboard-main">

          {/* Create Org */}
          <section className="card">
            <h2>Create Organization</h2>
            <form className="create-form" onSubmit={handleCreate}>
              <input
                type="text"
                placeholder="Organization name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                disabled={loading}
              />
              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
              </button>
            </form>
          </section>

          {/* Orgs List */}
          <section className="card">
            <h2>Organizations</h2>
            {fetching ? (
              <p className="state-msg">Loading...</p>
            ) : orgs.length === 0 ? (
              <p className="state-msg">No organizations yet.</p>
            ) : (
              <table className="org-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orgs.map((org) => (
                    <tr key={org.id}>
                      <td>{org.id}</td>
                      <td>{org.org_name}</td>
                      <td>{new Date(org.created_at).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(org.id, org.org_name)}
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