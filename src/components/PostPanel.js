import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function PostPanel({ switchTab }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryTime, setExpiryTime] = useState('1');
  const [category, setCategory] = useState('vegetables');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!title.trim() || !description.trim() || !price.trim() || !quantity.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    // Save posting to localStorage
    const listings = JSON.parse(localStorage.getItem('foodListings') || '[]');
    const newListing = {
      id: Date.now(),
      title,
      description,
      price,
      quantity,
      expiryTime,
      category,
      provider: user?.displayName || user?.email?.split('@')[0] || 'Anonymous Seller',
      postedAt: new Date().toISOString(),
      coordinates: [28.7041, 77.1025], // Default location
    };

    listings.push(newListing);
    localStorage.setItem('foodListings', JSON.stringify(listings));

    setSuccess(true);
    setTitle('');
    setDescription('');
    setPrice('');
    setQuantity('');
    setExpiryTime('1');
    setCategory('vegetables');

    setTimeout(() => {
      setSuccess(false);
      switchTab('browse');
    }, 2000);
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.authPrompt}>
          <div style={styles.promptBox}>
            <p style={styles.promptText}>👤 Please sign in to list food items</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Post Surplus Food</h1>
        <p style={styles.subtitle}>List your surplus food items and help reduce waste</p>
      </div>

      <div style={styles.formWrapper}>
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.errorMsg}>{error}</div>}
          {success && <div style={styles.successMsg}>✓ Food item posted successfully! Redirecting...</div>}

          <div style={styles.field}>
            <label style={styles.fieldLabel}>Food Item Name *</label>
            <input
              type="text"
              style={styles.fieldInput}
              placeholder="e.g., Fresh Vegetables Mix"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.fieldLabel}>Description *</label>
            <textarea
              style={{ ...styles.fieldInput, minHeight: '100px', resize: 'vertical' }}
              placeholder="Describe your food items, condition, and any special details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div style={styles.fieldRow}>
            <div style={styles.field}>
              <label style={styles.fieldLabel}>Category *</label>
              <select
                style={styles.fieldInput}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="vegetables">🥬 Vegetables</option>
                <option value="fruits">🍎 Fruits</option>
                <option value="cooked">🍛 Cooked Food</option>
                <option value="bakery">🥖 Bakery</option>
                <option value="dairy">🥛 Dairy</option>
                <option value="other">📦 Other</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.fieldLabel}>Quantity *</label>
              <input
                type="text"
                style={styles.fieldInput}
                placeholder="e.g., 5 kg, 10 pieces"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={styles.fieldRow}>
            <div style={styles.field}>
              <label style={styles.fieldLabel}>Price *</label>
              <div style={styles.priceInput}>
                <span style={styles.currencySymbol}>₹</span>
                <input
                  type="number"
                  style={styles.fieldInputNoLeft}
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.fieldLabel}>Available For *</label>
              <select
                style={styles.fieldInput}
                value={expiryTime}
                onChange={(e) => setExpiryTime(e.target.value)}
              >
                <option value="0.5">30 minutes</option>
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="4">4 hours</option>
                <option value="8">8 hours</option>
                <option value="24">1 day</option>
              </select>
            </div>
          </div>

          <div style={styles.fieldNote}>
            <strong>Important:</strong> All food items must comply with local food safety guidelines. Cooked food must be consumed within safe time limits.
          </div>

          <button type="submit" style={styles.submitBtn}>
            Post Food Item
          </button>
        </form>

        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>📋 Tips for Successful Listings</h3>
          <ul style={styles.infoList}>
            <li>Be clear about the food type and quantity</li>
            <li>Mention any dietary information (vegan, allergens, etc.)</li>
            <li>Set realistic prices - lower prices get claimed faster</li>
            <li>Be honest about quality and condition</li>
            <li>Respond quickly to claims</li>
            <li>Follow food safety guidelines strictly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '24px',
    maxWidth: '900px',
    margin: '0 auto',
    background: '#f7f6f2',
    minHeight: 'calc(100vh - 80px)',
  },
  authPrompt: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  promptBox: {
    background: '#ffffff',
    border: '2px dashed #639922',
    borderRadius: '14px',
    padding: '32px',
    textAlign: 'center',
    maxWidth: '400px',
  },
  promptText: {
    color: '#3B6D11',
    fontSize: '16px',
    fontWeight: '500',
    margin: '0',
  },
  header: {
    marginBottom: '32px',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2C2C2A',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#888780',
    margin: '0',
  },
  formWrapper: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
  },
  form: {
    background: '#ffffff',
    borderRadius: '14px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  errorMsg: {
    background: '#FCEBEB',
    border: '0.5px solid #F7C1C1',
    color: '#A32D2D',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '13px',
  },
  successMsg: {
    background: '#E1F5EE',
    border: '0.5px solid #1D9E75',
    color: '#0F6E56',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '13px',
    fontWeight: '500',
  },
  field: {
    marginBottom: '16px',
  },
  fieldLabel: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#2C2C2A',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '8px',
  },
  fieldInput: {
    width: '100%',
    padding: '10px 12px',
    border: '0.5px solid #e0ded8',
    borderRadius: '8px',
    fontSize: '13px',
    fontFamily: '"DM Sans", sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  fieldInputNoLeft: {
    width: '100%',
    padding: '10px 12px',
    border: 'none',
    borderRadius: '0 8px 8px 0',
    fontSize: '13px',
    fontFamily: '"DM Sans", sans-serif',
    outline: 'none',
  },
  fieldRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  priceInput: {
    display: 'flex',
    alignItems: 'center',
    border: '0.5px solid #e0ded8',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  currencySymbol: {
    padding: '0 12px',
    background: '#f1efe8',
    color: '#2C2C2A',
    fontWeight: '600',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  fieldNote: {
    background: '#EAF3DE',
    border: '0.5px solid #639922',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#3B6D11',
    marginBottom: '16px',
    lineHeight: '1.5',
  },
  submitBtn: {
    width: '100%',
    padding: '14px 16px',
    background: '#3B6D11',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  infoBox: {
    background: '#ffffff',
    borderRadius: '14px',
    padding: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  infoTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2C2C2A',
    margin: '0 0 12px 0',
  },
  infoList: {
    margin: '0',
    paddingLeft: '20px',
    fontSize: '13px',
    color: '#888780',
    lineHeight: '1.8',
  },
};

export default PostPanel;
