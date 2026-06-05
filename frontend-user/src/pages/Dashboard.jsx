import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrgFlags, checkFeatureFlags } from '../api/features.api';
import Toast from '../shared/components/Toast';
import useToast from '../shared/hooks/useToast';
import './Dashboard.css';

const Dashboard = () => {
  const { logout, user } = useAuth();
  const { toasts, showToast, removeToast } = useToast();

  const [flags, setFlags] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [results, setResults] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [checking, setChecking] = useState(false);

  const fetchFlags = useCallback(async () => {
    setFetching(true);
    try {
      const res = await getOrgFlags();
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

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    // Clear results when selection changes
    setResults(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      showToast('Select at least one feature to check', 'error');
      return;
    }

    setChecking(true);
    try {
      const res = await checkFeatureFlags(selectedIds);
      const resultMap = {};
      res.data.data.forEach((r) => {
        resultMap[r.id] = r.is_enabled;
      });
      setResults(resultMap);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setChecking(false);
    }
  };

  const getStatusForFlag = (id) => {
    if (!results || !(id in results)) return null;
    return results[id];
  };

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />
      <div className="dashboard">

        <header className="dashboard-header">
          <div>
            <h1>Feature Flag Checker</h1>
            {user && <span className="header-sub">{user.email}</span>}
          </div>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </header>

        <main className="dashboard-main">
          <section className="card">
            <h2>Check Feature Flags</h2>
            <p className="hint">
              Select the features you want to check and hit Submit.
            </p>

            {fetching ? (
              <p className="state-msg">Loading features...</p>
            ) : flags.length === 0 ? (
              <p className="state-msg">No feature flags available for your organization.</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flags-list">
                  {flags.map((flag) => {
                    const status = getStatusForFlag(flag.id);
                    return (
                      <label key={flag.id} className="flag-item">
                        <div className="flag-left">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(flag.id)}
                            onChange={() => handleCheckboxChange(flag.id)}
                          />
                          <span className="flag-name">{flag.feature_name}</span>
                        </div>
                        {status !== null && (
                          <span className={`badge ${status ? 'badge--on' : 'badge--off'}`}>
                            {status ? 'Enabled' : 'Disabled'}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>

                <div className="submit-row">
                  <button
                    className="btn-primary"
                    type="submit"
                    disabled={checking || selectedIds.length === 0}
                  >
                    {checking ? 'Checking...' : `Check Selected (${selectedIds.length})`}
                  </button>
                  {results && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => { setResults(null); setSelectedIds([]); }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>
            )}
          </section>
        </main>

      </div>
    </>
  );
};

export default Dashboard;