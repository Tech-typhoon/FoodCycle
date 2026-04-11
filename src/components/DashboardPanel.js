import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function DashboardPanel() {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [listings, setListings] = useState([]);
  const [activeTab, setActiveTab] = useState('claims');

  useEffect(() => {
    // Load user's claims
    const userClaims = JSON.parse(localStorage.getItem('userClaims') || '[]');
    setClaims(userClaims);

    // Load user's listings
    const allListings = JSON.parse(localStorage.getItem('foodListings') || '[]');
    const userListings = allListings.filter(
      (listing) => listing.provider === (user?.displayName || user?.email?.split('@')[0])
    );
    setListings(userListings);
  }, [user]);

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.authPrompt}>
          <div style={styles.promptBox}>
            <p style={styles.promptText}>👤 Please sign in to view your dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Dashboard</h1>
        <p style={styles.subtitle}>Manage your claims and listings</p>
      </div>

      <div style={styles.userInfo}>
        <div style={styles.userCard}>
          <div style={styles.userIcon}>👤</div>
          <div>
            <p style={styles.userName}>{user.displayName || user.email}</p>
            <p style={styles.userEmail}>{user.email}</p>
          </div>
        </div>
      </div>

      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'claims' ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab('claims')}
        >
          My Claims ({claims.length})
        </button>
        <button
          style={{
            ...styles.tab,
            ...(!activeTab === 'claims' ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab('listings')}
        >
          My Listings ({listings.length})
        </button>
      </div>

      {activeTab === 'claims' ? (
        <div style={styles.content}>
          {claims.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyIcon}>📭</p>
              <p style={styles.emptyText}>No claims yet</p>
              <p style={styles.emptySubtext}>Start claiming food items to see them here</p>
            </div>
          ) : (
            <div style={styles.itemsGrid}>
              {claims.map((claim) => (
                <div key={claim.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div style={styles.cardTitle}>{claim.title}</div>
                    <div style={{ ...styles.badge, background: '#EAF3DE', color: '#3B6D11' }}>
                      {claim.status}
                    </div>
                  </div>
                  <div style={styles.cardDetails}>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Provider</span>
                      <span style={styles.detailValue}>{claim.provider}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Price</span>
                      <span style={styles.detailValue}>{claim.price}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Claimed on</span>
                      <span style={styles.detailValue}>{new Date(claim.claimedAt).toLocaleDateString()}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Pickup Address</span>
                      <span style={styles.detailValue}>{claim.address.substring(0, 30)}...</span>
                    </div>
                  </div>
                  <button style={styles.viewBtn}>View Status →</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={styles.content}>
          {listings.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyIcon}>📦</p>
              <p style={styles.emptyText}>No listings yet</p>
              <p style={styles.emptySubtext}>Post your surplus food to see it here</p>
            </div>
          ) : (
            <div style={styles.itemsGrid}>
              {listings.map((listing) => (
                <div key={listing.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div style={styles.cardTitle}>{listing.title}</div>
                    <div style={{ ...styles.badge, background: '#E1F5EE', color: '#0F6E56' }}>
                      Active
                    </div>
                  </div>
                  <div style={styles.cardDetails}>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Category</span>
                      <span style={styles.detailValue}>{listing.category}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Price</span>
                      <span style={styles.detailValue}>₹{listing.price}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Quantity</span>
                      <span style={styles.detailValue}>{listing.quantity}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Posted on</span>
                      <span style={styles.detailValue}>{new Date(listing.postedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button style={styles.viewBtn}>Edit Listing →</button>
                </div>
              ))}
            </div>
          )}
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
    marginBottom: '24px',
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
  userInfo: {
    marginBottom: '24px',
  },
  userCard: {
    background: '#ffffff',
    borderRadius: '14px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  userIcon: {
    fontSize: '32px',
  },
  userName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2C2C2A',
    margin: '0',
  },
  userEmail: {
    fontSize: '12px',
    color: '#888780',
    margin: '4px 0 0 0',
  },
  tabs: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    borderBottom: '1px solid #e0ded8',
  },
  tab: {
    padding: '12px 16px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#888780',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s',
  },
  tabActive: {
    color: '#3B6D11',
    borderBottomColor: '#3B6D11',
  },
  content: {
    minHeight: '400px',
  },
  emptyState: {
    background: '#ffffff',
    borderRadius: '14px',
    padding: '60px 24px',
    textAlign: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  emptyIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2C2C2A',
    margin: '0 0 8px 0',
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#888780',
    margin: '0',
  },
  itemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '14px',
    padding: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e0ded8',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2C2C2A',
    flex: '1',
  },
  badge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '4px 12px',
    borderRadius: '6px',
    textTransform: 'capitalize',
    marginLeft: '12px',
  },
  cardDetails: {
    flex: '1',
    marginBottom: '16px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    marginBottom: '8px',
  },
  detailLabel: {
    color: '#888780',
    fontWeight: '500',
  },
  detailValue: {
    color: '#2C2C2A',
    fontWeight: '600',
  },
  viewBtn: {
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

export default DashboardPanel;
