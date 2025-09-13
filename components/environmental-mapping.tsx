"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Satellite, 
  Loader2, 
  TreePine, 
  Droplets, 
  Wind, 
  MapPin, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Download,
  Share,
  Layers,
  Map,
  Leaf,
  Search,
  CloudRain,
  Thermometer,
  BarChart3
} from "lucide-react"
import { earthEngineAuth } from "@/lib/earthEngineAuth"
import { mapService } from "@/lib/mapService"
import { googleMapsService } from "@/lib/googleMapsService"
import { CountrySearch } from "@/components/CountrySearch"
import { africanCountries, getCountryEnvironmentalData } from "@/lib/countryData"

interface AnalysisResult {
  type: string;
  data: any;
  timestamp: string;
}

interface RegionStats {
  forestCover: number;
  waterQuality: number;
  airQuality: number;
  landUseChange: number;
}

export function EnvironmentalMapping() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [mapProvider, setMapProvider] = useState<string>('google');
  const [isEEReady, setIsEEReady] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState('deforestation');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [regionalStats, setRegionalStats] = useState<Record<string, any>>({
    deforestation: { value: '2.3%', trend: 'increasing', color: 'text-red-600' },
    water_quality: { value: '78%', trend: 'stable', color: 'text-blue-600' },
    air_quality: { value: 'Moderate', trend: 'improving', color: 'text-yellow-600' },
    land_use: { value: '45% Agricultural', trend: 'stable', color: 'text-green-600' },
    vegetation: { value: '0.65 NDVI', trend: 'seasonal', color: 'text-green-600' },
    rainfall: { value: '850mm/year', trend: 'decreasing', color: 'text-blue-600' },
    temperature: { value: '28.5°C avg', trend: 'increasing', color: 'text-orange-600' }
  });
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [dataFilters, setDataFilters] = useState<Record<string, boolean>>({
    deforestation: true,
    waterQuality: false,
    airQuality: false,
    landUse: false,
    vegetation: false
  });
  const [currentOverlay, setCurrentOverlay] = useState<any>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  useEffect(() => {
    initializeEarthEngine();
    // Initialize Google Maps service
    googleMapsService.initialize().catch(console.error);
  }, []);

  useEffect(() => {
    // Initialize map regardless of Earth Engine status
    initializeEnvironmentalMap();
  }, [isEEReady, selectedCountry]);

  const handleCountrySelect = async (country: any) => {
    setSelectedCountry(country);
    try {
      const envData = await getCountryEnvironmentalData(country.code);
      if (envData) {
        setRegionalStats({
          forestCover: envData.forestCover,
          waterQuality: envData.waterQuality,
          airQuality: envData.airQuality,
          landUseChange: Math.round(Math.random() * 20) // Will be replaced with real data
        });
      }
    } catch (error) {
      console.error('Error getting country environmental data:', error);
    }
  };

  const toggleDataFilter = (filter: string) => {
    setDataFilters(prev => {
      const newFilters = { ...prev };
      // Turn off all other filters
      Object.keys(newFilters).forEach(key => {
        newFilters[key] = key === filter ? !prev[filter] : false;
      });
      return newFilters;
    });
    
    // Update active analysis based on filter
    const filterToAnalysis: Record<string, string> = {
      deforestation: 'deforestation',
      waterQuality: 'water_quality',
      airQuality: 'air_quality',
      landUse: 'land_use',
      vegetation: 'vegetation'
    };
    
    const newAnalysis = filterToAnalysis[filter] || 'deforestation';
    setActiveAnalysis(newAnalysis);
    
    if (mapInstance && isEEReady && window.ee) {
      runEnvironmentalAnalysis(mapInstance, newAnalysis);
    }
  };

  const initializeEarthEngine = async () => {
    try {
      setLoading(true);
      await earthEngineAuth.authenticate();
      setIsEEReady(true);
      setLoading(false);
    } catch (error) {
      console.error('Earth Engine authentication failed:', error);
      setLoading(false);
      setIsEEReady(false);
    }
  };

  const initializeEnvironmentalMap = async () => {
    if (!mapRef.current) return;

    try {
      console.log('Initializing environmental map...');
      const center = selectedCountry ? selectedCountry.coordinates : { lat: 0, lng: 20 };
      const zoom = selectedCountry ? 6 : 4;
      
      const mapResult = await mapService.initializeMap(mapRef.current, {
        center,
        zoom,
        mapTypeId: 'satellite',
        styles: [
          {
            featureType: 'all',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      });

      console.log('Environmental map initialized:', mapResult);
      setMapInstance(mapResult.map);
      setMapProvider(mapResult.provider);
      
      // Load real environmental data
      await loadRealEnvironmentalData(mapResult.map, center);
      
      // Run analysis if Earth Engine is ready
      if (isEEReady && window.ee) {
        runEnvironmentalAnalysis(mapResult.map, activeAnalysis);
      }
    } catch (error) {
      console.error('Failed to initialize environmental map:', error);
    }
  };

  const loadRealEnvironmentalData = async (map: any, location: any) => {
    try {
      const environmentalData = await googleMapsService.getEnvironmentalData(location);
      
      // Add environmental markers
      if (environmentalData.nearbyFeatures) {
        environmentalData.nearbyFeatures.forEach((feature: any) => {
          if (feature.geometry?.location) {
            const marker = new (window as any).google.maps.Marker({
              position: feature.geometry.location,
              map: map,
              title: feature.name,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="8" fill="#10b981" stroke="white" stroke-width="2"/>
                  </svg>
                `),
                scaledSize: new (window as any).google.maps.Size(20, 20)
              }
            });
            
            const infoWindow = new (window as any).google.maps.InfoWindow({
              content: `
                <div style="padding: 10px;">
                  <h3 style="margin: 0 0 5px 0; font-size: 14px;">${feature.name}</h3>
                  <p style="margin: 0; font-size: 12px; color: #666;">${feature.vicinity || 'Environmental feature'}</p>
                  <p style="margin: 5px 0 0 0; font-size: 11px; color: #888;">Type: ${feature.types?.[0] || 'Environmental'}</p>
                </div>
              `
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
          }
        });
      }
      
      // Update region stats with real data
      if (environmentalData.airQuality) {
        setRegionalStats(prev => ({
          ...prev,
          airQuality: environmentalData.airQuality.aqi || prev.airQuality
        }));
      }
    } catch (error) {
      console.error('Error loading real environmental data:', error);
    }
  };

  const runEnvironmentalAnalysis = async (map: any, analysisType: string) => {
    if (!isEEReady || !map) return;

    try {
      setAnalysisLoading(true);
      const bounds = map.getBounds();
      
      const boundsObj = {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      };

      // Get Earth Engine analysis
      const analysis = await earthEngineAuth.getEnvironmentalData(boundsObj, analysisType);
      
      if (analysis && analysis.mapid) {
        // Remove existing overlay
        if (currentOverlay) {
          map.overlayMapTypes.removeAt(0);
        }

        // Add new overlay
        const imageMapType = new (window as any).google.maps.ImageMapType({
          getTileUrl: (coord: any, zoom: number) => {
            return `https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/${analysis.mapid}/tiles/${zoom}/${coord.x}/${coord.y}?token=${analysis.token}`;
          },
          tileSize: new (window as any).google.maps.Size(256, 256),
          name: analysisType,
          opacity: 0.7
        });

        map.overlayMapTypes.insertAt(0, imageMapType);
        setCurrentOverlay(imageMapType);
        
        // Update regional statistics based on analysis type
        updateRegionalStats(analysisType, boundsObj);
      }
    } catch (error) {
      console.error('Environmental analysis failed:', error);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const updateRegionalStats = (analysisType: string, bounds: any) => {
    // Simulate updated statistics based on analysis type
    const mockStats = {
      deforestation: { value: '2.3%', trend: 'increasing', color: 'text-red-600' },
      water_quality: { value: '78%', trend: 'stable', color: 'text-blue-600' },
      air_quality: { value: 'Moderate', trend: 'improving', color: 'text-yellow-600' },
      land_use: { value: '45% Agricultural', trend: 'stable', color: 'text-green-600' },
      vegetation: { value: '0.65 NDVI', trend: 'seasonal', color: 'text-green-600' },
      rainfall: { value: '850mm/year', trend: 'decreasing', color: 'text-blue-600' },
      temperature: { value: '28.5°C avg', trend: 'increasing', color: 'text-orange-600' }
    };

    const stat = mockStats[analysisType as keyof typeof mockStats];
    if (stat) {
      setRegionalStats(prev => ({
        ...prev,
        [analysisType]: stat
      }));
    }
  };

  const exportAnalysis = () => {
    if (!analysisResults) return;
    
    const exportData = {
      analysis: analysisResults,
      regionalStats,
      timestamp: new Date().toISOString(),
      location: 'Kenya'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `environmental-analysis-${analysisResults.type}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const analysisOptions = [
    { 
      key: 'deforestation', 
      label: 'Deforestation Analysis', 
      description: 'Forest loss detection using Hansen dataset',
      icon: TreePine,
      color: 'text-red-600'
    },
    { 
      key: 'water_quality', 
      label: 'Water Quality', 
      description: 'Surface water temperature monitoring',
      icon: Droplets,
      color: 'text-blue-600'
    },
    { 
      key: 'air_quality', 
      label: 'Air Quality', 
      description: 'Aerosol and pollution tracking',
      icon: Wind,
      color: 'text-purple-600'
    },
    { 
      key: 'land_use', 
      label: 'Land Use Change', 
      description: 'Land cover classification and changes',
      icon: Map,
      color: 'text-green-600'
    },
    { 
      key: 'vegetation', 
      label: 'Vegetation Trends', 
      description: 'NDVI vegetation health analysis',
      icon: Leaf,
      color: 'text-emerald-600'
    },
    { 
      key: 'rainfall', 
      label: 'Rainfall Patterns', 
      description: 'Precipitation monitoring and analysis',
      icon: CloudRain,
      color: 'text-blue-600'
    },
    { 
      key: 'temperature', 
      label: 'Temperature Trends', 
      description: 'Temperature monitoring and analysis',
      icon: Thermometer,
      color: 'text-orange-600'
    }
  ];

  const getStatTrend = (value: number, threshold: number = 70) => {
    return value >= threshold ? 'up' : 'down';
  };

  const getStatColor = (value: number, threshold: number = 70) => {
    return value >= threshold ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Environmental Mapping & Analysis</h1>
          <p className="text-muted-foreground mt-1">Advanced satellite-based environmental monitoring for Africa</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-blue-100 text-blue-700">
            {isEEReady ? "Earth Engine Active" : "Loading..."}
          </Badge>
          {analysisResults && (
            <>
              <Button variant="outline" size="sm" onClick={exportAnalysis}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Environmental Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forest Cover</CardTitle>
            <TreePine className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regionalStats.deforestation.value}</div>
            <div className="flex items-center text-xs">
              {regionalStats.deforestation.trend === 'increasing' ? (
                <TrendingUp className={`w-3 h-3 mr-1 ${regionalStats.deforestation.color}`} />
              ) : (
                <TrendingDown className={`w-3 h-3 mr-1 ${regionalStats.deforestation.color}`} />
              )}
              <span className={regionalStats.deforestation.color}>
                {regionalStats.deforestation.trend}
              </span>
            </div>
            <Progress value={parseFloat(regionalStats.deforestation.value.replace('%', ''))} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Quality</CardTitle>
            <Droplets className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regionalStats.water_quality.value}</div>
            <div className="flex items-center text-xs">
              {regionalStats.water_quality.trend === 'increasing' ? (
                <TrendingUp className={`w-3 h-3 mr-1 ${regionalStats.water_quality.color}`} />
              ) : (
                <TrendingDown className={`w-3 h-3 mr-1 ${regionalStats.water_quality.color}`} />
              )}
              <span className={regionalStats.water_quality.color}>
                {regionalStats.water_quality.trend}
              </span>
            </div>
            <Progress value={parseFloat(regionalStats.water_quality.value.replace('%', ''))} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Air Quality</CardTitle>
            <Wind className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regionalStats.air_quality.value}</div>
            <div className="flex items-center text-xs">
              {regionalStats.air_quality.trend === 'increasing' ? (
                <TrendingUp className={`w-3 h-3 mr-1 ${regionalStats.air_quality.color}`} />
              ) : (
                <TrendingDown className={`w-3 h-3 mr-1 ${regionalStats.air_quality.color}`} />
              )}
              <span className={regionalStats.air_quality.color}>
                {regionalStats.air_quality.trend}
              </span>
            </div>
            <Progress value={parseFloat(regionalStats.air_quality.value.replace('%', ''))} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Land Use Change</CardTitle>
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regionalStats.land_use.value}</div>
            <div className="flex items-center text-xs">
              <TrendingUp className="w-3 h-3 mr-1 text-orange-600" />
              <span className="text-orange-600">Annual Change</span>
            </div>
            <Progress value={parseFloat(regionalStats.land_use.value.replace('%', ''))} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Control Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TreePine className="w-5 h-5 mr-2" />
              Analysis Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Country Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Location</label>
              <CountrySearch 
                onCountrySelect={handleCountrySelect}
                placeholder="Search African countries..."
                showDetails={false}
              />
            </div>

            {/* Data Layer Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Layers</label>
              <div className="space-y-2">
                {[
                  { id: 'deforestation', label: 'Forest Loss', icon: TreePine },
                  { id: 'water_quality', label: 'Water Quality', icon: Droplets },
                  { id: 'air_quality', label: 'Air Quality', icon: Wind },
                  { id: 'land_use', label: 'Land Use', icon: Map },
                  { id: 'vegetation', label: 'Vegetation', icon: Leaf },
                  { id: 'rainfall', label: 'Rainfall', icon: CloudRain },
                  { id: 'temperature', label: 'Temperature', icon: Thermometer }
                ].map((filter) => (
                  <div key={filter.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={filter.id}
                      checked={dataFilters[filter.id]}
                      onChange={() => toggleDataFilter(filter.id)}
                      className="rounded border-gray-300"
                    />
                    <label
                      htmlFor={filter.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
                    >
                      <filter.icon className="h-4 w-4" />
                      <span>{filter.label}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Analysis Type</label>
              <div className="grid grid-cols-1 gap-2">
                {analysisOptions.map((option) => (
                  <Button
                    key={option.key}
                    variant={activeAnalysis === option.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setActiveAnalysis(option.key);
                      if (mapInstance && isEEReady) {
                        runEnvironmentalAnalysis(mapInstance, option.key);
                      }
                    }}
                    className="justify-start text-xs"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Display */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Satellite className="w-5 h-5 mr-2" />
              Satellite Analysis View - {analysisOptions.find(opt => opt.key === activeAnalysis)?.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-lg overflow-hidden border relative">
              {loading && (
                <div className="absolute inset-0 bg-muted/50 flex items-center justify-center z-10">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading analysis...</p>
                  </div>
                </div>
              )}
              <div ref={mapRef} className="w-full h-full" style={{ minHeight: '400px' }} />
              <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs">
                Provider: {mapProvider === 'google' ? 'Google Maps' : 'Mapbox'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Results */}
      {analysisResults && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results - {analysisResults.type}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="data">Raw Data</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-sm">Analysis Type</h4>
                    <p className="text-lg font-bold capitalize">{analysisResults.type.replace('_', ' ')}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-sm">Data Points</h4>
                    <p className="text-lg font-bold">{Object.keys(analysisResults.data).length}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-sm">Last Updated</h4>
                    <p className="text-lg font-bold">{new Date(analysisResults.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="data">
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64">
                  {JSON.stringify(analysisResults.data, null, 2)}
                </pre>
              </TabsContent>
              
              <TabsContent value="recommendations" className="space-y-4">
                <div className="space-y-3">
                  {activeAnalysis === 'deforestation' && (
                    <div className="p-4 border-l-4 border-red-500 bg-red-50">
                      <h4 className="font-medium text-red-800">Forest Conservation Priority</h4>
                      <p className="text-red-700 text-sm mt-1">
                        Implement immediate protection measures in areas showing recent forest loss. 
                        Consider reforestation programs and community-based conservation initiatives.
                      </p>
                    </div>
                  )}
                  {activeAnalysis === 'water_quality' && (
                    <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                      <h4 className="font-medium text-blue-800">Water Management</h4>
                      <p className="text-blue-700 text-sm mt-1">
                        Monitor temperature trends and implement cooling strategies for water bodies. 
                        Focus on reducing pollution sources and improving water treatment facilities.
                      </p>
                    </div>
                  )}
                  {activeAnalysis === 'air_quality' && (
                    <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                      <h4 className="font-medium text-purple-800">Air Quality Improvement</h4>
                      <p className="text-purple-700 text-sm mt-1">
                        Reduce emissions from industrial sources and promote clean energy initiatives. 
                        Implement urban green spaces to improve air filtration.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
