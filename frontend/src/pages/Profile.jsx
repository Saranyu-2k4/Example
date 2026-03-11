import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('findora-theme') || 'light';
    setTheme(storedTheme);
  }, []);

  const switchTheme = (nextTheme) => {
    setTheme(nextTheme);
    localStorage.setItem('findora-theme', nextTheme);
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${nextTheme}-mode`);
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="profile-container">
        <h1>My Profile</h1>

        <div className="theme-switcher">
          <strong>Theme:</strong>
          <div className="theme-switcher-actions">
            <button
              type="button"
              className={`btn-small ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => switchTheme('light')}
            >
              Light Mode
            </button>
            <button
              type="button"
              className={`btn-small ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => switchTheme('dark')}
            >
              Dark Mode
            </button>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-info">
            <h2>{user.full_name}</h2>
            <p className="role-badge">{user.role}</p>

            <div className="profile-details">
              <div className="detail-row">
                <strong>Username:</strong>
                <span>{user.username}</span>
              </div>
              <div className="detail-row">
                <strong>Email:</strong>
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="detail-row">
                  <strong>Phone:</strong>
                  <span>{user.phone}</span>
                </div>
              )}
              <div className="detail-row">
                <strong>Email Verified:</strong>
                <span className={user.is_verified ? 'verified' : 'not-verified'}>
                  {user.is_verified ? '✓ Verified' : '✗ Not Verified'}
                </span>
              </div>
              {(user.role === 'security' || user.role === 'admin') && (
                <div className="detail-row">
                  <strong>Account Status:</strong>
                  <span className={user.is_approved ? 'approved' : 'pending'}>
                    {user.is_approved ? '✓ Approved' : 'Pending Approval'}
                  </span>
                </div>
              )}
              <div className="detail-row">
                <strong>Member Since:</strong>
                <span>{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
