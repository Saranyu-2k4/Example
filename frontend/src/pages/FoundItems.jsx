import { useEffect, useState } from 'react';
import { itemsAPI } from '../services/api';
import FoundItemCard from '../components/FoundItemCard';
import { sampleFoundItems } from '../data/sampleFoundItems';
import { normalizeCategory } from '../utils/categoryUtils';

const FoundItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  });

  const normalizeItem = (item) => ({
    id: item.id,
    name: item.name || item.item_name || 'Unnamed Item',
    description: item.description || '',
    location: item.location || 'Unknown location',
    date_found: item.date_found || item.date || item.created_at,
    image: item.image || (item.image_url ? `http://localhost:5000${item.image_url}` : 'https://via.placeholder.com/300x200?text=Item+Image'),
    category: normalizeCategory(item.category, item.name || item.item_name),
    type: item.type || 'found',
    status: item.status || 'active',
    posted_by: item.posted_by || {
      id: item.user_id,
      full_name: item.full_name || item.username || 'Unknown User'
    }
  });

  useEffect(() => {
    loadItems();
  }, [filters]);

  const loadItems = async () => {
    try {
      const response = await itemsAPI.getAll({ type: 'found', status: 'active' });
      const apiItems = response.data?.items || [];
      const normalizedItems = (apiItems.length > 0 ? apiItems : sampleFoundItems).map(normalizeItem);
      const searchTerm = filters.search.trim().toLowerCase();

      const filteredItems = normalizedItems.filter((item) => {
        const matchesCategory = !filters.category || item.category === filters.category;
        const matchesSearch = !searchTerm ||
          item.name.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.location.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
      });

      setItems(filteredItems);
    } catch (error) {
      console.error('Error loading items:', error);
      const fallbackItems = sampleFoundItems
        .map(normalizeItem)
        .filter((item) => !filters.category || item.category === filters.category)
        .filter((item) => {
          const searchTerm = filters.search.trim().toLowerCase();
          if (!searchTerm) return true;
          return (
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.location.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
          );
        });
      setItems(fallbackItems);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Found Items</h1>

      <div className="filters">
        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">All Categories</option>
          <option value="NIC">NIC</option>
          <option value="Student ID">Student ID</option>
          <option value="Bank Card">Bank Card</option>
          <option value="Wallet">Wallet</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          name="search"
          placeholder="Search items..."
          value={filters.search}
          onChange={handleFilterChange}
        />
      </div>

      <div className="items-grid">
        {items.length === 0 ? (
          <p>No found items available.</p>
        ) : (
          items.map((item) => (
            <FoundItemCard
              key={item.id}
              item={item}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FoundItems;
