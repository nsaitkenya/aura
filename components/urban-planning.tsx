"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  MapPin,
  Zap,
  Droplets,
  Car,
  TreePine,
  Users,
  TrendingUp,
  AlertTriangle,
  Satellite,
  Loader2,
  BarChart3,
  Calculator,
  Download,
  Eye
} from "lucide-react"
import { earthEngineAuth } from "@/lib/earthEngineAuth"
import { mapService } from "@/lib/mapService"
import { CountrySearch } from "@/components/CountrySearch"
import { africanCountries, getCountryEnvironmentalData } from "@/lib/countryData"

const urbanStats = [
  {
    title: "Urban Growth Rate",
    value: "4.2%",
    change: "+0.8%",
    trend: "up",
    icon: Building2,
    color: "text-blue-600",
    description: "annual expansion",
  },
  {
    title: "Green Space Coverage",
    value: "23%",
    change: "-2.1%",
    trend: "down",
    icon: TreePine,
    color: "text-green-600",
    description: "of urban area",
  },
  {
    title: "Population Density",
    value: "3,450",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-purple-600",
    description: "people per km²",
  },
  {
    title: "Infrastructure Score",
    value: "72/100",
    change: "+5",
    trend: "up",
    icon: Zap,
    color: "text-orange-600",
    description: "development index",
  },
]

const developmentProjects = [
  { name: "Lagos Smart City", progress: 68, budget: "$2.3B", completion: "2025", impact: "high" },
  { name: "Nairobi Green Corridor", progress: 45, budget: "$850M", completion: "2024", impact: "medium" },
  { name: "Cape Town Water Hub", progress: 82, budget: "$420M", completion: "2023", impact: "high" },
  { name: "Accra Transit Network", progress: 34, budget: "$1.1B", completion: "2026", impact: "medium" },
]

const landUseCategories = [
  { category: "Residential", percentage: 35, color: "bg-blue-500" },
  { category: "Commercial", percentage: 18, color: "bg-purple-500" },
  { category: "Industrial", percentage: 12, color: "bg-orange-500" },
  { category: "Green Space", percentage: 23, color: "bg-green-500" },
  { category: "Infrastructure", percentage: 12, color: "bg-gray-500" },
]

