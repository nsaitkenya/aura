"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Camera,
  Droplets,
  TrendingUp,
  DollarSign,
  Calendar,
  Thermometer,
  Cloud,
  Sprout,
  Bug,
  Leaf,
  MapPin,
  Upload,
  Scan,
  AlertTriangle,
  Clock,
  BarChart3,
} from "lucide-react"

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

export function AgricultureHub() {
  const [selectedCrop, setSelectedCrop] = useState("maize")
  const [scanResult, setScanResult] = useState<any>(null)

  const handleImageScan = () => {
    // Simulate AI crop analysis
    setScanResult({
      disease: "Corn Leaf Blight",
      confidence: 87,
      severity: "Moderate",
      treatment: "Apply fungicide within 48 hours. Remove affected leaves.",
      prevention: "Ensure proper spacing and avoid overhead watering.",
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agriculture Hub</h1>
          <p className="text-muted-foreground mt-1">Precision farming tools and crop management</p>
        </div>
        <div className="flex items-center space-x-2">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Farm Map */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Interactive Farm Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg font-medium text-muted-foreground">Farm Layout</p>
                        <p className="text-sm text-muted-foreground mt-2">Field boundaries and crop zones</p>
                      </div>
                    </div>
                  </div>

                  {/* Field Labels */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-500 text-white">Maize Field A</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-yellow-500 text-white">Cassava Field B</Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-blue-500 text-white">Bean Field C</Badge>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Badge className="bg-red-500 text-white">Tomato Field D</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Crop Health Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="w-5 h-5 mr-2" />
                  Crop Health Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cropHealth.map((crop) => (
                  <div key={crop.crop} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{crop.crop}</span>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={crop.health >= 90 ? "default" : crop.health >= 75 ? "secondary" : "destructive"}
                        >
                          {crop.status}
                        </Badge>
                        {crop.issues > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {crop.issues} issues
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Progress value={crop.health} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{crop.health}% healthy</span>
                      <span>{crop.area}</span>
                    </div>
                  </div>
                ))}
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
  )
}
