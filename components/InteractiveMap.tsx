"use client";

import { mapService } from "@/lib/mapService";
import { googleMapsService } from "@/lib/googleMapsService";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

// Dynamic import for react-map-gl to avoid SSR issues
const Map = dynamic(() => import("react-map-gl/mapbox").then(m => m.default), { ssr: false });

export default function InteractiveMap() {
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeMap();
  }, []);

  useEffect(() => {
    // Initialize Google Maps service
    googleMapsService.initialize().catch(console.error);
  }, []);

  const initializeMap = async () => {
    // Get Mapbox token from environment
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      setError("Missing NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN");
      return;
    }
    setMapboxToken(token);
  };

  if (error) {
    return (
      <div className="aspect-video flex items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700">
        <div className="text-center">
          <p className="font-medium">Map Configuration Error</p>
          <p className="text-sm text-emerald-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!mapboxToken) {
    return (
      <div className="aspect-video flex items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
          <p className="text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden border border-emerald-200">
      <Map
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        initialViewState={{
          longitude: 20,
          latitude: 0,
          zoom: 4,
        }}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        logoPosition="bottom-right"
      />
      
      {/* Overlay with Africa focus indicator */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">Live Environmental Data</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
        <div className="text-xs text-gray-600">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Healthy Ecosystems</span>
          </div>
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Moderate Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>High Risk Areas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