export function UrbanPlanning() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [mapProvider, setMapProvider] = useState<string>('google');
  const [isEEReady, setIsEEReady] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState('urban_growth');
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('lagos');
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [urbanFilters, setUrbanFilters] = useState<Record<string, boolean>>({
    urban_growth: true,
    heat_islands: false,
    air_quality: false,
    green_spaces: false,
    water_bodies: false
  });
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  useEffect(() => {
    initializeEarthEngine();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      initializeUrbanMap();
    }
  }, [selectedCity, isEEReady]);

  const initializeEarthEngine = async () => {
    try {
      setLoading(true);
      await earthEngineAuth.authenticate();
      setIsEEReady(true);
      setLoading(false);
    } catch (error) {
      console.error('Earth Engine authentication failed:', error);
      setLoading(false);
      // Still allow map to initialize without EE
      setIsEEReady(false);
    }
  };

  const initializeUrbanMap = async () => {
    if (!mapRef.current) return;

    try {
      setMapLoading(true);
      
      // Default to Lagos coordinates
      const cityCoordinates = {
        lagos: { lat: 6.5244, lng: 3.3792 },
        nairobi: { lat: -1.2921, lng: 36.8219 },
        cape_town: { lat: -33.9249, lng: 18.4241 },
        accra: { lat: 5.6037, lng: -0.1870 }
      };

      const coords = cityCoordinates[selectedCity as keyof typeof cityCoordinates] || cityCoordinates.lagos;

      const mapResult = await mapService.initializeMap(mapRef.current, {
        center: coords,
        zoom: 11,
        mapTypeId: 'satellite'
      });

      setMapInstance(mapResult.map);
      setMapProvider(mapResult.provider);
      setMapLoading(false);
      
      // Add air quality monitoring stations
      addAirQualityStations(mapResult.map, mapResult.provider);
      
      // Run analysis if Earth Engine is ready
      if (isEEReady) {
        runUrbanAnalysis(mapResult.map, activeAnalysis);
      }
    } catch (error) {
      console.error('Failed to initialize urban map:', error);
      setMapLoading(false);
    }
  };

  const runUrbanAnalysis = async (map: any, analysisType: string) => {
    if (!window.ee || !map) return;

    try {
      let analysis: any, visualization: any;

      switch (analysisType) {
        case 'urban_growth':
          // Urban area expansion analysis using built-up area
          const builtUp = window.ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
            .filterDate('2020-01-01', '2023-12-31')
            .filterBounds(map.getCenter())
            .median();
          
          const ndbi = builtUp.normalizedDifference(['B11', 'B8']).rename('NDBI');
          const urbanMask = ndbi.gt(0.1);
          
          analysis = urbanMask.updateMask(urbanMask);
          visualization = { palette: ['red'] };
          break;

        case 'land_surface_temp':
          // Land surface temperature analysis
          const lst = window.ee.ImageCollection('MODIS/006/MOD11A1')
            .filterDate('2023-01-01', '2023-12-31')
            .select('LST_Day_1km')
            .mean()
            .multiply(0.02)
            .subtract(273.15); // Convert to Celsius
          
          analysis = lst;
          visualization = {
            min: 20, max: 45,
            palette: ['blue', 'cyan', 'yellow', 'orange', 'red']
          };
          break;

        case 'green_space':
          // Green space and vegetation analysis
          const s2 = window.ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
            .filterDate('2023-01-01', '2023-12-31')
            .filterBounds(map.getCenter())
            .median();
          
          const ndvi = s2.normalizedDifference(['B8', 'B4']).rename('NDVI');
          const greenSpace = ndvi.gt(0.4);
          
          analysis = greenSpace.updateMask(greenSpace);
          visualization = { palette: ['green'] };
          break;

        case 'air_quality':
          // Air quality analysis using NO2 data
          const no2 = window.ee.ImageCollection('COPERNICUS/S5P/NRTI/L3_NO2')
            .filterDate('2023-01-01', '2023-12-31')
            .select('NO2_column_number_density')
            .mean();
          
          analysis = no2;
          visualization = {
            min: 0, max: 0.0002,
            palette: ['blue', 'purple', 'cyan', 'green', 'yellow', 'red']
          };
          break;

        case 'water_bodies':
          // Water bodies and flood risk analysis
          const water = window.ee.Image('JRC/GSW1_4/GlobalSurfaceWater')
            .select('occurrence');
          
          analysis = water.gt(50).updateMask(water.gt(50));
          visualization = { palette: ['blue'] };
          break;
      }

      mapService.addEarthEngineOverlay(map, mapProvider, analysis.getMap(visualization));

      // Calculate statistics for the analysis
      await calculateUrbanStatistics(analysis, analysisType);
      
      // Update air quality data
      updateAirQualityData(map, mapProvider);

    } catch (error) {
      console.error('Urban analysis error:', error);
    }
  };

  const calculateUrbanStatistics = async (analysis: any, analysisType: string) => {
    if (!window.ee || !mapInstance) return;

    try {
      let centerCoords;
      if (mapProvider === 'google') {
        const center = mapInstance.getCenter();
        centerCoords = [center.lng(), center.lat()];
      } else {
        const center = mapInstance.getCenter();
        centerCoords = [center.lng, center.lat];
      }
      
      const bounds = window.ee.Geometry.Point(centerCoords).buffer(10000);
      
      const stats = analysis.reduceRegion({
        reducer: window.ee.Reducer.mean(),
        geometry: bounds,
        scale: 100,
        maxPixels: 1e9
      });

      const result = await stats.getInfo();
      setAnalysisResults({
        type: analysisType,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Urban statistics calculation failed:', error);
    }
  };

  const airQualityStations = [
    { id: 1, name: "Central Business District", lat: 6.5244, lng: 3.3792, aqi: 156, status: "Unhealthy" },
    { id: 2, name: "Victoria Island", lat: 6.4281, lng: 3.4219, aqi: 142, status: "Unhealthy" },
    { id: 3, name: "Ikeja", lat: 6.5954, lng: 3.3364, aqi: 134, status: "Unhealthy" },
    { id: 4, name: "Surulere", lat: 6.5027, lng: 3.3641, aqi: 128, status: "Unhealthy" },
    { id: 5, name: "Yaba", lat: 6.5158, lng: 3.3696, aqi: 145, status: "Unhealthy" },
    { id: 6, name: "Apapa", lat: 6.4474, lng: 3.3594, aqi: 167, status: "Unhealthy" },
    { id: 7, name: "Lekki", lat: 6.4698, lng: 3.5852, aqi: 98, status: "Moderate" },
    { id: 8, name: "Ajah", lat: 6.4698, lng: 3.6043, aqi: 89, status: "Moderate" },
    { id: 9, name: "Ikoyi", lat: 6.4541, lng: 3.4316, aqi: 112, status: "Unhealthy for Sensitive" },
    { id: 10, name: "Maryland", lat: 6.5568, lng: 3.3517, aqi: 139, status: "Unhealthy" },
    { id: 11, name: "Gbagada", lat: 6.5447, lng: 3.3775, aqi: 125, status: "Unhealthy" },
    { id: 12, name: "Festac", lat: 6.4641, lng: 3.2847, aqi: 152, status: "Unhealthy" },
    { id: 13, name: "Mushin", lat: 6.5244, lng: 3.3448, aqi: 158, status: "Unhealthy" },
    { id: 14, name: "Oshodi", lat: 6.5492, lng: 3.3206, aqi: 163, status: "Unhealthy" },
    { id: 15, name: "Alaba", lat: 6.4641, lng: 3.1847, aqi: 171, status: "Unhealthy" },
    { id: 16, name: "Badagry", lat: 6.4319, lng: 2.8876, aqi: 95, status: "Moderate" },
    { id: 17, name: "Epe", lat: 6.5833, lng: 3.9833, aqi: 78, status: "Moderate" },
    { id: 18, name: "Ikorodu", lat: 6.6194, lng: 3.5106, aqi: 102, status: "Unhealthy for Sensitive" },
    { id: 19, name: "Agege", lat: 6.6152, lng: 3.3278, aqi: 147, status: "Unhealthy" },
    { id: 20, name: "Ifako-Ijaiye", lat: 6.6667, lng: 3.2667, aqi: 141, status: "Unhealthy" },
    { id: 21, name: "Kosofe", lat: 6.4667, lng: 3.3833, aqi: 133, status: "Unhealthy" },
    { id: 22, name: "Shomolu", lat: 6.5333, lng: 3.3833, aqi: 137, status: "Unhealthy" },
    { id: 23, name: "Eti-Osa", lat: 6.4167, lng: 3.6000, aqi: 92, status: "Moderate" },
    { id: 24, name: "Lagos Mainland", lat: 6.5000, lng: 3.3667, aqi: 149, status: "Unhealthy" }
  ];

  const addAirQualityStations = (map, provider) => {
    airQualityStations.forEach(station => {
      const getAQIColor = (aqi) => {
        if (aqi <= 50) return '#00e400';
        if (aqi <= 100) return '#ffff00';
        if (aqi <= 150) return '#ff7e00';
        if (aqi <= 200) return '#ff0000';
        if (aqi <= 300) return '#8f3f97';
        return '#7e0023';
      };

      if (provider === 'google') {
        const marker = new window.google.maps.Marker({
          position: { lat: station.lat, lng: station.lng },
          map: map,
          title: `${station.name}: AQI ${station.aqi}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: getAQIColor(station.aqi),
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h4 style="margin: 0 0 8px 0;">${station.name}</h4>
              <p style="margin: 4px 0;"><strong>AQI:</strong> ${station.aqi}</p>
              <p style="margin: 4px 0;"><strong>Status:</strong> ${station.status}</p>
              <p style="margin: 4px 0; font-size: 12px; color: #666;">Real-time air quality monitoring</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      } else if (provider === 'mapbox') {
        const popup = new window.mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div style="padding: 8px;">
              <h4 style="margin: 0 0 8px 0;">${station.name}</h4>
              <p style="margin: 4px 0;"><strong>AQI:</strong> ${station.aqi}</p>
              <p style="margin: 4px 0;"><strong>Status:</strong> ${station.status}</p>
              <p style="margin: 4px 0; font-size: 12px; color: #666;">Real-time air quality monitoring</p>
            </div>
          `);

        const marker = new window.mapboxgl.Marker({
          color: getAQIColor(station.aqi)
        })
          .setLngLat([station.lng, station.lat])
          .setPopup(popup)
          .addTo(map);
      }
    });
  };

  const updateAirQualityData = (map, provider) => {
    // Simulate real-time updates
    const avgAQI = airQualityStations.reduce((sum, station) => sum + station.aqi, 0) / airQualityStations.length;
    const unhealthyStations = airQualityStations.filter(s => s.aqi > 100).length;
    
    setAnalysisResults(prev => ({
      ...prev,
      airQuality: {
        averageAQI: Math.round(avgAQI),
        unhealthyStations,
        totalStations: airQualityStations.length,
        status: avgAQI > 150 ? 'Unhealthy' : avgAQI > 100 ? 'Moderate' : 'Good'
      }
    }));
  };

  const analysisOptions = [
    { key: 'urban_growth', label: 'Urban Growth', description: 'Built-up area expansion' },
    { key: 'land_surface_temp', label: 'Heat Islands', description: 'Surface temperature mapping' },
    { key: 'green_space', label: 'Green Space', description: 'Vegetation coverage analysis' },
    { key: 'air_quality', label: 'Air Quality', description: 'Pollution monitoring' },
    { key: 'water_bodies', label: 'Water Resources', description: 'Water bodies and flood risk' }
  ];

  const cityOptions = [
    { value: 'lagos', label: 'Lagos, Nigeria' },
    { value: 'nairobi', label: 'Nairobi, Kenya' },
    { value: 'cape_town', label: 'Cape Town, South Africa' },
    { value: 'accra', label: 'Accra, Ghana' }
  ];

  const handleCountrySelect = (country: any) => {
    setSelectedCountry(country);
    // Update selected city based on country
    const cityMap: Record<string, string> = {
      'NG': 'lagos',
      'KE': 'nairobi',
      'ZA': 'cape_town',
      'GH': 'accra'
    };
    const newCity = cityMap[country.code] || 'lagos';
    setSelectedCity(newCity);
  };

  const toggleUrbanFilter = (filter: string) => {
    setUrbanFilters(prev => {
      const newFilters = {
        urban_growth: false,
        heat_islands: false,
        air_quality: false,
        green_spaces: false,
        water_bodies: false
      };
      newFilters[filter as keyof typeof newFilters] = !prev[filter as keyof typeof prev];
      return newFilters;
    });
    
    // Update active analysis based on filter
    const filterToAnalysis: Record<string, string> = {
      urban_growth: 'urban_growth',
      heat_islands: 'heat_islands',
      air_quality: 'air_quality',
      green_spaces: 'green_spaces',
      water_bodies: 'water_bodies'
    };
    
    const newAnalysis = filterToAnalysis[filter] || 'urban_growth';
    setActiveAnalysis(newAnalysis);
    
    if (mapInstance && isEEReady && window.ee) {
      runUrbanAnalysis(mapInstance, newAnalysis);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Urban Planning & Development</h1>
          <p className="text-muted-foreground mt-1">Satellite-based urban analysis, smart city planning, and sustainable development</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-blue-100 text-blue-700">
            {isEEReady ? "Satellite Active" : "Initializing..."}
          </Badge>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Urban Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* urbanStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-muted-foreground ml-2">vs last year</span>
              </div>
            </CardContent>
          </Card>
        )) */}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analysis">Satellite Analysis</TabsTrigger>
          <TabsTrigger value="projects">Development Projects</TabsTrigger>
          <TabsTrigger value="landuse">Land Use Planning</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Analysis Controls */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Satellite className="w-5 h-5 mr-2" />
                  Urban Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="city-select">Select City</Label>
                  <Select value={selectedCity} onValueChange={(value) => {
                    setSelectedCity(value);
                    if (mapInstance) {
                      initializeUrbanMap();
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cityOptions.map((city) => (
                        <SelectItem key={city.value} value={city.value}>
                          {city.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Analysis Type</Label>
                  {analysisOptions.map((option) => (
                    <Button
                      key={option.key}
                      variant={activeAnalysis === option.key ? "default" : "outline"}
                      className="w-full text-left justify-start"
                      onClick={() => {
                        setActiveAnalysis(option.key);
                        if (mapInstance) {
                          runUrbanAnalysis(mapInstance, option.key);
                        }
                      }}
                    >
                      <div className="text-left">
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Satellite Urban Map */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Satellite className="w-5 h-5 mr-2" />
                  Urban Satellite Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mapLoading ? (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Initializing map...</p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg overflow-hidden border relative">
                    <div ref={mapRef} className="w-full h-full" style={{ minHeight: '400px' }} />
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs">
                      Provider: {mapProvider === 'google' ? 'Google Maps' : 'Mapbox'}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResults?.airQuality && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
                      <h4 className="font-semibold text-gray-800 mb-3">Air Quality Overview</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{analysisResults.airQuality.averageAQI}</div>
                          <div className="text-xs text-gray-600">Average AQI</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{analysisResults.airQuality.unhealthyStations}</div>
                          <div className="text-xs text-gray-600">Unhealthy Stations</div>
                        </div>
                      </div>
                      <div className="mt-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          analysisResults.airQuality.status === 'Good' ? 'bg-green-100 text-green-800' :
                          analysisResults.airQuality.status === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {analysisResults.airQuality.status}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 text-center">
                        {analysisResults.airQuality.totalStations} monitoring stations active
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">2.3M</div>
                      <div className="text-sm text-blue-600">Population</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">15.2%</div>
                      <div className="text-sm text-green-600">Green Coverage</div>
                    </div>
                  </div>
                  
                  {analysisResults && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Updated: {new Date(analysisResults.timestamp).toLocaleTimeString()}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Coverage Area</span>
                          <span className="text-sm font-medium">2,450 km²</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Analysis Points</span>
                          <span className="text-sm font-medium">15,230</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Confidence</span>
                          <span className="text-sm font-medium">94%</span>
                        </div>
                      </div>
                      <Button size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Active Development Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {developmentProjects.map((project, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{project.name}</h4>
                      <Badge variant={project.impact === "high" ? "default" : "secondary"}>
                        {project.impact} impact
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Budget: {project.budget}</span>
                        <span>Est. completion: {project.completion}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Project Planning Tool */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Project Impact Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="project-area">Project Area (km²)</Label>
                    <Input id="project-area" type="number" placeholder="Enter area" />
                  </div>
                  <div>
                    <Label htmlFor="project-type">Project Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential Development</SelectItem>
                        <SelectItem value="commercial">Commercial Complex</SelectItem>
                        <SelectItem value="industrial">Industrial Zone</SelectItem>
                        <SelectItem value="green">Green Infrastructure</SelectItem>
                        <SelectItem value="transport">Transportation Hub</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="population">Expected Population Impact</Label>
                    <Input id="population" type="number" placeholder="Number of people" />
                  </div>
                  <Button className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Impact
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Impact Assessment</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Environmental Impact:</span>
                      <span className="font-medium">Medium</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Economic Benefit:</span>
                      <span className="font-medium">High</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Social Impact:</span>
                      <span className="font-medium">Positive</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="landuse" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Land Use Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Current Land Use Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {landUseCategories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{category.category}</span>
                        <span className="text-sm">{category.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${category.color}`}
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Zoning Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Zoning Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="border-l-4 border-l-green-500 pl-4 py-2">
                    <h4 className="font-medium text-green-700">Increase Green Space</h4>
                    <p className="text-sm text-muted-foreground">Target: 30% coverage by 2025</p>
                  </div>
                  <div className="border-l-4 border-l-blue-500 pl-4 py-2">
                    <h4 className="font-medium text-blue-700">Mixed-Use Development</h4>
                    <p className="text-sm text-muted-foreground">Promote walkable neighborhoods</p>
                  </div>
                  <div className="border-l-4 border-l-orange-500 pl-4 py-2">
                    <h4 className="font-medium text-orange-700">Transit-Oriented Development</h4>
                    <p className="text-sm text-muted-foreground">Focus around transport hubs</p>
                  </div>
                  <div className="border-l-4 border-l-purple-500 pl-4 py-2">
                    <h4 className="font-medium text-purple-700">Smart Industrial Zones</h4>
                    <p className="text-sm text-muted-foreground">Integrate technology and sustainability</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Infrastructure Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Power Infrastructure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Grid Coverage</span>
                    <span className="text-sm font-medium">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Renewable Energy</span>
                    <span className="text-sm font-medium">34%</span>
                  </div>
                  <Progress value={34} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Reliability Score</span>
                    <span className="text-sm font-medium">72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Droplets className="w-5 h-5 mr-2" />
                  Water Infrastructure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Water Access</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Treatment Capacity</span>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Distribution Network</span>
                    <span className="text-sm font-medium">82%</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="w-5 h-5 mr-2" />
                  Transport Infrastructure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Road Network</span>
                    <span className="text-sm font-medium">91%</span>
                  </div>
                  <Progress value={91} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Public Transit</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Digital Connectivity</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
