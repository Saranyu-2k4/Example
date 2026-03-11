import { useEffect, useState } from 'react';
import { itemsAPI } from '../services/api';
import ItemCard from '../components/ItemCard';

const LostItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  });

  useEffect(() => {
    loadItems();
  }, [filters]);

  const loadItems = async () => {
    try {
      const response = await itemsAPI.getAll({ type: 'lost', status: 'active', ...filters });
      setItems(response.data.items);
    } catch (error) {
      console.error('Error loading items:', error);
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
      <h1>Lost Items</h1>

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
          <p>No lost items found.</p>
        ) : (
          items.map(item => <ItemCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
};

export default LostItems;
