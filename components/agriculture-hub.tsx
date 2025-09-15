"use client"

import { useState, useEffect, useRef } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TreePine,
  Droplets,
  Thermometer,
  Wind,
  MapPin, 
  TrendingUp, 
  TrendingDown,
  Leaf,
  Upload,
  Scan,
  AlertTriangle,
  Clock,
  BarChart3,
  Satellite,
  Loader2,
  CloudRain,
  Sprout,
  DollarSign,
  Calendar,
  Camera,
  Bug,
  Cloud

} from "lucide-react"
import { earthEngineAuth } from "@/lib/earthEngineAuth"
import InteractiveMap from "@/components/InteractiveMap";
import { mapService } from "@/lib/mapService";
import { CountrySearch } from "@/components/CountrySearch"
import { africanCountries, getCountryAgriculturalData } from "@/lib/countryData"
import { geminiService } from "@/lib/geminiService"

const farmStats = [
  {
    title: "Total Farm Area",
    value: "25.4 ha",
    change: "+2.1 ha",
    trend: "up",
    icon: MapPin,
    color: "text-green-600",
  },
  {
    title: "Active Crops",
    value: "4 Types",
    change: "Maize, Cassava, Beans, Tomatoes",
    trend: "stable",
    icon: Sprout,
    color: "text-emerald-600",
  },
  {
    title: "Irrigation Status",
    value: "85%",
    change: "Optimal",
    trend: "up",
    icon: Droplets,
    color: "text-blue-600",
  },
  {
    title: "Expected Yield",
    value: "12.3 tons",
    change: "+8.5%",
    trend: "up",
    icon: TrendingUp,
    color: "text-purple-600",
  },
]

const cropHealth = [
  { crop: "Maize", health: 92, status: "Excellent", area: "8.5 ha", issues: 0 },
  { crop: "Cassava", health: 78, status: "Good", area: "6.2 ha", issues: 1 },
  { crop: "Beans", health: 85, status: "Good", area: "4.8 ha", issues: 0 },
  { crop: "Tomatoes", health: 65, status: "Fair", area: "5.9 ha", issues: 2 },
]

const marketPrices = [
  { crop: "Maize", price: 245, unit: "per ton", change: "+5.2%", trend: "up" },
  { crop: "Cassava", price: 180, unit: "per ton", change: "-2.1%", trend: "down" },
  { crop: "Beans", price: 890, unit: "per ton", change: "+12.3%", trend: "up" },
  { crop: "Tomatoes", price: 320, unit: "per ton", change: "+3.8%", trend: "up" },
]

const farmTasks = [
  { task: "Irrigation - Tomato Field", priority: "high", due: "Today", status: "pending" },
  { task: "Pest Control - Cassava", priority: "medium", due: "Tomorrow", status: "pending" },
  { task: "Fertilizer Application", priority: "low", due: "Next Week", status: "scheduled" },
  { task: "Harvest - Bean Field", priority: "high", due: "3 days", status: "scheduled" },
]

interface FieldData {
  lat: number;
  lng: number;
  value: any;
  analysisType: string;
}

interface AnalysisResult {
  type: string;
  data: any;
  timestamp: string;
}

interface ScanResult {
  disease: string;
  confidence: number;
  severity: string;
  treatment: string;
  prevention: string;
}

