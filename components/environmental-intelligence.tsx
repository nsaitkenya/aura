"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Layers,
  Download,
  Thermometer,
  Droplets,
  Wind,
  Leaf,
  Mountain,
  Eye,
  BarChart3,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"

const dataLayers = [
  { id: "water", name: "Water Quality", icon: Droplets, color: "text-blue-500", enabled: true },
  { id: "soil", name: "Soil Health", icon: Mountain, color: "text-amber-600", enabled: true },
  { id: "vegetation", name: "Vegetation Index", icon: Leaf, color: "text-green-500", enabled: true },
  { id: "air", name: "Air Quality", icon: Wind, color: "text-purple-500", enabled: false },
  { id: "temperature", name: "Temperature", icon: Thermometer, color: "text-red-500", enabled: false },
  { id: "rainfall", name: "Rainfall", icon: Droplets, color: "text-cyan-500", enabled: false },
]

const regions = [
  { id: "west", name: "West Africa", countries: 16, alerts: 3 },
  { id: "east", name: "East Africa", countries: 12, alerts: 5 },
  { id: "central", name: "Central Africa", countries: 9, alerts: 2 },
  { id: "north", name: "North Africa", countries: 7, alerts: 1 },
  { id: "south", name: "Southern Africa", countries: 10, alerts: 4 },
]

export function EnvironmentalIntelligence() {
  const [selectedLayers, setSelectedLayers] = useState(dataLayers.filter((layer) => layer.enabled))
  const [timeRange, setTimeRange] = useState([2017])
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["west", "east"])

  const toggleLayer = (layerId: string) => {
    const layer = dataLayers.find((l) => l.id === layerId)
    if (!layer) return

    setSelectedLayers((prev) => {
      const exists = prev.find((l) => l.id === layerId)
      if (exists) {
        return prev.filter((l) => l.id !== layerId)
      } else {
        return [...prev, layer]
      }
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Environmental Intelligence</h1>
          <p className="text-muted-foreground mt-1">Multi-layer environmental data visualization for Africa</p>
        </div>
        <div className="flex items-center space-x-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Layers className="w-5 h-5 mr-2" />
              Map Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Data Layers */}
            <div>
              <h3 className="font-medium mb-3">Data Layers</h3>
              <div className="space-y-3">
                {dataLayers.map((layer) => {
                  const Icon = layer.icon
                  const isSelected = selectedLayers.some((l) => l.id === layer.id)
                  return (
                    <div key={layer.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className={`w-4 h-4 ${layer.color}`} />
                        <span className="text-sm">{layer.name}</span>
                      </div>
                      <Switch checked={isSelected} onCheckedChange={() => toggleLayer(layer.id)} />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Time Range */}
            <div>
              <h3 className="font-medium mb-3">Time Range</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>2017</span>
                  <span>2024</span>
                </div>
                <Slider
                  value={timeRange}
                  onValueChange={setTimeRange}
                  max={2024}
                  min={2017}
                  step={1}
                  className="w-full"
                />
                <div className="text-center text-sm text-muted-foreground">Year: {timeRange[0]}</div>
              </div>
            </div>

            {/* Region Filter */}
            <div>
              <h3 className="font-medium mb-3">Regions</h3>
              <div className="space-y-2">
                {regions.map((region) => (
                  <div key={region.id} className="flex items-center justify-between p-2 rounded-lg border">
                    <div>
                      <div className="font-medium text-sm">{region.name}</div>
                      <div className="text-xs text-muted-foreground">{region.countries} countries</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {region.alerts > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {region.alerts}
                        </Badge>
                      )}
                      <Switch
                        checked={selectedRegions.includes(region.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedRegions((prev) => [...prev, region.id])
                          } else {
                            setSelectedRegions((prev) => prev.filter((r) => r !== region.id))
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Map */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Continental Environmental Map
              </div>
              <div className="flex items-center space-x-2">
                <Select defaultValue="satellite">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="satellite">Satellite</SelectItem>
                    <SelectItem value="terrain">Terrain</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[4/3] bg-muted rounded-lg relative overflow-hidden">
              {/* Map Placeholder with Layer Indicators */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">Interactive Africa Map</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Satellite view with {selectedLayers.length} active layers
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Layers Indicator */}
              <div className="absolute top-4 left-4 space-y-2">
                {selectedLayers.map((layer) => {
                  const Icon = layer.icon
                  return (
                    <Badge key={layer.id} variant="secondary" className="flex items-center space-x-1">
                      <Icon className={`w-3 h-3 ${layer.color}`} />
                      <span className="text-xs">{layer.name}</span>
                    </Badge>
                  )
                })}
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border">
                <h4 className="font-medium text-sm mb-2">Legend</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Healthy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>Moderate</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Critical</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Tabs */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Historical Trends</TabsTrigger>
          <TabsTrigger value="comparison">Regional Comparison</TabsTrigger>
          <TabsTrigger value="alerts">Custom Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Forest Cover Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">7-year forest cover analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Droplets className="w-5 h-5 mr-2" />
                  Water Quality Index
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Regional water quality trends</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Side-by-Side Regional Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">West Africa</h3>
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Regional data visualization</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3">East Africa</h3>
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Regional data visualization</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Alert Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Forest Cover Threshold</label>
                  <Slider defaultValue={[70]} max={100} step={1} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">Alert when below 70%</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Air Quality Index</label>
                  <Slider defaultValue={[100]} max={300} step={5} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">Alert when AQI exceeds 100</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Water Quality Score</label>
                  <Slider defaultValue={[6]} max={10} step={0.1} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">Alert when below 6.0</p>
                </div>
                <Button className="w-full">Save Alert Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-l-red-500 pl-3 py-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="destructive">Critical</Badge>
                    <span className="text-xs text-muted-foreground">2h ago</span>
                  </div>
                  <p className="font-medium text-sm mt-1">Deforestation Alert</p>
                  <p className="text-xs text-muted-foreground">Congo Basin - Threshold exceeded</p>
                </div>
                <div className="border-l-4 border-l-yellow-500 pl-3 py-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Warning</Badge>
                    <span className="text-xs text-muted-foreground">6h ago</span>
                  </div>
                  <p className="font-medium text-sm mt-1">Air Quality Alert</p>
                  <p className="text-xs text-muted-foreground">Lagos - AQI 105</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
