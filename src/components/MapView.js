import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const defaultCenter = [19.076, 72.8777];

function LocationUpdater({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView(location, map.getZoom());
    }
  }, [location, map]);

  return null;
}

function MapView({ openClaim }) {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("GPS is not supported by this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation([position.coords.latitude, position.coords.longitude]);
        setLocationError("");
      },
      () => {
        setLocationError("Please allow location access to show live GPS on the map.");
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const basePosition = location || defaultCenter;

  const foods = useMemo(
    () => [
      {
        id: 1,
        name: "Freshly baked sourdough",
        user: "Green Wheat Bakery",
        location: [basePosition[0] + 0.0025, basePosition[1] + 0.0023],
        price: "Free",
        dist: "0.3 km",
        until: "2 hrs",
      },
      {
        id: 2,
        name: "Catered event leftovers",
        user: "Spice Garden Caterers",
        location: [basePosition[0] - 0.0019, basePosition[1] + 0.0031],
        price: "₹80",
        dist: "0.7 km",
        until: "4 hrs",
      },
      {
        id: 3,
        name: "Community pantry share",
        user: "City Food Bank",
        location: [basePosition[0] + 0.0038, basePosition[1] - 0.0022],
        price: "Free",
        dist: "1.1 km",
        until: "Tomorrow",
      },
      {
        id: 4,
        name: "Organic vegetable box",
        user: "Farm Direct Hub",
        location: [basePosition[0] - 0.0032, basePosition[1] - 0.0017],
        price: "₹150",
        dist: "1.8 km",
        until: "6 hrs",
      },
      {
        id: 5,
        name: "Dairy surplus",
        user: "Morning Fresh Dairy",
        location: [basePosition[0] + 0.0042, basePosition[1] + 0.0011],
        price: "Free",
        dist: "2.4 km",
        until: "3 hrs",
      },
    ],
    [basePosition]
  );

  return (
    <div className="panel active">
      <div className="map-container">
        <div className="map-area">
          <MapContainer
            center={basePosition}
            zoom={14}
            scrollWheelZoom={true}
            style={{ width: "100%", minHeight: "460px", borderRadius: "14px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationUpdater location={location} />

            {foods.map((food) =>
              food.location ? (
                <Marker key={food.id} position={food.location}>
                  <Popup>
                    <h4>{food.name}</h4>
                    <p>{food.user}</p>
                    <button
                      onClick={() =>
                        openClaim({
                          title: food.name,
                          provider: food.user,
                          dist: food.dist,
                          price: food.price,
                          until: food.until,
                        })
                      }
                    >
                      Claim
                    </button>
                  </Popup>
                </Marker>
              ) : null
            )}

            {location && (
              <CircleMarker
                center={location}
                pathOptions={{ color: "#0F6E56", fillColor: "#0F6E56", fillOpacity: 0.8 }}
                radius={10}
              >
                <Popup>You are here</Popup>
              </CircleMarker>
            )}
          </MapContainer>

          {locationError && <div className="map-error">{locationError}</div>}
        </div>
      </div>
    </div>
  );
}

export default MapView;
