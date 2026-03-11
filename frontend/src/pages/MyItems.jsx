import { useEffect, useState } from 'react';
import { itemsAPI } from '../services/api';
import { toast } from 'react-toastify';
import ItemCard from '../components/ItemCard';

const MyItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await itemsAPI.getMy();
      setItems(response.data.items);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemsAPI.delete(itemId);
        toast.success('Item deleted successfully');
        loadItems();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete item');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>My Items</h1>

      <div className="items-grid">
        {items.length === 0 ? (
          <p>You haven't posted any items yet.</p>
        ) : (
          items.map(item => (
            <ItemCard key={item.id} item={item} showActions={true} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
};

export default MyItems;
