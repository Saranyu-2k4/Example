import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { itemsAPI, claimsAPI } from '../services/api';
import PostModal from '../components/PostModal';
import FoundItemCard from '../components/FoundItemCard';
import { sampleFoundItems } from '../data/sampleFoundItems';
import { normalizeCategory } from '../utils/categoryUtils';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ myItems: 0, myClaims: 0 });
  const [loading, setLoading] = useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [foundItems, setFoundItems] = useState([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      if (user.role === 'student' || user.role === 'staff') {
        try {
          const [itemsRes, claimsRes, foundRes] = await Promise.all([
            itemsAPI.getMy(),
            claimsAPI.getMy(),
            itemsAPI.getAll({ type: 'found', status: 'active', limit: 6 })
          ]);
          setStats({
            myItems: itemsRes.data.count,
            myClaims: claimsRes.data.count
          });
          const apiItems = (foundRes.data.items || []).map((item) => ({
            ...item,
            category: normalizeCategory(item.category, item.name || item.item_name)
          }));
          setFoundItems(apiItems.length > 0 ? apiItems : sampleFoundItems);
        } catch (apiError) {
          // If API fails, use sample data
          console.log('Using sample data for demonstration');
          setFoundItems(sampleFoundItems);
          setStats({ myItems: 0, myClaims: 0 });
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setFoundItems(sampleFoundItems);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="dashboard">
        <div className="dashboard-top">
          <div>
            <h1>Welcome, {user?.full_name}!</h1>
            <p className="role-badge">Role: {user?.role}</p>
          </div>
          {(user?.role === 'student' || user?.role === 'staff') && (
            <button 
              onClick={() => setIsPostModalOpen(true)} 
              className="btn-primary btn-posts"
            >
              ➕ Posts
            </button>
          )}
        </div>

        {!user?.is_verified && (
          <div className="alert alert-warning">
            Your email is not verified. <Link to="/verify-email">Verify now</Link>
          </div>
        )}

        {(user?.role === 'security' || user?.role === 'admin') && !user?.is_approved && (
          <div className="alert alert-info">
            Your account is pending admin approval.
          </div>
        )}

        {/* Found Items Feed Section */}
        {(user?.role === 'student' || user?.role === 'staff') && foundItems.length > 0 && (
          <div className="found-items-section">
            <div className="section-header">
              <h2>Recently Found Items</h2>
              <Link to="/found-items" className="link-more">View All →</Link>
            </div>
            <div className="found-items-grid">
              {foundItems.map((item) => (
                <FoundItemCard
                  key={item.id}
                  item={item}
                  onClaim={() => {
                    claimsAPI.create(item.id).then(() => {
                      navigate('/my-claims');
                    }).catch((err) => {
                      console.error('Claim error:', err);
                    });
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Post Modal */}
      <PostModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
