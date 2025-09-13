"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Building2, Thermometer, Wind, Zap, TreePine, TrendingUp, MapPin, Settings } from "lucide-react"

export function UrbanSustainability() {
  const [selectedCity, setSelectedCity] = useState("lagos")
  const [timeRange, setTimeRange] = useState("7d")
  const [alertThreshold, setAlertThreshold] = useState([75])

  const cities = [
    { id: "lagos", name: "Lagos, Nigeria", population: "15.4M" },
    { id: "cairo", name: "Cairo, Egypt", population: "20.9M" },
    { id: "kinshasa", name: "Kinshasa, DRC", population: "17.1M" },
    { id: "johannesburg", name: "Johannesburg, SA", population: "5.6M" },
    { id: "nairobi", name: "Nairobi, Kenya", population: "4.9M" },
    { id: "casablanca", name: "Casablanca, Morocco", population: "3.7M" },
  ]

  const airQualityData = [
    { location: "Victoria Island", aqi: 85, status: "Moderate", trend: "up" },
    { location: "Ikeja", aqi: 120, status: "Unhealthy", trend: "up" },
    { location: "Surulere", aqi: 95, status: "Moderate", trend: "down" },
    { location: "Lekki", aqi: 70, status: "Good", trend: "stable" },
  ]

  const heatIslandData = [
    { zone: "Central Business District", temp: 34.2, intensity: "High", area: "12.5 km²" },
    { zone: "Industrial Area", temp: 32.8, intensity: "High", area: "8.3 km²" },
    { zone: "Residential Suburbs", temp: 29.1, intensity: "Medium", area: "45.2 km²" },
    { zone: "Green Corridors", temp: 26.5, intensity: "Low", area: "15.8 km²" },
  ]

  const sustainabilityProjects = [
    {
      name: "Solar Street Lighting",
      progress: 78,
      impact: "2,400 tons CO₂ saved",
      status: "In Progress",
      completion: "Dec 2024",
    },
    {
      name: "Waste-to-Energy Plant",
      progress: 45,
      impact: "15,000 tons waste/year",
      status: "Construction",
      completion: "Jun 2025",
    },
    {
      name: "Green Building Initiative",
      progress: 92,
      impact: "30% energy reduction",
      status: "Near Completion",
      completion: "Mar 2024",
    },
    {
      name: "Urban Forest Expansion",
      progress: 34,
      impact: "50,000 new trees",
      status: "Planning",
      completion: "Dec 2025",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Urban Sustainability</h1>
          <p className="text-muted-foreground mt-1">
            Monitor air quality, heat islands, and sustainability initiatives across African cities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{city.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {city.population}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Air Quality Index</CardTitle>
            <Wind className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">Moderate</Badge>
              <span className="text-xs text-muted-foreground">+5 from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heat Island Intensity</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+4.2°C</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="destructive">High</Badge>
              <span className="text-xs text-muted-foreground">Peak zones</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Green Coverage</CardTitle>
            <TreePine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5%</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-emerald-100 text-emerald-800">+2.1%</Badge>
              <span className="text-xs text-muted-foreground">This year</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Efficiency</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-emerald-100 text-emerald-800">+8%</Badge>
              <span className="text-xs text-muted-foreground">Improvement</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="air-quality" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="air-quality">Air Quality Monitor</TabsTrigger>
          <TabsTrigger value="heat-islands">Heat Island Tracker</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability Projects</TabsTrigger>
          <TabsTrigger value="settings">Alert Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="air-quality" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wind className="h-5 w-5" />
                    Real-time Air Quality Map
                  </CardTitle>
                  <CardDescription>Live air quality measurements across monitoring stations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Wind className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">Interactive Air Quality Map</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Real-time AQI data from 24 monitoring stations
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Station Readings</CardTitle>
                  <CardDescription>Current AQI by location</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {airQualityData.map((station, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{station.location}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={
                              station.status === "Good"
                                ? "default"
                                : station.status === "Moderate"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {station.status}
                          </Badge>
                          <TrendingUp
                            className={`h-3 w-3 ${
                              station.trend === "up"
                                ? "text-red-500"
                                : station.trend === "down"
                                  ? "text-green-500"
                                  : "text-gray-500"
                            }`}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{station.aqi}</p>
                        <p className="text-xs text-muted-foreground">AQI</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="heat-islands" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5" />
                    Urban Heat Island Map
                  </CardTitle>
                  <CardDescription>Temperature variations and heat intensity zones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Thermometer className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">Heat Island Intensity Map</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Thermal satellite imagery with temperature overlays
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Heat Zones</CardTitle>
                  <CardDescription>Temperature by area</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {heatIslandData.map((zone, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{zone.zone}</p>
                        <Badge
                          variant={
                            zone.intensity === "High"
                              ? "destructive"
                              : zone.intensity === "Medium"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {zone.intensity}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Temperature:</span>
                        <span className="font-medium">{zone.temp}°C</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Area:</span>
                        <span className="font-medium">{zone.area}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Active Sustainability Projects
              </CardTitle>
              <CardDescription>Track progress of urban sustainability initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sustainabilityProjects.map((project, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{project.name}</CardTitle>
                        <Badge
                          variant={
                            project.status === "Near Completion"
                              ? "default"
                              : project.status === "In Progress"
                                ? "secondary"
                                : project.status === "Construction"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Impact:</span>
                        <span className="font-medium">{project.impact}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Completion:</span>
                        <span className="font-medium">{project.completion}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Alert Configuration
              </CardTitle>
              <CardDescription>Configure thresholds and notifications for urban monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Air Quality Alert Threshold</Label>
                  <div className="mt-2">
                    <Slider
                      value={alertThreshold}
                      onValueChange={setAlertThreshold}
                      max={200}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Good (0-50)</span>
                      <span>Current: {alertThreshold[0]} AQI</span>
                      <span>Hazardous (151-200)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="heat-alerts">Heat Island Alerts</Label>
                    <Switch id="heat-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="air-alerts">Air Quality Alerts</Label>
                    <Switch id="air-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="project-alerts">Project Updates</Label>
                    <Switch id="project-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-alerts">Email Notifications</Label>
                    <Switch id="email-alerts" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notification-frequency">Notification Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button>Save Settings</Button>
                <Button variant="outline">Reset to Defaults</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
