import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function BrowsePanel({ openClaim }) {
  const { user } = useAuth();
  const [foodItems] = useState([
    {
      id: 1,
      title: 'Fresh Vegetables Mix',
      provider: 'Green Mart Store',
      price: '₹150',
      coordinates: [28.7041, 77.1025],
      dist: '2.5 km',
      until: '4 hours',
      until_text: '04:30 PM',
      image: '🥗',
    },
    {
      id: 2,
      title: 'Cooked Rice & Curry',
      provider: 'Local Restaurant',
      price: '₹200',
      coordinates: [28.6139, 77.2090],
      dist: '1.2 km',
      until: '2 hours',
      until_text: '02:30 PM',
      image: '🍛',
    },
    {
      id: 3,
      title: 'Bakery Items - Bread',
      provider: 'City Bakery',
      price: '₹100',
      coordinates: [28.7275, 77.0470],
      dist: '3.8 km',
      until: '3 hours',
      until_text: '03:30 PM',
      image: '🥖',
    },
    {
      id: 4,
      title: 'Fresh Fruits',
      provider: 'Organic Fruits Store',
      price: '₹180',
      coordinates: [28.6692, 77.0601],
      dist: '1.8 km',
      until: '5 hours',
      until_text: '05:30 PM',
      image: '🍎',
    },
  ]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Available Food Listings</h1>
        <p style={styles.subtitle}>Browse nearby food items available for claim</p>
      </div>

      {!user ? (
        <div style={styles.authPrompt}>
          <div style={styles.promptBox}>
            <p style={styles.promptText}>👤 Please sign in to browse and claim food items</p>
          </div>
        </div>
      ) : (
        <div style={styles.listingsGrid}>
          {foodItems.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.cardImage}>{item.image}</div>
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.cardProvider}>from {item.provider}</p>

                <div style={styles.cardDetails}>
                  <div style={styles.detail}>
                    <span style={styles.detailLabel}>Distance</span>
                    <span style={styles.detailValue}>{item.dist}</span>
                  </div>
                  <div style={styles.detail}>
                    <span style={styles.detailLabel}>Price</span>
                    <span style={styles.detailValue}>{item.price}</span>
                  </div>
                  <div style={styles.detail}>
                    <span style={styles.detailLabel}>Available until</span>
                    <span style={styles.detailValue}>{item.until_text}</span>
                  </div>
                </div>
              </div>

              <button
                style={styles.claimBtn}
                onClick={() => openClaim(item)}
              >
                Claim item
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
    background: '#f7f6f2',
    minHeight: 'calc(100vh - 80px)',
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
  listingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
  },
  cardImage: {
    fontSize: '60px',
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f1efe8',
  },
  cardContent: {
    padding: '16px',
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2C2C2A',
    margin: '0 0 4px 0',
  },
  cardProvider: {
    fontSize: '12px',
    color: '#888780',
    margin: '0 0 12px 0',
  },
  cardDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '12px',
  },
  detail: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
  },
  detailLabel: {
    color: '#888780',
    fontWeight: '500',
  },
  detailValue: {
    color: '#3B6D11',
    fontWeight: '600',
  },
  claimBtn: {
    padding: '10px 16px',
    background: '#3B6D11',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};

export default BrowsePanel;
