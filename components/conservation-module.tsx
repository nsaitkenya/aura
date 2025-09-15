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
  TreePine,
  Leaf,
  MapPin,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Calculator,
  Target,
  Binary as Binoculars,
  Zap,
  Globe,
  Award,
  Calendar,
  Satellite,
  Loader2
} from "lucide-react"
import { earthEngineAuth } from "@/lib/earthEngineAuth"
import InteractiveMap from "@/components/InteractiveMap";
import { mapService } from "@/lib/mapService";
import { googleMapsService } from "@/lib/googleMapsService"
import { CountrySearch } from "@/components/CountrySearch"
import { africanCountries, getCountryEnvironmentalData } from "@/lib/countryData"

const forestStats = [
  {
    title: "Forest Coverage",
    value: "68.2%",
    change: "-2.1%",
    trend: "down",
    icon: TreePine,
    color: "text-green-600",
    description: "of total land area",
  },
  {
    title: "Deforestation Rate",
    value: "0.8%",
    change: "-0.3%",
    trend: "up",
    icon: TrendingDown,
    color: "text-red-600",
    description: "annual loss",
  },
  {
    title: "Carbon Sequestered",
    value: "2.4M tons",
    change: "+5.2%",
    trend: "up",
    icon: Leaf,
    color: "text-emerald-600",
    description: "CO2 equivalent",
  },
  {
    title: "Protected Areas",
    value: "15.3%",
    change: "+1.8%",
    trend: "up",
    icon: Globe,
    color: "text-blue-600",
    description: "of total area",
  },
]

const deforestationAlerts = [
  {
    location: "Congo Basin",
    area: "2.3 km²",
    severity: "critical",
    time: "2 hours ago",
    confidence: 94,
    cause: "Illegal logging",
  },
  {
    location: "Ethiopian Highlands",
    area: "0.8 km²",
    severity: "high",
    time: "6 hours ago",
    confidence: 87,
    cause: "Agricultural expansion",
  },
  {
    location: "Madagascar East Coast",
    area: "1.2 km²",
    severity: "medium",
    time: "1 day ago",
    confidence: 76,
    cause: "Infrastructure development",
  },
]

const biodiversityHotspots = [
  { name: "Congo Basin", species: 1200, threat: "high", protection: 45 },
  { name: "Madagascar", species: 890, threat: "critical", protection: 32 },
  { name: "Ethiopian Highlands", species: 650, threat: "medium", protection: 68 },
  { name: "Cape Floristic Region", species: 980, threat: "high", protection: 78 },
]

const reforestationSites = [
  { location: "Northern Ghana", suitability: 92, area: "150 ha", species: "Mahogany, Teak" },
  { location: "Central Kenya", suitability: 88, area: "200 ha", species: "Cedar, Pine" },
  { location: "Southern Mali", suitability: 85, area: "120 ha", species: "Baobab, Acacia" },
]

