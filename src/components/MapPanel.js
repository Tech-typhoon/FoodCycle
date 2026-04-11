import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const defaultCenter = [22.57, 88.36];

function LocationUpdater({ location, selectedItem }) {
  const map = useMap();

  useEffect(() => {
    if (selectedItem && selectedItem.position) {
      map.setView(selectedItem.position, 16, { animate: true });
    } else if (location) {
      map.setView(location, 14, { animate: true });
    }
  }, [location, selectedItem, map]);

  return null;
}

function MapPanel({ openClaim }) {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('GPS is not supported by this browser.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation([position.coords.latitude, position.coords.longitude]);
        setLocationError('');
      },
      () => {
        setLocationError('Please allow location access to show live GPS on the map.');
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const basePosition = location || defaultCenter;

  const mapItems = useMemo(() => [
    {
      id: 1,
      title: 'Freshly baked sourdough',
      source: 'Green Wheat Bakery',
      dist: '0.3 km',
      price: 'Free',
      until: '2 hrs',
      type: 'donation',
      position: [basePosition[0] + 0.0025, basePosition[1] + 0.0023],
    },
    {
      id: 2,
      title: 'Catered event leftovers',
      source: 'Spice Garden Caterers',
      dist: '0.7 km',
      price: '₹80',
      until: '4 hrs',
      type: 'discounted',
      position: [basePosition[0] - 0.0019, basePosition[1] + 0.0031],
    },
    {
      id: 3,
      title: 'Community pantry share',
      source: 'City Food Bank',
      dist: '1.1 km',
      price: 'Free',
      until: 'Tomorrow',
      type: 'community',
      position: [basePosition[0] + 0.0038, basePosition[1] - 0.0022],
    },
    {
      id: 4,
      title: 'Organic vegetable box',
      source: 'Farm Direct Hub',
      dist: '1.8 km',
      price: '₹150',
      until: '6 hrs',
      type: 'discounted',
      position: [basePosition[0] - 0.0032, basePosition[1] - 0.0017],
    },
    {
      id: 5,
      title: 'Dairy surplus',
      source: 'Morning Fresh Dairy',
      dist: '2.4 km',
      price: 'Free',
      until: '3 hrs',
      type: 'donation',
      position: [basePosition[0] + 0.0042, basePosition[1] + 0.0011],
    },
  ], [basePosition]);

  const filteredItems = mapItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.source.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' ||
      (filterType === 'free' && item.price === 'Free') ||
      (filterType === 'paid' && item.price !== 'Free');

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="panel active">
      <div className="map-container">
        <div className="map-area">
          <MapContainer
            center={basePosition}
            zoom={14}
            scrollWheelZoom={true}
            style={{ width: '100%', minHeight: '460px', borderRadius: '14px' }}
          >
            <LocationUpdater location={location} selectedItem={selectedItem} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {filteredItems.map((item) => (
              <Marker
                key={item.id}
                position={item.position}
                eventHandlers={{
                  click: () => {
                    setSelectedItem(item);
                    openClaim({
                      title: item.title,
                      provider: item.source,
                      dist: item.dist,
                      price: item.price,
                      until: item.until,
                    });
                  },
                }}
              >
                <Popup>
                  <strong>{item.title}</strong>
                  <div>{item.source}</div>
                  <div>{item.price} · {item.dist}</div>
                </Popup>
              </Marker>
            ))}

            {selectedItem && location && (
              <>
                <CircleMarker
                  center={location}
                  pathOptions={{ color: '#0F6E56', fillColor: '#0F6E56', fillOpacity: 0.8 }}
                  radius={10}
                >
                  <Popup>You are here</Popup>
                </CircleMarker>
                <Polyline
                  positions={[location, selectedItem.position]}
                  pathOptions={{ color: '#FF6B35', weight: 3, opacity: 0.7 }}
                />
              </>
            )}
          </MapContainer>

          {locationError && (
            <div className="map-empty" style={{ marginTop: '12px' }}>
              {locationError}
            </div>
          )}
        </div>

        <div className="map-sidebar">
          <div className="map-sidebar-header">
            <div className="map-sidebar-title">Find nearby listings</div>
            <input
              type="text"
              placeholder="Search food or provider..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="map-search"
            />
            <div className="map-filters">
              <button
                className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : ''}`}
                onClick={() => setFilterType('all')}
              >
                All
              </button>
              <button
                className={`btn btn-sm ${filterType === 'free' ? 'btn-primary' : ''}`}
                onClick={() => setFilterType('free')}
              >
                Free
              </button>
              <button
                className={`btn btn-sm ${filterType === 'paid' ? 'btn-primary' : ''}`}
                onClick={() => setFilterType('paid')}
              >
                Paid
              </button>
            </div>
          </div>

          <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
            {filteredItems.length} listings nearby
          </div>

          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="map-item"
              onClick={() => {
                setSelectedItem(item);
                openClaim({ title: item.title, provider: item.source, dist: item.dist, price: item.price, until: item.until });
              }}
            >
              <div className="map-item-title">{item.title}</div>
              <div className="map-item-dist">{item.source} · {item.dist}</div>
              <div className="map-item-badge" style={{ color: item.price === 'Free' ? 'var(--teal)' : 'var(--amber)' }}>
                {item.price} · {item.until}
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="map-empty">
              No listings match your search
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MapPanel;
