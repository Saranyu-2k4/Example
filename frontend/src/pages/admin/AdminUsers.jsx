import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import MobileWarning from '../../components/MobileWarning';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
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
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, approvalsRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getPendingApprovals()
      ]);
      setUsers(usersRes.data.users);
      setPendingApprovals(approvalsRes.data.approvals);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await adminAPI.approveUser(userId);
      toast.success('User approved successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to approve user');
    }
  };

  const handleBan = async (userId, banned) => {
    try {
      await adminAPI.banUser(userId, banned);
      toast.success(banned ? 'User banned' : 'User unbanned');
      loadData();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleSuspend = async (userId, suspended) => {
    try {
      await adminAPI.suspendUser(userId, suspended);
      toast.success(suspended ? 'User suspended' : 'Suspension lifted');
      loadData();
    } catch (error) {
      toast.error('Failed to update user');
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
      <h1>User Management</h1>

      {pendingApprovals.length > 0 && (
        <div className="section">
          <h2>Pending Approvals ({pendingApprovals.length})</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingApprovals.map(user => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button onClick={() => handleApprove(user.id)} className="btn-small btn-success">
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="section">
        <h2>All Users ({users.length})</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.is_banned && <span className="badge badge-danger">Banned</span>}
                    {user.is_suspended && <span className="badge badge-warning">Suspended</span>}
                    {!user.is_approved && <span className="badge badge-info">Pending</span>}
                    {!user.is_banned && !user.is_suspended && user.is_approved && (
                      <span className="badge badge-success">Active</span>
                    )}
                  </td>
                  <td className="action-buttons">
                    {!user.is_banned ? (
                      <button onClick={() => handleBan(user.id, true)} className="btn-small btn-danger">
                        Ban
                      </button>
                    ) : (
                      <button onClick={() => handleBan(user.id, false)} className="btn-small btn-success">
                        Unban
                      </button>
                    )}
                    {!user.is_suspended ? (
                      <button onClick={() => handleSuspend(user.id, true)} className="btn-small btn-warning">
                        Suspend
                      </button>
                    ) : (
                      <button onClick={() => handleSuspend(user.id, false)} className="btn-small btn-success">
                        Unsuspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
