import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../context/AuthContext';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapPanel({ openClaim }) {
  const { user } = useAuth();
  const [userLocation, setUserLocation] = useState([28.7041, 77.1025]); // Default Delhi
  const [selectedItem, setSelectedItem] = useState(null);

  const foodItems = [
    {
      id: 1,
      title: 'Fresh Vegetables Mix',
      provider: 'Green Mart Store',
      price: '₹150',
      coordinates: [28.7041, 77.1025],
      dist: '2.5 km',
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
      until_text: '05:30 PM',
      image: '🍎',
    },
  ];

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.authPrompt}>
          <div style={styles.promptBox}>
            <p style={styles.promptText}>👤 Please sign in to view the map and claim food items</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.mapWrapper}>
        <MapContainer
          center={userLocation}
          zoom={13}
          style={styles.map}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {/* User location */}
          <Marker position={userLocation}>
            <Popup>Your Location</Popup>
          </Marker>

          {/* User search radius */}
          <Circle
            center={userLocation}
            radius={3000}
            pathOptions={{ color: 'blue', fillOpacity: 0.1 }}
          />

          {/* Food item markers */}
          {foodItems.map((item) => (
            <Marker
              key={item.id}
              position={item.coordinates}
              eventHandlers={{
                click: () => setSelectedItem(item),
              }}
            >
              <Popup>{item.image} {item.title}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {selectedItem && (
        <div style={styles.sidebar}>
          <button
            style={styles.closeBtn}
            onClick={() => setSelectedItem(null)}
          >
            ✕
          </button>

          <div style={styles.sidebarImage}>{selectedItem.image}</div>

          <h3 style={styles.sidebarTitle}>{selectedItem.title}</h3>
          <p style={styles.sidebarProvider}>from {selectedItem.provider}</p>

          <div style={styles.sidebarDetails}>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Distance</span>
              <span style={styles.detailValue}>{selectedItem.dist}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Price</span>
              <span style={styles.detailValue}>{selectedItem.price}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Available until</span>
              <span style={styles.detailValue}>{selectedItem.until_text}</span>
            </div>
          </div>

          <button
            style={styles.claimBtn}
            onClick={() => {
              openClaim(selectedItem);
              setSelectedItem(null);
            }}
          >
            Claim this item
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: 'calc(100vh - 80px)',
    position: 'relative',
    display: 'flex',
  },
  authPrompt: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    background: '#f7f6f2',
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
  mapWrapper: {
    flex: '1',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  sidebar: {
    width: '320px',
    background: '#ffffff',
    padding: '20px',
    borderLeft: '1px solid #e0ded8',
    overflowY: 'auto',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#888780',
  },
  sidebarImage: {
    fontSize: '60px',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f1efe8',
    borderRadius: '10px',
    marginBottom: '16px',
    marginTop: '24px',
  },
  sidebarTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2C2C2A',
    margin: '0 0 4px 0',
  },
  sidebarProvider: {
    fontSize: '12px',
    color: '#888780',
    margin: '0 0 16px 0',
  },
  sidebarDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e0ded8',
  },
  detailRow: {
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
    width: '100%',
    padding: '12px 16px',
    background: '#3B6D11',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};

export default MapPanel;
