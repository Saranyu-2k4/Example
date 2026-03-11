import { useEffect, useState } from 'react';
import { securityAPI } from '../../services/api';
import { toast } from 'react-toastify';

const SecurityPendingClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    try {
      const response = await securityAPI.getPendingClaims();
      setClaims(response.data.claims);
    } catch (error) {
      console.error('Error loading claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await securityAPI.verifyClaim(selectedClaim.id, otp);
      toast.success('Item released successfully');
      setSelectedClaim(null);
      setOtp('');
      loadClaims();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify claim');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Pending Claims</h1>

      {claims.length === 0 ? (
        <p>No pending claims.</p>
      ) : (
        <div className="claims-list">
          {claims.map(claim => (
            <div key={claim.id} className="claim-card">
              <div className="claim-details">
                <h3>{claim.item_name}</h3>
                <p><strong>Category:</strong> {claim.category}</p>
                <p><strong>Location:</strong> {claim.location}</p>
                <p><strong>Claimer:</strong> {claim.full_name}</p>
                <p><strong>Phone:</strong> {claim.phone}</p>
                <p><strong>Claimed on:</strong> {new Date(claim.claimed_at).toLocaleString()}</p>
                <button onClick={() => setSelectedClaim(claim)} className="btn-primary">
                  Verify & Release
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedClaim && (
        <div className="modal-overlay" onClick={() => setSelectedClaim(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Verify Claim</h2>
            <p>Item: <strong>{selectedClaim.item_name}</strong></p>
            <p>Claimer: <strong>{selectedClaim.full_name}</strong></p>
            <form onSubmit={handleVerify}>
              <div className="form-group">
                <label>Enter OTP from Claimer</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  required
                  autoFocus
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Verify & Release</button>
                <button type="button" onClick={() => setSelectedClaim(null)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityPendingClaims;
