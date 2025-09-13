"use client"

import { useState } from "react"
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
} from "lucide-react"

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
  const [selectedRegion, setSelectedRegion] = useState("congo-basin")
  const [carbonArea, setCarbonArea] = useState("")
  const [carbonResult, setCarbonResult] = useState<any>(null)

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
          <p className="text-muted-foreground mt-1">Forest monitoring, carbon tracking, and biodiversity protection</p>
        </div>
        <div className="flex items-center space-x-2">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Forest Map */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TreePine className="w-5 h-5 mr-2" />
                  Real-time Forest Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <TreePine className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg font-medium text-muted-foreground">Satellite Forest Coverage</p>
                        <p className="text-sm text-muted-foreground mt-2">Real-time deforestation detection</p>
                      </div>
                    </div>
                  </div>

                  {/* Alert Markers */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center space-x-2 bg-destructive/90 text-destructive-foreground px-2 py-1 rounded-full text-xs">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>Critical Alert</span>
                    </div>
                  </div>
                  <div className="absolute top-16 right-8">
                    <div className="flex items-center space-x-2 bg-yellow-500/90 text-white px-2 py-1 rounded-full text-xs">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>High Alert</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border">
                    <h4 className="font-medium text-sm mb-2">Forest Health</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-600 rounded"></div>
                        <span>Healthy Forest</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                        <span>At Risk</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-600 rounded"></div>
                        <span>Deforested</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deforestation Alerts */}
            <Card>
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
