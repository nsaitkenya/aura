"use client";

import { mapService } from "@/lib/mapService";
import { googleMapsService } from "@/lib/googleMapsService";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef, useMemo } from "react";
import { Source, Layer } from "react-map-gl";
import type { MapRef, ViewState } from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";

// Dynamic import for react-map-gl to avoid SSR issues
const Map = dynamic(() => import("react-map-gl").then(m => m.Map), { ssr: false });

interface InteractiveMapProps {
  activeLayers?: string[];
  viewState?: Partial<ViewState>;
  onViewStateChange?: (viewState: ViewState) => void;
}

export default function InteractiveMap({ 
  activeLayers = [],
  viewState: externalViewState,
  onViewStateChange
}: InteractiveMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [internalViewState, setInternalViewState] = useState<Partial<ViewState>>({
    longitude: 20,
    latitude: 0,
    zoom: 2.8,
  });

  const viewState = externalViewState || internalViewState;

  const isLayerActive = (layerName: string) => 
    activeLayers.some(activeLayer => activeLayer.toLowerCase().includes(layerName.toLowerCase()));

  useEffect(() => {
    if (externalViewState?.latitude && externalViewState?.longitude) {
      mapRef.current?.flyTo({
        center: [externalViewState.longitude, externalViewState.latitude],
        zoom: externalViewState.zoom || 5,
        duration: 2000,
        essential: true
      });
    }
  }, [externalViewState?.latitude, externalViewState?.longitude, externalViewState?.zoom]);

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
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <Map
        ref={mapRef}
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        {...viewState}
        onMove={evt => {
          const newViewState = evt.viewState;
          setInternalViewState(newViewState);
          if (onViewStateChange) {
            onViewStateChange(newViewState);
          }
        }}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        logoPosition="bottom-right"
        maxBounds={[[-20, -40], [60, 40]]}
      >
        {/* Country boundaries layer */}
        <Source 
          id="countries" 
          type="vector" 
          url="mapbox://mapbox.country-boundaries-v1"
        >
          <Layer
            id="country-boundaries"
            type="line"
            source-layer="country_boundaries"
            paint={{
              'line-color': '#ffffff',
              'line-width': 2,
              'line-opacity': 0.8
            }}
            filter={['in', 'iso_3166_1_alpha_3', 'DZA', 'AGO', 'BEN', 'BWA', 'BFA', 'BDI', 'CMR', 'CPV', 'CAF', 'TCD', 'COM', 'COG', 'COD', 'CIV', 'DJI', 'EGY', 'GNQ', 'ERI', 'ETH', 'GAB', 'GMB', 'GHA', 'GIN', 'GNB', 'KEN', 'LSO', 'LBR', 'LBY', 'MDG', 'MWI', 'MLI', 'MRT', 'MUS', 'MAR', 'MOZ', 'NAM', 'NER', 'NGA', 'RWA', 'STP', 'SEN', 'SYC', 'SLE', 'SOM', 'ZAF', 'SSD', 'SDN', 'SWZ', 'TZA', 'TGO', 'TUN', 'UGA', 'ZMB', 'ZWE']}
          />
        </Source>

        <Source id="rainfall-data" type="raster" tiles={[`https://api.mapbox.com/v4/mapbox.weather-v1/1/rain/{z}/{x}/{y}.png?access_token=${mapboxToken}`]} tileSize={256}>
          <Layer id="rainfall-layer" type="raster" paint={{ 'raster-opacity': 0.6 }} layout={{ 'visibility': isLayerActive('Rainfall') ? 'visible' : 'none' }} />
        </Source>
        <Source id="temperature-data" type="raster" tiles={[`https://api.mapbox.com/v4/mapbox.weather-v1/1/temperature/{z}/{x}/{y}.png?access_token=${mapboxToken}`]} tileSize={256}>
          <Layer id="temperature-layer" type="raster" paint={{ 'raster-opacity': 0.6 }} layout={{ 'visibility': isLayerActive('Temperature') ? 'visible' : 'none' }} />
        </Source>
        <Source id="vegetation-data" type="raster" url="mapbox://mapbox.satellite-v9">
          <Layer id="vegetation-layer" type="raster" paint={{ 'raster-opacity': 0.5, 'raster-saturation': 0.3 }} layout={{ 'visibility': isLayerActive('Vegetation') ? 'visible' : 'none' }} />
        </Source>
        <Source id="water-data" type="raster" tiles={[`https://api.mapbox.com/v4/mapbox.water-v1/{z}/{x}/{y}.png?access_token=${mapboxToken}`]} tileSize={256}>
          <Layer id="water-layer" type="raster" paint={{ 'raster-opacity': 0.6 }} layout={{ 'visibility': isLayerActive('Water') ? 'visible' : 'none' }} />
        </Source>
        <Source id="soil-data" type="raster" tiles={[`https://api.mapbox.com/v4/mapbox.terrain-v2/{z}/{x}/{y}.png?access_token=${mapboxToken}`]} tileSize={256}>
          <Layer id="soil-layer" type="raster" paint={{ 'raster-opacity': 0.5 }} layout={{ 'visibility': isLayerActive('Soil') ? 'visible' : 'none' }} />
        </Source>
        <Source id="air-data" type="raster" tiles={[`https://api.mapbox.com/v4/mapbox.air-quality-v1/{z}/{x}/{y}.png?access_token=${mapboxToken}`]} tileSize={256}>
          <Layer id="air-layer" type="raster" paint={{ 'raster-opacity': 0.6 }} layout={{ 'visibility': isLayerActive('Air') ? 'visible' : 'none' }} />
        </Source>
      </Map>
      
      {/* Overlay with Africa focus indicator */}
      {/* <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">Live Environmental Data</span>
        </div>
      </div> */}
      
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
