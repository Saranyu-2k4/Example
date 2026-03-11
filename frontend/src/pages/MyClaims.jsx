import { useEffect, useState } from 'react';
import { claimsAPI } from '../services/api';

const MyClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    try {
      const response = await claimsAPI.getMy();
      setClaims(response.data.claims);
    } catch (error) {
      console.error('Error loading claims:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>My Claims</h1>

      {claims.length === 0 ? (
        <p>You haven't made any claims yet.</p>
      ) : (
        <div className="claims-list">
          {claims.map(claim => (
            <div key={claim.id} className="claim-card">
              {claim.image_url && (
                <img src={`http://localhost:5000${claim.image_url}`} alt={claim.item_name} />
              )}
              <div className="claim-details">
                <h3>{claim.item_name}</h3>
                <p><strong>Category:</strong> {claim.category}</p>
                <p><strong>Status:</strong> <span className={`status-badge ${claim.status}`}>{claim.status}</span></p>
                <p><strong>Claimed on:</strong> {new Date(claim.claimed_at).toLocaleString()}</p>
                
                {claim.status === 'pending' && (
                  <div className="otp-info">
                    <p><strong>Your OTP:</strong> <code>{claim.otp}</code></p>
                    <p>Please provide this OTP to the security officer to collect your item.</p>
                    <p><small>OTP expires on: {new Date(claim.otp_expiry).toLocaleString()}</small></p>
                  </div>
                )}

                {claim.status === 'collected' && (
                  <p className="success-msg">✓ Item collected on {new Date(claim.collected_at).toLocaleString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClaims;