export function ConservationModule() {
  const [isEEReady, setIsEEReady] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState('forest_loss');
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("congo-basin")
  const [carbonArea, setCarbonArea] = useState("")
  const [carbonResult, setCarbonResult] = useState<any>(null)
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [conservationFilters, setConservationFilters] = useState<Record<string, boolean>>({
    forest_loss: true,
    carbon_mapping: false,
    protected_areas: false,
    biodiversity: false
  });

  useEffect(() => {
    initializeEarthEngine();
    // Initialize Google Maps service
    googleMapsService.initialize().catch(console.error);
  }, []);

  const initializeEarthEngine = async () => {
    try {
      setLoading(true);
      await earthEngineAuth.authenticate();
      setIsEEReady(true);
      setLoading(false);
    } catch (error) {
      console.error('Earth Engine authentication failed:', error);
      setLoading(false);
    }
  };



  const handleCountrySelect = async (country: any) => {
    setSelectedCountry(country);
    try {
      const envData = await getCountryEnvironmentalData(country.code);
      if (envData) {
        console.log('Selected country conservation data:', envData);
      }
    } catch (error) {
      console.error('Error getting country conservation data:', error);
    }
  };


  const toggleConservationFilter = (filter: string) => {
    setConservationFilters(prev => {
      const newFilters = {
        forest_loss: false,
        carbon_mapping: false,
        protected_areas: false,
        biodiversity: false
      };
      newFilters[filter as keyof typeof newFilters] = !prev[filter as keyof typeof prev];
      return newFilters;
    });
    
    setActiveAnalysis(filter);
    
  };


  const analysisOptions = [
    { key: 'forest_loss', label: 'Forest Loss', description: 'Recent deforestation detection' },
    { key: 'carbon_mapping', label: 'Carbon Mapping', description: 'Biomass and carbon storage' },
    { key: 'protected_areas', label: 'Protected Areas', description: 'Conservation zones overlay' },
    { key: 'biodiversity', label: 'Biodiversity', description: 'Species richness mapping' }
  ];

  const calculateCarbon = () => {
    const area = Number.parseFloat(carbonArea)
    if (area) {
      setCarbonResult({
        totalCarbon: (area * 2.5).toFixed(1),
        annualSequestration: (area * 0.3).toFixed(1),
        creditValue: (area * 2.5 * 15).toFixed(0),
        trees: Math.round(area * 400),
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Conservation & Reforestation</h1>
          <p className="text-muted-foreground mt-1">Satellite-based forest monitoring, carbon tracking, and biodiversity protection</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-100 text-green-700">
            {isEEReady ? "Monitoring Active" : "Initializing..."}
          </Badge>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Planting Calendar
          </Button>
          <Button>
            <AlertTriangle className="w-4 h-4 mr-2" />
            View Alerts
          </Button>
        </div>
      </div>

      {/* Conservation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {forestStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                  <span className="ml-1">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="monitoring" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monitoring">Forest Monitor</TabsTrigger>
          <TabsTrigger value="carbon">Carbon Credits</TabsTrigger>
          <TabsTrigger value="reforestation">Reforestation</TabsTrigger>
          <TabsTrigger value="biodiversity">Biodiversity</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Analysis Controls */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Satellite className="w-5 h-5 mr-2" />
                  Conservation Analysis
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

                {/* Conservation Data Filters */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Conservation Layers</label>
                  <div className="space-y-2">
                    {[
                      { key: 'forest_loss', label: 'Forest Loss', icon: TreePine, color: 'text-red-600' },
                      { key: 'carbon_mapping', label: 'Carbon Storage', icon: Leaf, color: 'text-green-600' },
                      { key: 'protected_areas', label: 'Protected Areas', icon: Globe, color: 'text-blue-600' },
                      { key: 'biodiversity', label: 'Biodiversity', icon: Binoculars, color: 'text-purple-600' }
                    ].map((filter) => {
                      const Icon = filter.icon;
                      return (
                        <div key={filter.key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={filter.key}
                            checked={conservationFilters[filter.key as keyof typeof conservationFilters]}
                            onChange={() => toggleConservationFilter(filter.key)}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor={filter.key} className="flex items-center space-x-2 text-sm cursor-pointer">
                            <Icon className={`w-4 h-4 ${filter.color}`} />
                            <span>{filter.label}</span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Country Conservation Stats */}
                {selectedCountry && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Conservation in {selectedCountry.name}</label>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Forest Cover:</span>
                        <span className="font-medium">{selectedCountry.forestCover}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protected Areas:</span>
                        <span className="font-medium">{selectedCountry.conservationAreas}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Water Quality:</span>
                        <span className="font-medium">{selectedCountry.waterQuality}/100</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Analysis Options */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Analysis Type</label>
                  <div className="space-y-2">
                    {analysisOptions.map((option) => (
                      <Button
                        key={option.key}
                        variant={activeAnalysis === option.key ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setActiveAnalysis(option.key);
                        }}
                        className="w-full justify-start text-xs"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Satellite Forest Map */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Satellite className="w-5 h-5 mr-2" />
                  Satellite Forest Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Loading Earth Engine...</p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg overflow-hidden border" style={{ minHeight: '400px' }}>
                    <InteractiveMap 
                      activeLayers={Object.keys(conservationFilters).filter(k => conservationFilters[k as keyof typeof conservationFilters])}
                      initialViewState={{
                        longitude: selectedCountry ? selectedCountry.coordinates.lng : 20,
                        latitude: selectedCountry ? selectedCountry.coordinates.lat : 0,
                        zoom: selectedCountry ? 6 : 4
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deforestation Alerts */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Deforestation Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {deforestationAlerts.map((alert, index) => (
                  <div key={index} className="border-l-4 border-l-destructive pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <Badge
                        variant={
                          alert.severity === "critical"
                            ? "destructive"
                            : alert.severity === "high"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {alert.severity}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                    <h4 className="font-medium text-sm">{alert.location}</h4>
                    <p className="text-xs text-muted-foreground mb-1">Area: {alert.area}</p>
                    <p className="text-xs mb-1">Cause: {alert.cause}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span>Confidence: {alert.confidence}%</span>
                      <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                        Investigate
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="carbon" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Carbon Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Carbon Credit Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Forest Area (hectares)</Label>
                  <Input
                    type="number"
                    placeholder="Enter area in hectares"
                    value={carbonArea}
                    onChange={(e) => setCarbonArea(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Forest Type</Label>
                  <Select defaultValue="tropical">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tropical">Tropical Rainforest</SelectItem>
                      <SelectItem value="temperate">Temperate Forest</SelectItem>
                      <SelectItem value="boreal">Boreal Forest</SelectItem>
                      <SelectItem value="mangrove">Mangrove</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={calculateCarbon} className="w-full">
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Carbon Credits
                </Button>

                {carbonResult && (
                  <div className="space-y-3 p-4 bg-muted rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Carbon</p>
                        <p className="font-bold">{carbonResult.totalCarbon} tons CO₂</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Annual Sequestration</p>
                        <p className="font-bold">{carbonResult.annualSequestration} tons/year</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Credit Value</p>
                        <p className="font-bold">${carbonResult.creditValue}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Trees Equivalent</p>
                        <p className="font-bold">{carbonResult.trees.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Carbon Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Active Carbon Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Congo Basin Conservation</p>
                      <p className="text-xs text-muted-foreground">5,000 ha protected</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-green-600">12,500 tons CO₂</p>
                      <Badge className="bg-green-500">Verified</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Kenya Reforestation</p>
                      <p className="text-xs text-muted-foreground">2,300 ha planted</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-blue-600">5,750 tons CO₂</p>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Madagascar Mangroves</p>
                      <p className="text-xs text-muted-foreground">800 ha restored</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-purple-600">3,200 tons CO₂</p>
                      <Badge className="bg-green-500">Verified</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reforestation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Site Optimizer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Reforestation Site Optimizer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Target Region</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="congo-basin">Congo Basin</SelectItem>
                      <SelectItem value="east-africa">East Africa</SelectItem>
                      <SelectItem value="west-africa">West Africa</SelectItem>
                      <SelectItem value="madagascar">Madagascar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">AI-optimized planting zones</p>
                    <p className="text-xs text-muted-foreground mt-2">Based on soil, climate, and biodiversity</p>
                  </div>
                </div>

                <Button className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Planting Plan
                </Button>
              </CardContent>
            </Card>

            {/* Recommended Sites */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Planting Sites</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reforestationSites.map((site, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{site.location}</h4>
                      <Badge className="bg-green-500">{site.suitability}% suitable</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>Area: {site.area}</p>
                      <p>Recommended species: {site.species}</p>
                    </div>
                    <Progress value={site.suitability} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="biodiversity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Biodiversity Map */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Binoculars className="w-5 h-5 mr-2" />
                  Biodiversity Hotspot Mapper
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Binoculars className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg font-medium text-muted-foreground">Critical Habitat Mapping</p>
                        <p className="text-sm text-muted-foreground mt-2">Species distribution and threat assessment</p>
                      </div>
                    </div>
                  </div>

                  {/* Hotspot Markers */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center space-x-2 bg-red-500/90 text-white px-2 py-1 rounded-full text-xs">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Critical Hotspot</span>
                    </div>
                  </div>
                  <div className="absolute bottom-8 right-8">
                    <div className="flex items-center space-x-2 bg-yellow-500/90 text-white px-2 py-1 rounded-full text-xs">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>High Priority</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hotspot Details */}
            <Card>
              <CardHeader>
                <CardTitle>Biodiversity Hotspots</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {biodiversityHotspots.map((hotspot, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{hotspot.name}</h4>
                      <Badge
                        variant={
                          hotspot.threat === "critical"
                            ? "destructive"
                            : hotspot.threat === "high"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {hotspot.threat}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>{hotspot.species} species identified</p>
                      <p>{hotspot.protection}% protected</p>
                    </div>
                    <Progress value={hotspot.protection} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
