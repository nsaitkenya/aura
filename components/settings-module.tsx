"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Bell,
  Globe,
  Key,
  Database,
  Wifi,
  WifiOff,
  Download,
  Upload,
  Shield,
  Palette,
  Moon,
  Sun,
} from "lucide-react"

const notificationSettings = [
  { id: "deforestation", label: "Deforestation Alerts", enabled: true, type: "Critical" },
  { id: "weather", label: "Weather Warnings", enabled: true, type: "Important" },
  { id: "crop", label: "Crop Health Updates", enabled: false, type: "Normal" },
  { id: "community", label: "Community Posts", enabled: true, type: "Social" },
  { id: "learning", label: "Learning Reminders", enabled: false, type: "Educational" },
]

const apiIntegrations = [
  { name: "Weather API", status: "Connected", lastSync: "2 minutes ago", provider: "OpenWeather" },
  { name: "Satellite Data", status: "Connected", lastSync: "1 hour ago", provider: "NASA MODIS" },
  { name: "Agricultural Data", status: "Disconnected", lastSync: "Never", provider: "FAO" },
  { name: "Carbon Credits", status: "Connected", lastSync: "6 hours ago", provider: "Verra Registry" },
]

export function SettingsModule() {
  const [language, setLanguage] = useState("en")
  const [theme, setTheme] = useState("light")
  const [offlineMode, setOfflineMode] = useState(false)
  const [notifications, setNotifications] = useState(notificationSettings)

  const toggleNotification = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, enabled: !notif.enabled } : notif)))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account, preferences, and system configuration</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Settings
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Import Settings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="language">Language</TabsTrigger>
          <TabsTrigger value="offline">Offline Mode</TabsTrigger>
          <TabsTrigger value="integrations">API & Data</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Change Photo</Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input defaultValue="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="john.doe@example.com" type="email" />
                </div>

                <div className="space-y-2">
                  <Label>Organization</Label>
                  <Input defaultValue="Environmental Research Institute" />
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input defaultValue="Nairobi, Kenya" />
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    defaultValue="Environmental scientist focused on climate change adaptation in East Africa."
                    rows={3}
                  />
                </div>

                <Button className="w-full">Save Changes</Button>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Appearance & Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center">
                          <Sun className="w-4 h-4 mr-2" />
                          Light Mode
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center">
                          <Moon className="w-4 h-4 mr-2" />
                          Dark Mode
                        </div>
                      </SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Default Dashboard View</Label>
                  <Select defaultValue="environmental">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="environmental">Environmental Dashboard</SelectItem>
                      <SelectItem value="agriculture">Agriculture Hub</SelectItem>
                      <SelectItem value="conservation">Conservation Module</SelectItem>
                      <SelectItem value="community">Community Hub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Map Default View</Label>
                  <Select defaultValue="satellite">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="satellite">Satellite View</SelectItem>
                      <SelectItem value="terrain">Terrain View</SelectItem>
                      <SelectItem value="hybrid">Hybrid View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-refresh Data</Label>
                    <p className="text-xs text-muted-foreground">Automatically update environmental data</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Tooltips</Label>
                    <p className="text-xs text-muted-foreground">Display helpful hints and explanations</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Alert Types</h3>
                  {notifications.map((notif) => (
                    <div key={notif.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{notif.label}</p>
                        <p className="text-xs text-muted-foreground">{notif.type}</p>
                      </div>
                      <Switch checked={notif.enabled} onCheckedChange={() => toggleNotification(notif.id)} />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Delivery Methods</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive alerts via email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>SMS Alerts</Label>
                        <p className="text-xs text-muted-foreground">Critical alerts via SMS</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-xs text-muted-foreground">Browser and mobile notifications</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Quiet Hours</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">From</Label>
                        <Input type="time" defaultValue="22:00" />
                      </div>
                      <div>
                        <Label className="text-xs">To</Label>
                        <Input type="time" defaultValue="07:00" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Language & Localization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label>Interface Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français (French)</SelectItem>
                        <SelectItem value="ar">العربية (Arabic)</SelectItem>
                        <SelectItem value="sw">Kiswahili (Swahili)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Region</Label>
                    <Select defaultValue="africa">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="africa">Africa</SelectItem>
                        <SelectItem value="west-africa">West Africa</SelectItem>
                        <SelectItem value="east-africa">East Africa</SelectItem>
                        <SelectItem value="central-africa">Central Africa</SelectItem>
                        <SelectItem value="north-africa">North Africa</SelectItem>
                        <SelectItem value="southern-africa">Southern Africa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Date Format</Label>
                    <Select defaultValue="dd/mm/yyyy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label>Units</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Temperature</span>
                        <Select defaultValue="celsius">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="celsius">Celsius (°C)</SelectItem>
                            <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Distance</span>
                        <Select defaultValue="metric">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="metric">Metric (km)</SelectItem>
                            <SelectItem value="imperial">Imperial (mi)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Area</span>
                        <Select defaultValue="hectares">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hectares">Hectares</SelectItem>
                            <SelectItem value="acres">Acres</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-translate Content</Label>
                      <p className="text-xs text-muted-foreground">Automatically translate community posts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {offlineMode ? <WifiOff className="w-5 h-5 mr-2" /> : <Wifi className="w-5 h-5 mr-2" />}
                Offline Mode Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <Label>Enable Offline Mode</Label>
                  <p className="text-xs text-muted-foreground">Access core features without internet connection</p>
                </div>
                <Switch checked={offlineMode} onCheckedChange={setOfflineMode} />
              </div>

              {offlineMode && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h3 className="font-medium">Offline Data Storage</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Environmental Data</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Map Tiles</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Community Posts</span>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Learning Materials</span>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-medium">Storage Usage</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Maps & Tiles</span>
                          <span>245 MB</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Environmental Data</span>
                          <span>89 MB</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Learning Content</span>
                          <span>156 MB</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Total Used</span>
                          <span>490 MB</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent" size="sm">
                        Clear Offline Data
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Sync Settings</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm">Auto-sync when online</span>
                          <p className="text-xs text-muted-foreground">
                            Automatically sync data when connection is restored
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm">Sync on WiFi only</span>
                          <p className="text-xs text-muted-foreground">Avoid mobile data usage for syncing</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                API Integrations & Data Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {apiIntegrations.map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm">{integration.name}</h4>
                      <p className="text-xs text-muted-foreground">Provider: {integration.provider}</p>
                      <p className="text-xs text-muted-foreground">Last sync: {integration.lastSync}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={integration.status === "Connected" ? "default" : "destructive"}>
                        {integration.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        {integration.status === "Connected" ? "Configure" : "Connect"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Add New Integration</h3>
                <div className="flex items-center space-x-2">
                  <Input placeholder="API endpoint URL" className="flex-1" />
                  <Button>Add Integration</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Current Password</Label>
                  <Input type="password" placeholder="Enter current password" />
                </div>
                <div className="space-y-3">
                  <Label>New Password</Label>
                  <Input type="password" placeholder="Enter new password" />
                </div>
                <div className="space-y-3">
                  <Label>Confirm Password</Label>
                  <Input type="password" placeholder="Confirm new password" />
                </div>
                <Button className="w-full">Update Password</Button>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-xs text-muted-foreground">Add extra security to your account</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Login Notifications</Label>
                      <p className="text-xs text-muted-foreground">Get notified of new login attempts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  API Keys & Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Personal API Key</Label>
                  <div className="flex items-center space-x-2">
                    <Input value="aura_pk_1234567890abcdef" readOnly className="font-mono text-xs" />
                    <Button size="sm" variant="outline">
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Use this key to access AURA API programmatically</p>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  Generate New API Key
                </Button>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-sm mb-3">Active Sessions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-xs text-muted-foreground">Chrome on Windows • Nairobi, Kenya</p>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">Mobile App</p>
                        <p className="text-xs text-muted-foreground">Android • Last seen 2 hours ago</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Revoke
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
