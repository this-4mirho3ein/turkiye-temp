"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
  onLocationSelect: (coordinates: [number, number]) => void;
  coordinates: [number, number];
}

interface MarkerPositionProps {
  coordinates: [number, number];
  onLocationSelect: (coordinates: [number, number]) => void;
}

const MarkerPosition: React.FC<MarkerPositionProps> = ({
  coordinates,
  onLocationSelect,
}) => {
  const [position, setPosition] = useState<[number, number]>(coordinates);

  // Update marker position when coordinates prop changes
  useEffect(() => {
    setPosition(coordinates);
  }, [coordinates]);

  // Handle map click events
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const newPosition: [number, number] = [lat, lng];
      setPosition(newPosition);
      onLocationSelect(newPosition);
    },
  });

  // Center map on marker position
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position ? <Marker position={position} /> : null;
};

const MapSelector: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  coordinates,
}) => {
  // Fix for Leaflet default icon not showing
  useEffect(() => {
    // Fix for Leaflet's default icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  // Default center of Turkey if no coordinates provided
  const defaultCenter: [number, number] = coordinates || [39.925533, 32.866287]; // Ankara
  const defaultZoom = 14;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerPosition
        coordinates={coordinates}
        onLocationSelect={onLocationSelect}
      />
    </MapContainer>
  );
};

export default MapSelector;
