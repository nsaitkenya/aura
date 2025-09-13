"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  TreePine,
  Droplets,
  Wind,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  MapPin,
  Users,
  Zap,
  Thermometer,
  Leaf,
} from "lucide-react"
import InteractiveMap from "@/components/InteractiveMap"

const stats = [
  {
    title: "Forest Coverage",
    value: "68.2%",
    change: "+2.3%",
    period: "vs last month",
    trend: "up",
    icon: TreePine,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    grade: "A",
  },
  {
    title: "Water Quality Index",
    value: "7.8/10",
    change: "+0.4",
    period: "improving",
    trend: "up",
    icon: Droplets,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    grade: "B+",
  },
  {
    title: "Average Temperature",
    value: "24.5°C",
    change: "+1.2°C",
    period: "seasonal normal",
    trend: "stable",
    icon: Thermometer,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    grade: "B",
  },
  {
    title: "Air Quality",
    value: "Good",
    change: "5 AQI",
    period: "last 7 days",
    trend: "up",
    icon: Wind,
    color: "text-green-600",
    bgColor: "bg-green-50",
    grade: "A-",
  },
  {
    title: "Active Users",
    value: "24,847",
    change: "+1,234",
    period: "this month",
    trend: "up",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    grade: "A+",
  },
  {
    title: "Carbon Offset",
    value: "847 tons",
    change: "+23%",
    period: "CO₂ equivalent",
    trend: "up",
    icon: Leaf,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    grade: "A",
  },
]

const alerts = [
  {
    type: "warning",
    title: "Northern Kenya",
    description: "Drought conditions detected",
    time: "2 hours ago",
    severity: "Medium",
    category: "Climate",
  },
  {
    type: "success",
    title: "Southern Ghana",
    description: "Improved forest coverage",
    time: "1 day ago",
    severity: "Good News",
    category: "Conservation",
  },
  {
    type: "critical",
    title: "Central Nigeria",
    description: "Air quality deteriorating",
    time: "3 hours ago",
    severity: "High",
    category: "Pollution",
  },
]

const regionalData = [
  { region: "West Africa", score: 78, trend: "up", color: "bg-green-500" },
  { region: "East Africa", score: 65, trend: "stable", color: "bg-yellow-500" },
  { region: "Central Africa", score: 82, trend: "up", color: "bg-green-500" },
  { region: "Southern Africa", score: 71, trend: "down", color: "bg-orange-500" },
  { region: "North Africa", score: 59, trend: "up", color: "bg-yellow-500" },
]

export function Dashboard() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-balance bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
          Welcome to AURA
        </h1>
        <p className="text-xl text-muted-foreground text-balance">
          AI-Powered Unified Resilience Platform for Africa - Your gateway to environmental intelligence, sustainable
          agriculture, and community-driven conservation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div
                className={`absolute top-0 right-0 w-20 h-20 ${stat.bgColor} rounded-full -translate-y-10 translate-x-10 opacity-20`}
              />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <Badge variant="outline" className="text-xs">
                      {stat.grade}
                    </Badge>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm">
                  {stat.trend === "up" && <TrendingUp className="w-4 h-4 mr-1 text-emerald-600" />}
                  {stat.trend === "down" && <TrendingDown className="w-4 h-4 mr-1 text-red-600" />}
                  <span
                    className={
                      stat.trend === "up"
                        ? "text-emerald-600"
                        : stat.trend === "down"
                          ? "text-red-600"
                          : "text-muted-foreground"
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="ml-1 text-muted-foreground">{stat.period}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enhanced Interactive Map */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-xl">
                <Zap className="w-6 h-6 mr-2 text-emerald-600" />
                Africa Environmental Intelligence
              </CardTitle>
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Real-time Data</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Data Layer Controls */}
            <div className="flex flex-wrap gap-2">
              {["Water Quality", "Temperature", "Rainfall", "Vegetation", "Air Quality"].map((layer) => (
                <Button key={layer} variant="outline" size="sm" className="text-xs bg-transparent">
                  {layer}
                </Button>
              ))}
            </div>

            {/* Interactive Map Component */}
            <InteractiveMap />
          </CardContent>
        </Card>

        {/* Enhanced Alerts Panel */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
                Live Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50 to-transparent"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant={
                        alert.type === "critical" ? "destructive" : alert.type === "warning" ? "secondary" : "default"
                      }
                    >
                      {alert.severity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-emerald-800">{alert.title}</h4>
                  <p className="text-xs text-muted-foreground mb-1">{alert.category}</p>
                  <p className="text-sm">{alert.description}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View All Alerts
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Regional Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {regionalData.map((region) => (
                <div key={region.region} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{region.region}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{region.score}%</span>
                      {region.trend === "up" && <TrendingUp className="w-3 h-3 text-emerald-600" />}
                      {region.trend === "down" && <TrendingDown className="w-3 h-3 text-red-600" />}
                    </div>
                  </div>
                  <Progress value={region.score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
