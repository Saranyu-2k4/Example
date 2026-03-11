import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FoundItemCard.css';
import ClaimModal from './ClaimModal';
import { normalizeCategory } from '../utils/categoryUtils';

const FoundItemCard = ({ item, onClaim }) => {
  const navigate = useNavigate();
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const normalizedItem = {
    ...item,
    category: normalizeCategory(item.category, item.name || item.item_name)
  };
  
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleClaimClick = () => {
    setIsClaimModalOpen(true);
  };

  const handleReportClick = () => {
    navigate(`/report-post/${normalizedItem.id}`);
  };

  return (
    <div className="found-item-card">
      <div className="card-image-container">
        <img 
          src={normalizedItem.image} 
          alt={normalizedItem.name} 
          className="card-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Item+Image';
          }}
        />
        <div className="card-badge">{normalizedItem.category}</div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{normalizedItem.name}</h3>
        
        <div className="card-meta">
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <span className="meta-text">{formatDate(normalizedItem.date_found)}</span>
          </div>
        </div>

        <p className="card-description">{normalizedItem.description}</p>

        <div className="card-posted-by">
          <small>Posted by <strong>{normalizedItem.posted_by.full_name}</strong></small>
        </div>

        <div className="card-actions">
          <button 
            onClick={handleClaimClick}
            className="btn btn-claim"
          >
            🏷️ Claim This Item
          </button>
          <button 
            onClick={handleReportClick}
            className="btn btn-report"
          >
            🚩 Report
          </button>
        </div>
      </div>

      <ClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        item={normalizedItem}
      />
    </div>
  );
};

export default FoundItemCard;
