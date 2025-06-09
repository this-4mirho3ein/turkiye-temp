"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Dynamically import the entire map to avoid SSR issues
const DynamicMapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">در حال بارگذاری نقشه...</div>
    </div>
  ),
});

interface MapComponentProps {
  onCoordinatesChange: (coordinates: [number, number]) => void;
  initialCoordinates?: [number, number];
}

const MapComponent: React.FC<MapComponentProps> = ({
  onCoordinatesChange,
  initialCoordinates = [51.389, 35.6892], // Default to Tehran coordinates
}) => {
  const [mounted, setMounted] = useState(false);

  // Memoize initial coordinates to prevent unnecessary re-renders
  const memoizedInitialCoordinates = useMemo(() => {
    return initialCoordinates;
  }, [initialCoordinates[0], initialCoordinates[1]]);

  const [coordinates, setCoordinates] = useState<[number, number]>(
    memoizedInitialCoordinates
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only update coordinates if they actually changed
  useEffect(() => {
    const [newLng, newLat] = memoizedInitialCoordinates;
    const [currentLng, currentLat] = coordinates;

    if (newLng !== currentLng || newLat !== currentLat) {
      setCoordinates(memoizedInitialCoordinates);
    }
  }, [memoizedInitialCoordinates, coordinates]);

  const handleCoordinatesChange = useCallback(
    (newCoordinates: [number, number]) => {
      console.log("🗺️ Coordinates changed to:", newCoordinates);
      setCoordinates(newCoordinates);
      onCoordinatesChange(newCoordinates);
    },
    [onCoordinatesChange]
  );

  // Don't render on server side
  if (!mounted) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">در حال بارگذاری نقشه...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border">
      <DynamicMapInner
        center={coordinates}
        onCoordinatesChange={handleCoordinatesChange}
      />

      <div className="mt-2 text-sm text-gray-600 text-center">
        مختصات انتخاب شده: {coordinates[1].toFixed(6)},{" "}
        {coordinates[0].toFixed(6)}
        <br />
        <span className="text-xs text-gray-500">
          برای تغییر موقعیت، روی نقشه کلیک کنید
        </span>
      </div>
    </div>
  );
};

export default MapComponent;