export default function AgricultureHub() {
  const [isEEReady, setIsEEReady] = useState(false);
  const [cropAnalysis, setCropAnalysis] = useState('ndvi');
  const [fieldData, setFieldData] = useState<FieldData | null>(null);
  // const [fieldData, setFieldData] = useState<FieldData | null>(null);
  const [selectedField, setSelectedField] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [cropFilters, setCropFilters] = useState<Record<string, boolean>>({
    ndvi: true,
    moisture: false,
    temperature: false,
    rainfall: false,
    cropHealth: false
  });
  const [selectedCrop, setSelectedCrop] = useState("maize");
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [geminiAnalysis, setGeminiAnalysis] = useState<string>('');
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [showGeminiPanel, setShowGeminiPanel] = useState(false);
  const [cropQuestion, setCropQuestion] = useState('');
  const [currentOverlay, setCurrentOverlay] = useState<any>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeEarthEngine();
  }, []);


  const handleCountrySelect = (country: any) => {
    setSelectedCountry(country);
    const agriData = getCountryAgriculturalData(country.code);
    if (agriData) {
      // Update crop types display based on country
      console.log('Selected country crops:', agriData.cropTypes);
    }
  };

  const toggleCropFilter = (filter: string) => {
    setCropFilters(prev => {
      const newFilters = {
        ndvi: false,
        moisture: false,
        temperature: false,
        rainfall: false,
        cropHealth: false
      };
      newFilters[filter as keyof typeof newFilters] = !prev[filter as keyof typeof prev];
      return newFilters;
    });
    
    // Update active analysis based on filter
    const filterToAnalysis: Record<string, string> = {
      ndvi: 'ndvi',
      moisture: 'soil_moisture',
      temperature: 'temperature',
      rainfall: 'precipitation',
      cropHealth: 'crop_health'
    };
    
    const newAnalysis = filterToAnalysis[filter] || 'ndvi';
    setCropAnalysis(newAnalysis);
    
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



  const runGeminiCropAnalysis = async (analysisType: string, bounds: any) => {
    try {
      setGeminiLoading(true);
      
      const cropData = {
        ndvi: analysisType === 'ndvi' ? '0.65' : 'N/A',
        soilMoisture: analysisType === 'soil_moisture' ? '0.35' : 'N/A',
        temperature: analysisType === 'temperature' ? '28.5' : 'N/A',
        precipitation: analysisType === 'precipitation' ? '850' : 'N/A',
        airQuality: 'Moderate',
        waterQuality: '78%'
      };
      
      const location = selectedCountry ? selectedCountry.name : 'Kenya';
      const cropType = selectedCrop || 'maize';
      
      const analysis = await geminiService.analyzeCropData(cropData, location, cropType);
      setGeminiAnalysis(typeof analysis === 'string' ? analysis : JSON.stringify(analysis, null, 2));
      setShowGeminiPanel(true);
    } catch (error) {
      console.error('Gemini analysis failed:', error);
      setGeminiAnalysis('Failed to get AI analysis. Please try again.');
    } finally {
      setGeminiLoading(false);
    }
  };

  const askGeminiQuestion = async () => {
    if (!cropQuestion.trim()) return;
    
    try {
      setGeminiLoading(true);
      const location = selectedCountry ? selectedCountry.name : 'Kenya';
      const season = 'Current';
      const soilType = 'Loamy';
      const cropType = selectedCrop || 'general farming';
      
      const response = await geminiService.getCropRecommendations(location, season, soilType, cropType);
      setGeminiAnalysis(response);
      setShowGeminiPanel(true);
      setCropQuestion('');
    } catch (error) {
      console.error('Gemini question failed:', error);
      setGeminiAnalysis('Failed to get AI response. Please try again.');
    } finally {
      setGeminiLoading(false);
    }
  };


  const analysisTypes = [
    { key: 'ndvi', label: 'Vegetation Health', description: 'NDVI analysis for crop vigor' },
    { key: 'moisture', label: 'Soil Moisture', description: 'Water content monitoring' },
    { key: 'temperature', label: 'Temperature', description: 'Heat stress detection' },
    { key: 'rainfall', label: 'Precipitation', description: 'Rainfall patterns' }
  ];

  const handleImageScan = () => {
    // Simulate AI crop analysis
    setScanResult({
      disease: "Corn Leaf Blight",
      confidence: 87,
      severity: "Moderate",
      treatment: "Apply fungicide within 48 hours. Remove affected leaves.",
      prevention: "Ensure proper spacing and avoid overhead watering.",
    });
  };


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agriculture Intelligence Hub</h1>
          <p className="text-muted-foreground mt-1">Satellite-based crop monitoring and precision agriculture</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-100 text-green-700">
            {isEEReady ? "Monitoring Active" : "Initializing..."}
          </Badge>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Farm Calendar
          </Button>
          <Button>
            <Camera className="w-4 h-4 mr-2" />
            Scan Crop
          </Button>
        </div>
      </div>

      {/* Farm Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {farmStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Farm Dashboard</TabsTrigger>
          <TabsTrigger value="scanner">Crop Scanner</TabsTrigger>
          <TabsTrigger value="irrigation">Irrigation</TabsTrigger>
          <TabsTrigger value="predictions">Yield Predictions</TabsTrigger>
          <TabsTrigger value="market">Market Data</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Satellite Map */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Satellite className="w-5 h-5 mr-2" />
                    Crop Monitoring Map
                  </span>
                  <div className="flex items-center space-x-2">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    <Badge variant={isEEReady ? "default" : "secondary"}>
                      {isEEReady ? "Earth Engine Ready" : "Loading..."}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-96 rounded-lg border bg-gray-100" style={{ minHeight: '400px' }}>
                  <InteractiveMap 
                    activeLayers={Object.keys(cropFilters).filter(k => cropFilters[k as keyof typeof cropFilters])}
                    initialViewState={{
                      longitude: selectedCountry ? selectedCountry.coordinates.lng : 20,
                      latitude: selectedCountry ? selectedCountry.coordinates.lat : 0,
                      zoom: selectedCountry ? 7 : 4
                    }}
                  />
                </div>
                
                {/* Gemini AI Analysis Panel */}
                {showGeminiPanel && (
                  <div className="mt-4 p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium flex items-center">
                        🤖 AI Crop Analysis
                        {geminiLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                      </h4>
                      <Button
                        onClick={() => setShowGeminiPanel(false)}
                        variant="ghost"
                        size="sm"
                      >
                        ×
                      </Button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700">
                        {geminiAnalysis || 'No analysis available. Run a crop analysis or ask a question to get AI recommendations.'}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analysis Controls */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-sm">Crop Analysis Controls</CardTitle>
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
                {/* Crop Data Filters */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Crop Data Layers</label>
                  <div className="space-y-2">
                    {[
                      { id: 'ndvi', label: 'NDVI', icon: Leaf },
                      { id: 'soil_moisture', label: 'Soil Moisture', icon: Droplets },
                      { id: 'temperature', label: 'Temperature', icon: Thermometer },
                      { id: 'precipitation', label: 'Rainfall', icon: CloudRain },
                      { id: 'crop_health', label: 'Crop Health', icon: Sprout }
                    ].map((filter) => (
                      <div key={filter.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={filter.id}
                          checked={cropFilters[filter.id as keyof typeof cropFilters]}
                          onChange={() => toggleCropFilter(filter.id)}
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

                {/* Country Crop Types */}
                {selectedCountry && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Main Crops in {selectedCountry.name}</label>
                    <div className="flex flex-wrap gap-1">
                      {selectedCountry.cropTypes?.map((crop: string) => (
                        <Badge key={crop} variant="secondary" className="text-xs">
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {analysisTypes.map((type) => (
                  <Button
                    key={type.key}
                    variant={cropAnalysis === type.key ? "default" : "outline"}
                    className="w-full text-left justify-start"
                    onClick={() => {
                      setCropAnalysis(type.key);
                    }}
                  >
                    <div className="text-left">
                      <div className="font-medium text-sm">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </Button>
                ))}
                
                {/* Field Click Results */}
                {fieldData && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-sm">Field Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs">
                      <p><strong>Location:</strong> {fieldData.lat.toFixed(4)}, {fieldData.lng.toFixed(4)}</p>
                      <p><strong>Analysis:</strong> {fieldData.analysisType}</p>
                      <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto">
                        {JSON.stringify(fieldData.value, null, 1)}
                      </pre>
                    </CardContent>
                  </Card>
                )}
                
                {/* AI Crop Analysis */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">🤖 AI Crop Assistant</label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Ask about crop recommendations..."
                        value={cropQuestion}
                        onChange={(e) => setCropQuestion(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && askGeminiQuestion()}
                      />
                      <Button
                        onClick={askGeminiQuestion}
                        disabled={geminiLoading || !cropQuestion.trim()}
                        size="sm"
                      >
                        {geminiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ask AI'}
                      </Button>
                    </div>
                    <Button
                      onClick={() => setShowGeminiPanel(!showGeminiPanel)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      {showGeminiPanel ? 'Hide' : 'Show'} AI Analysis
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Farm Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Upcoming Farm Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {farmTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          task.priority === "high"
                            ? "bg-red-500"
                            : task.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-sm">{task.task}</p>
                        <p className="text-xs text-muted-foreground">Due: {task.due}</p>
                      </div>
                    </div>
                    <Badge variant={task.status === "pending" ? "destructive" : "secondary"}>{task.status}</Badge>
                  </div>
                ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scanner" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  Crop Health Scanner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Take a photo or upload an image of your crop</p>
                  <div className="flex flex-col space-y-2">
                    <Button className="w-full">
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Crop Type</Label>
                  <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maize">Maize</SelectItem>
                      <SelectItem value="cassava">Cassava</SelectItem>
                      <SelectItem value="beans">Beans</SelectItem>
                      <SelectItem value="tomatoes">Tomatoes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleImageScan} className="w-full">
                  <Scan className="w-4 h-4 mr-2" />
                  Analyze Crop Health
                </Button>
              </CardContent>
            </Card>

            {/* Scan Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bug className="w-5 h-5 mr-2" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {scanResult ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        <span className="font-medium">{scanResult.disease}</span>
                      </div>
                      <Badge variant="destructive">{scanResult.confidence}% confidence</Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Severity</Label>
                        <p className="text-sm text-muted-foreground">{scanResult.severity}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Recommended Treatment</Label>
                        <p className="text-sm text-muted-foreground">{scanResult.treatment}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Prevention</Label>
                        <p className="text-sm text-muted-foreground">{scanResult.prevention}</p>
                      </div>
                    </div>

                    <Button className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Treatment
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Scan className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Upload an image to get AI-powered crop analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="irrigation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Droplets className="w-5 h-5 mr-2" />
                  Smart Irrigation Optimizer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Thermometer className="w-6 h-6 mx-auto text-red-500 mb-2" />
                    <p className="text-sm font-medium">Temperature</p>
                    <p className="text-lg font-bold">28°C</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Cloud className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                    <p className="text-sm font-medium">Humidity</p>
                    <p className="text-lg font-bold">65%</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>Soil Moisture Level</Label>
                    <Progress value={45} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">45% - Needs irrigation</p>
                  </div>

                  <div>
                    <Label>Recommended Water Amount</Label>
                    <div className="text-2xl font-bold text-primary">25mm</div>
                    <p className="text-xs text-muted-foreground">Based on crop type, soil, and weather</p>
                  </div>
                </div>

                <Button className="w-full">
                  <Droplets className="w-4 h-4 mr-2" />
                  Start Irrigation
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Irrigation Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Maize Field A</p>
                      <p className="text-xs text-muted-foreground">Next: Today 6:00 AM</p>
                    </div>
                    <Badge className="bg-blue-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Tomato Field D</p>
                      <p className="text-xs text-muted-foreground">Next: Tomorrow 5:30 AM</p>
                    </div>
                    <Badge variant="secondary">Scheduled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Bean Field C</p>
                      <p className="text-xs text-muted-foreground">Next: In 2 days</p>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Yield Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cropHealth.map((crop) => (
                    <div key={crop.crop} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{crop.crop}</p>
                        <p className="text-xs text-muted-foreground">{crop.area}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">
                          {crop.crop === "Maize"
                            ? "4.2 tons"
                            : crop.crop === "Cassava"
                              ? "3.8 tons"
                              : crop.crop === "Beans"
                                ? "2.1 tons"
                                : "2.2 tons"}
                        </p>
                        <p className="text-xs text-green-600">+8.5% vs last season</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Harvest Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Harvest prediction timeline</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Real-time Market Prices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {marketPrices.map((item) => (
                  <div key={item.crop} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">{item.crop}</h3>
                      <Badge variant={item.trend === "up" ? "default" : "destructive"}>{item.change}</Badge>
                    </div>
                    <div className="text-2xl font-bold">${item.price}</div>
                    <p className="text-xs text-muted-foreground">{item.unit}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
