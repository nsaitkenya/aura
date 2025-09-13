"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Brain,
  Target,
  Calendar,
  Download,
  RefreshCw,
  Zap,
  Activity,
  Eye,
} from "lucide-react"

const analyticsStats = [
  {
    title: "Risk Score",
    value: "Medium",
    change: "68/100",
    trend: "stable",
    icon: AlertTriangle,
    color: "text-yellow-600",
  },
  {
    title: "Predictions Active",
    value: "12",
    change: "+3 this week",
    trend: "up",
    icon: Brain,
    color: "text-purple-600",
  },
  {
    title: "Anomalies Detected",
    value: "5",
    change: "Last 30 days",
    trend: "down",
    icon: Eye,
    color: "text-red-600",
  },
  {
    title: "Forecast Accuracy",
    value: "87.3%",
    change: "+2.1%",
    trend: "up",
    icon: Target,
    color: "text-green-600",
  },
]

const riskAssessments = [
  {
    region: "Congo Basin",
    risk: "High",
    type: "Deforestation",
    probability: 85,
    timeframe: "30 days",
    impact: "Critical",
  },
  {
    region: "East Africa",
    risk: "Medium",
    type: "Drought",
    probability: 65,
    timeframe: "90 days",
    impact: "High",
  },
  {
    region: "West Africa",
    risk: "Low",
    type: "Flooding",
    probability: 25,
    timeframe: "30 days",
    impact: "Medium",
  },
]

const anomalies = [
  {
    type: "Temperature Spike",
    location: "Sahel Region",
    severity: "High",
    detected: "2 hours ago",
    deviation: "+8.5°C above normal",
  },
  {
    type: "Rainfall Pattern",
    location: "Ethiopian Highlands",
    severity: "Medium",
    detected: "6 hours ago",
    deviation: "40% below seasonal average",
  },
  {
    type: "Vegetation Index",
    location: "Madagascar",
    severity: "Low",
    detected: "1 day ago",
    deviation: "15% decline in NDVI",
  },
]

const predictiveModels = [
  {
    name: "Deforestation Risk Model",
    accuracy: 89.2,
    lastUpdated: "2 hours ago",
    status: "Active",
    predictions: 156,
  },
  {
    name: "Drought Prediction Model",
    accuracy: 84.7,
    lastUpdated: "4 hours ago",
    status: "Active",
    predictions: 89,
  },
  {
    name: "Crop Yield Forecaster",
    accuracy: 91.5,
    lastUpdated: "1 day ago",
    status: "Training",
    predictions: 234,
  },
]

export function AnalyticsModule() {
  const [timeframe, setTimeframe] = useState("30")
  const [selectedRegion, setSelectedRegion] = useState("all")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Advanced Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Predictive modeling and risk assessment for environmental intelligence
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Analytics Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="predictions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictions">Predictive Models</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Forecast Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Forecast Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Time Frame</label>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                      <SelectItem value="365">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Region</label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="west">West Africa</SelectItem>
                      <SelectItem value="east">East Africa</SelectItem>
                      <SelectItem value="central">Central Africa</SelectItem>
                      <SelectItem value="north">North Africa</SelectItem>
                      <SelectItem value="south">Southern Africa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Forecast
                </Button>
              </CardContent>
            </Card>

            {/* Prediction Results */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  {timeframe}-Day Environmental Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">Predictive Analytics Chart</p>
                    <p className="text-sm text-muted-foreground mt-2">Environmental trends and forecasts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Model Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Model Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {predictiveModels.map((model, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{model.name}</h4>
                      <Badge variant={model.status === "Active" ? "default" : "secondary"}>{model.status}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Accuracy</span>
                        <span>{model.accuracy}%</span>
                      </div>
                      <Progress value={model.accuracy} className="h-2" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>{model.predictions} predictions made</p>
                      <p>Updated: {model.lastUpdated}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Environmental Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {riskAssessments.map((risk, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{risk.region}</h4>
                      <Badge
                        variant={
                          risk.risk === "High" ? "destructive" : risk.risk === "Medium" ? "secondary" : "outline"
                        }
                      >
                        {risk.risk} Risk
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Risk Type:</span>
                        <span className="font-medium">{risk.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Timeframe:</span>
                        <span className="font-medium">{risk.timeframe}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Impact Level:</span>
                        <span className="font-medium">{risk.impact}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Probability</span>
                        <span>{risk.probability}%</span>
                      </div>
                      <Progress value={risk.probability} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Risk Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Risk Trend Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">Risk Trend Chart</p>
                    <p className="text-sm text-muted-foreground mt-2">Historical and projected risk levels</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Anomaly Detection */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Real-time Anomaly Detection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {anomalies.map((anomaly, index) => (
                  <div key={index} className="border-l-4 border-l-destructive pl-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{anomaly.type}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            anomaly.severity === "High"
                              ? "destructive"
                              : anomaly.severity === "Medium"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {anomaly.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{anomaly.detected}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{anomaly.location}</p>
                    <p className="text-sm">{anomaly.deviation}</p>
                    <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                      Investigate
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Detection Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Detection Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Temperature Alerts</span>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rainfall Monitoring</span>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Vegetation Changes</span>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Air Quality Spikes</span>
                    <Badge variant="secondary">Paused</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Sensitivity Levels</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Temperature</span>
                      <span>High (±2°C)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Rainfall</span>
                      <span>Medium (±20%)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Vegetation</span>
                      <span>Low (±10%)</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full" size="sm">
                  Configure Alerts
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
