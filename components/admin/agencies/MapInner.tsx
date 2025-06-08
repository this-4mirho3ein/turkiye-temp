import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import L from "leaflet";

// Fix marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapInnerProps {
  center: [number, number];
  onCoordinatesChange: (coordinates: [number, number]) => void;
}

// Component to handle map clicks
function MapClickHandler({
  onCoordinatesChange,
}: {
  onCoordinatesChange: (coordinates: [number, number]) => void;
}) {
  const map = useMapEvents({
    click: (e) => {
      console.log("🗺️ Map clicked at:", e.latlng);
      const { lat, lng } = e.latlng;
      onCoordinatesChange([lng, lat]); // Note: GeoJSON format is [longitude, latitude]
    },
  });
  return null;
}

const MapInner: React.FC<MapInnerProps> = ({ center, onCoordinatesChange }) => {
  // Convert coordinates for Leaflet (lat, lng format)
  const leafletPosition: LatLngExpression = [center[1], center[0]];

  return (
    <MapContainer
      center={leafletPosition}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onCoordinatesChange={onCoordinatesChange} />

      <Marker position={leafletPosition} />
    </MapContainer>
  );
};

export default MapInner;
