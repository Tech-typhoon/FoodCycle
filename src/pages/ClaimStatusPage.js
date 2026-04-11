import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function ClaimStatusPage({ claimData, onClose }) {
  const [userLocation, setUserLocation] = useState(null);
  const [route, setRoute] = useState(null);
  const [status, setStatus] = useState('pending');
  const [estimatedTime, setEstimatedTime] = useState('30-45');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user's live location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          
          // Create route between user location and food location
          if (claimData?.coordinates) {
            setRoute([
              [latitude, longitude],
              claimData.coordinates,
            ]);
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    }

    // Simulate status updates
    const statusUpdates = ['pending', 'confirmed', 'ready_for_pickup', 'picked_up', 'delivered'];
    const currentIndex = Math.floor(Math.random() * statusUpdates.length);
    setStatus(statusUpdates[currentIndex]);
  }, [claimData]);

  const getStatusDisplay = (status) => {
    const statusMap = {
      pending: { label: 'Pending Confirmation', color: '#EF9F27', icon: '⏳' },
      confirmed: { label: 'Confirmed', color: '#639922', icon: '✓' },
      ready_for_pickup: { label: 'Ready for Pickup', color: '#1D9E75', icon: '📦' },
      picked_up: { label: 'Picked Up', color: '#3B6D11', icon: '🚚' },
      delivered: { label: 'Delivered', color: '#1D9E75', icon: '✓' },
    };
    return statusMap[status] || statusMap.pending;
  };

  const currentStatus = getStatusDisplay(status);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Claim Tracking</h1>
          <p style={styles.subtitle}>Track your food delivery in real-time</p>
        </div>
        <button
          style={styles.closeBtn}
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <div style={styles.contentGrid}>
        {/* LEFT PANEL - STATUS & DETAILS */}
        <div style={styles.leftPanel}>
          <div style={styles.statusCard}>
            <div style={{ ...styles.statusBadge, background: currentStatus.color }}>
              <span style={styles.statusIcon}>{currentStatus.icon}</span>
              <span style={styles.statusLabel}>{currentStatus.label}</span>
            </div>

            <div style={styles.claimDetails}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Food Item</span>
                <span style={styles.detailValue}>{claimData?.title || 'Food Item'}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Provider</span>
                <span style={styles.detailValue}>{claimData?.provider || 'Provider'}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Your Name</span>
                <span style={styles.detailValue}>{claimData?.name || 'Your Name'}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Mobile</span>
                <span style={styles.detailValue}>{claimData?.mobile || 'Your Mobile'}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Pickup Address</span>
                <span style={styles.detailValue}>{claimData?.address || 'Pickup Address'}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Price</span>
                <span style={styles.detailValue}>{claimData?.price || '₹0'}</span>
              </div>
            </div>

            <div style={styles.timeline}>
              <div style={styles.timelineItem}>
                <div style={{ ...styles.timelineMarker, background: status === 'pending' ? '#EF9F27' : '#3B6D11' }}>
                  ⏳
                </div>
                <div>
                  <div style={styles.timelineLabel}>Pending</div>
                  <div style={styles.timelineTime}>Waiting for confirmation</div>
                </div>
              </div>

              <div style={styles.timelineConnector}></div>

              <div style={styles.timelineItem}>
                <div style={{ ...styles.timelineMarker, background: status === 'confirmed' || status === 'ready_for_pickup' || status === 'picked_up' || status === 'delivered' ? '#639922' : '#ccc' }}>
                  ✓
                </div>
                <div>
                  <div style={styles.timelineLabel}>Confirmed</div>
                  <div style={styles.timelineTime}>Food is ready</div>
                </div>
              </div>

              <div style={styles.timelineConnector}></div>

              <div style={styles.timelineItem}>
                <div style={{ ...styles.timelineMarker, background: status === 'ready_for_pickup' || status === 'picked_up' || status === 'delivered' ? '#1D9E75' : '#ccc' }}>
                  📦
                </div>
                <div>
                  <div style={styles.timelineLabel}>Ready for Pickup</div>
                  <div style={styles.timelineTime}>Come pick it up</div>
                </div>
              </div>

              <div style={styles.timelineConnector}></div>

              <div style={styles.timelineItem}>
                <div style={{ ...styles.timelineMarker, background: status === 'picked_up' || status === 'delivered' ? '#3B6D11' : '#ccc' }}>
                  🚚
                </div>
                <div>
                  <div style={styles.timelineLabel}>Delivery</div>
                  <div style={styles.timelineTime}>En route or delivered</div>
                </div>
              </div>
            </div>

            <div style={styles.estimateBox}>
              <span style={styles.estimateLabel}>Estimated time:</span>
              <span style={styles.estimateValue}>{estimatedTime} minutes</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - MAP */}
        <div style={styles.rightPanel}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p>Getting your location...</p>
            </div>
          ) : userLocation ? (
            <MapContainer
              center={userLocation}
              zoom={15}
              style={styles.map}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />

              {/* User location marker */}
              <Marker position={userLocation}>
                <Popup>Your Location</Popup>
              </Marker>

              {/* Food location marker */}
              {claimData?.coordinates && (
                <Marker position={claimData.coordinates}>
                  <Popup>{claimData.title} - Pick up here</Popup>
                </Marker>
              )}

              {/* Route line */}
              {route && (
                <Polyline
                  positions={route}
                  color="#3B6D11"
                  weight={3}
                  opacity={0.8}
                  dash={[5, 5]}
                />
              )}
            </MapContainer>
          ) : (
            <div style={styles.errorContainer}>
              <p>Unable to get your location. Please enable location services.</p>
            </div>
          )}

          <div style={styles.mapInfo}>
            <div style={styles.mapInfoItem}>
              <span style={styles.mapInfoLabel}>📍 Your Location</span>
              {userLocation && (
                <span style={styles.mapInfoValue}>
                  {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                </span>
              )}
            </div>
            <div style={styles.mapInfoItem}>
              <span style={styles.mapInfoLabel}>🎯 Pickup Location</span>
              {claimData?.coordinates && (
                <span style={styles.mapInfoValue}>
                  {claimData.coordinates[0].toFixed(4)}, {claimData.coordinates[1].toFixed(4)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <div style={styles.footerText}>
          <p style={{ marginBottom: '8px', fontWeight: '500' }}>📞 Need Help?</p>
          <p>Contact the provider or call customer support if you face any issues.</p>
        </div>
        <button
          style={styles.completedBtn}
          onClick={onClose}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '24px',
    background: '#f7f6f2',
    minHeight: '100vh',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e0ded8',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2C2C2A',
    margin: '0 0 4px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#888780',
    margin: '0',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#888780',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: '24px',
    marginBottom: '24px',
  },
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  statusCard: {
    background: '#ffffff',
    borderRadius: '14px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 18px',
    borderRadius: '10px',
    color: '#ffffff',
    marginBottom: '24px',
  },
  statusIcon: {
    fontSize: '20px',
  },
  statusLabel: {
    fontSize: '16px',
    fontWeight: '600',
  },
  claimDetails: {
    marginBottom: '24px',
    borderBottom: '1px solid #e0ded8',
    paddingBottom: '24px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    fontSize: '13px',
  },
  detailLabel: {
    color: '#888780',
    fontWeight: '500',
  },
  detailValue: {
    color: '#2C2C2A',
    fontWeight: '600',
  },
  timeline: {
    marginBottom: '24px',
    paddingBottom: '24px',
    borderBottom: '1px solid #e0ded8',
  },
  timelineItem: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },
  timelineMarker: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '18px',
    flexShrink: '0',
  },
  timelineConnector: {
    height: '20px',
    width: '2px',
    background: '#e0ded8',
    margin: '-4px 0 -4px 19px',
  },
  timelineLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#2C2C2A',
  },
  timelineTime: {
    fontSize: '12px',
    color: '#888780',
    marginTop: '2px',
  },
  estimateBox: {
    background: '#EAF3DE',
    border: '1px solid #639922',
    borderRadius: '10px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estimateLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#3B6D11',
    textTransform: 'uppercase',
  },
  estimateValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#3B6D11',
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minHeight: '500px',
  },
  map: {
    width: '100%',
    height: '450px',
    borderRadius: '14px',
    overflow: 'hidden',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '450px',
    background: '#ffffff',
    borderRadius: '14px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e0ded8',
    borderTop: '4px solid #3B6D11',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '450px',
    background: '#ffffff',
    borderRadius: '14px',
    padding: '24px',
    textAlign: 'center',
  },
  mapInfo: {
    background: '#ffffff',
    borderRadius: '10px',
    padding: '12px 16px',
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
  },
  mapInfoItem: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  mapInfoLabel: {
    fontWeight: '600',
    color: '#2C2C2A',
  },
  mapInfoValue: {
    color: '#888780',
    fontSize: '11px',
    fontFamily: 'monospace',
  },
  footer: {
    background: '#ffffff',
    borderRadius: '14px',
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  footerText: {
    color: '#888780',
    fontSize: '13px',
  },
  completedBtn: {
    padding: '12px 32px',
    background: '#3B6D11',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};

export default ClaimStatusPage;
