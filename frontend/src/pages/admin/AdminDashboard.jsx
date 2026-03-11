import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import MobileWarning from '../../components/MobileWarning';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkMobile();
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (isMobile) {
    return <MobileWarning userRole="admin" />;
  }

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.users.total}</p>
          </div>

          <div className="stat-card">
            <h3>Active Lost Items</h3>
            <p className="stat-number">{stats.items.lost}</p>
          </div>

          <div className="stat-card">
            <h3>Active Found Items</h3>
            <p className="stat-number">{stats.items.found}</p>
          </div>

          <div className="stat-card">
            <h3>Claimed Items</h3>
            <p className="stat-number">{stats.items.claimed}</p>
          </div>

          <div className="stat-card">
            <h3>Pending Reports</h3>
            <p className="stat-number warning">{stats.pendingReports}</p>
          </div>

          <div className="stat-card">
            <h3>Pending Approvals</h3>
            <p className="stat-number warning">{stats.pendingApprovals}</p>
          </div>

          <div className="stat-card">
            <h3>Items Received</h3>
            <p className="stat-number">{stats.transactions.received || 0}</p>
          </div>

          <div className="stat-card">
            <h3>Items Released</h3>
            <p className="stat-number">{stats.transactions.released || 0}</p>
          </div>
        </div>
      )}

      <div className="admin-quick-links">
        <h2>Quick Actions</h2>
        <div className="link-grid">
          <a href="/admin/users" className="quick-link-card">
            <h3>Manage Users</h3>
            <p>View and manage all users</p>
          </a>
          <a href="/admin/items" className="quick-link-card">
            <h3>Manage Items</h3>
            <p>View all lost and found items</p>
          </a>
          <a href="/admin/reports" className="quick-link-card">
            <h3>Handle Reports</h3>
            <p>Review and resolve reports</p>
          </a>
          <a href="/admin/transactions" className="quick-link-card">
            <h3>View Transactions</h3>
            <p>All security transactions</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
