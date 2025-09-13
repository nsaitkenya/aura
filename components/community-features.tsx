"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Camera,
  MapPin,
  MessageSquare,
  Users,
  Trophy,
  Star,
  Upload,
  Send,
  BookOpen,
  Award,
  Target,
  Share2,
  Flag,
  Clock,
  Eye,
  ThumbsUp,
  MessageCircle,
  Satellite,
  Loader2
} from "lucide-react"
import { CountrySearch } from "@/components/CountrySearch"
import { mapService } from "@/lib/mapService"
import { googleMapsService } from "@/lib/googleMapsService"
import { africanCountries } from "@/lib/countryData"

const communityStats = [
  {
    title: "Active Members",
    value: "12,847",
    change: "+324",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Reports Submitted",
    value: "2,156",
    change: "+89",
    trend: "up",
    icon: Flag,
    color: "text-green-600",
  },
  {
    title: "Issues Resolved",
    value: "1,923",
    change: "+67",
    trend: "up",
    icon: Target,
    color: "text-purple-600",
  },
  {
    title: "Learning Hours",
    value: "45,678",
    change: "+1,234",
    trend: "up",
    icon: BookOpen,
    color: "text-orange-600",
  },
]

const forumPosts = [
  {
    id: 1,
    title: "Water pollution in Lake Victoria - urgent action needed",
    author: "Sarah Kimani",
    avatar: "/placeholder.svg?height=32&width=32",
    location: "Kisumu, Kenya",
    time: "2 hours ago",
    replies: 23,
    likes: 45,
    category: "Water Quality",
    urgent: true,
  },
  {
    id: 2,
    title: "Successful reforestation project in Northern Ghana",
    author: "Kwame Asante",
    avatar: "/placeholder.svg?height=32&width=32",
    location: "Tamale, Ghana",
    time: "5 hours ago",
    replies: 12,
    likes: 78,
    category: "Conservation",
    urgent: false,
  },
  {
    id: 3,
    title: "New sustainable farming techniques showing great results",
    author: "Amina Hassan",
    avatar: "/placeholder.svg?height=32&width=32",
    location: "Kano, Nigeria",
    time: "1 day ago",
    replies: 34,
    likes: 92,
    category: "Agriculture",
    urgent: false,
  },
]

const leaderboard = [
  {
    rank: 1,
    name: "Dr. Wangari Maathai",
    points: 2847,
    badge: "Environmental Champion",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    rank: 2,
    name: "Joseph Mbugua",
    points: 2156,
    badge: "Conservation Hero",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    rank: 3,
    name: "Fatima Al-Rashid",
    points: 1923,
    badge: "Sustainability Expert",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    rank: 4,
    name: "Emmanuel Okafor",
    points: 1678,
    badge: "Community Leader",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  { rank: 5, name: "Aisha Kone", points: 1534, badge: "Eco Warrior", avatar: "/placeholder.svg?height=40&width=40" },
]

const learningModules = [
  {
    title: "Climate Change Fundamentals",
    description: "Understanding climate science and its impact on Africa",
    duration: "45 min",
    level: "Beginner",
    progress: 75,
    enrolled: 1234,
  },
  {
    title: "Sustainable Agriculture Practices",
    description: "Modern farming techniques for environmental protection",
    duration: "60 min",
    level: "Intermediate",
    progress: 30,
    enrolled: 892,
  },
  {
    title: "Water Conservation Strategies",
    description: "Effective methods for water management and conservation",
    duration: "35 min",
    level: "Beginner",
    progress: 0,
    enrolled: 567,
  },
]

export function CommunityFeatures() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [mapProvider, setMapProvider] = useState<string>('google');
  const [reportType, setReportType] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [reportLocation, setReportLocation] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [newPost, setNewPost] = useState("")
  const [mapLoading, setMapLoading] = useState(true);

  useEffect(() => {
    initializeCommunityMap();
    // Initialize Google Maps service
    googleMapsService.initialize().catch(console.error);
  }, [selectedCountry]);

  const initializeCommunityMap = async () => {
    if (!mapRef.current) return;

    try {
      setMapLoading(true);
      const center = selectedCountry ? selectedCountry.coordinates : { lat: 0.0236, lng: 37.9062 };
      const zoom = selectedCountry ? 8 : 4;
      
      const mapResult = await mapService.initializeMap(mapRef.current, {
        center,
        zoom,
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'all',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      });

      // Load real community data
      await loadCommunityData(mapResult.map, center);

      setMapInstance(mapResult.map);
      setMapProvider(mapResult.provider);
      
      // Add sample report markers
      addCommunityReportMarkers(mapResult.map, mapResult.provider);
      setMapLoading(false);
    } catch (error) {
      console.error('Failed to initialize community map:', error);
      setMapLoading(false);
    }
  };

  const loadCommunityData = async (map: any, location: any) => {
    try {
      const environmentalData = await googleMapsService.getEnvironmentalData(location);
      
      // Add community-relevant markers
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
                    <circle cx="10" cy="10" r="8" fill="#3b82f6" stroke="white" stroke-width="2"/>
                  </svg>
                `),
                scaledSize: new (window as any).google.maps.Size(20, 20)
              }
            });
            
            const infoWindow = new (window as any).google.maps.InfoWindow({
              content: `
                <div style="padding: 10px;">
                  <h3 style="margin: 0 0 5px 0; font-size: 14px;">${feature.name}</h3>
                  <p style="margin: 0; font-size: 12px; color: #666;">${feature.vicinity || 'Community location'}</p>
                  <p style="margin: 5px 0 0 0; font-size: 11px; color: #888;">Type: ${feature.types?.[0] || 'Community feature'}</p>
                </div>
              `
            });
            
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
          }
        });
      }
    } catch (error) {
      console.error('Error loading community data:', error);
    }
  };

  const addCommunityReportMarkers = (map: any, provider: string) => {
    const sampleReports = [
      { lat: -1.2921, lng: 36.8219, type: 'pollution', severity: 'high' },
      { lat: 6.5244, lng: 3.3792, type: 'deforestation', severity: 'critical' },
      { lat: -33.9249, lng: 18.4241, type: 'waste', severity: 'medium' },
      { lat: 5.6037, lng: -0.1870, type: 'wildlife', severity: 'low' }
    ];

    if (provider === 'google' && (window as any).google) {
      sampleReports.forEach(report => {
        const color = report.severity === 'critical' ? '#ef4444' : 
                     report.severity === 'high' ? '#f97316' : 
                     report.severity === 'medium' ? '#eab308' : '#22c55e';
        
        new (window as any).google.maps.Marker({
          position: { lat: report.lat, lng: report.lng },
          map: map,
          title: `${report.type} - ${report.severity}`,
          icon: {
            path: (window as any).google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: color,
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        });
      });
    }
  };

  const handleCountrySelect = (country: any) => {
    setSelectedCountry(country);
    setReportLocation(`${country.name}`);
  };

  const handleSubmitReport = () => {
    // Handle report submission
    console.log("Report submitted:", { reportType, reportDescription })
    setReportType("")
    setReportDescription("")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Community Hub</h1>
          <p className="text-muted-foreground mt-1">Connect, report, learn, and make an impact together</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Trophy className="w-4 h-4 mr-2" />
            Leaderboard
          </Button>
          <Button>
            <Camera className="w-4 h-4 mr-2" />
            Report Issue
          </Button>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {communityStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> this week
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reports">Citizen Reports</TabsTrigger>
          <TabsTrigger value="forum">Community Forum</TabsTrigger>
          <TabsTrigger value="education">Learning Hub</TabsTrigger>
          <TabsTrigger value="leaderboard">Impact Leaders</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Report Submission */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  Submit Environmental Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Issue Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pollution">Water/Air Pollution</SelectItem>
                      <SelectItem value="deforestation">Illegal Deforestation</SelectItem>
                      <SelectItem value="waste">Waste Management</SelectItem>
                      <SelectItem value="wildlife">Wildlife Protection</SelectItem>
                      <SelectItem value="agriculture">Agricultural Issues</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Location</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      placeholder="Enter location or use GPS" 
                      className="flex-1"
                      value={reportLocation}
                      onChange={(e) => setReportLocation(e.target.value)}
                    />
                    <Button variant="outline" size="icon">
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe the environmental issue in detail..."
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                  <Camera className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Add photos or videos</p>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Media
                  </Button>
                </div>

                <Button onClick={handleSubmitReport} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Report
                </Button>
              </CardContent>
            </Card>

            {/* Interactive Community Reports Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Satellite className="w-5 h-5 mr-2" />
                    Community Reports Map
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedCountry ? selectedCountry.name : 'Africa Overview'}
                  </div>
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

                {/* Interactive Map */}
                {mapLoading ? (
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Loading map...</p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg overflow-hidden border">
                    <div ref={mapRef} className="w-full h-full" style={{ minHeight: '300px' }} />
                  </div>
                )}

                {/* Map Legend */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Critical</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span>High</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Medium</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Low</span>
                    </div>
                  </div>
                  <span className="text-muted-foreground">Report Severity</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forum" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Forum Posts */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Community Discussions
                  </div>
                  <Button size="sm">New Post</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* New Post Input */}
                <div className="border rounded-lg p-4 space-y-3">
                  <Textarea
                    placeholder="Share your environmental insights with the community..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Camera className="w-4 h-4 mr-1" />
                        Photo
                      </Button>
                      <Button variant="outline" size="sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        Location
                      </Button>
                    </div>
                    <Button size="sm">
                      <Send className="w-4 h-4 mr-2" />
                      Post
                    </Button>
                  </div>
                </div>

                {/* Forum Posts List */}
                {forumPosts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={post.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {post.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-sm">{post.author}</h4>
                          <Badge variant="outline" className="text-xs">
                            {post.category}
                          </Badge>
                          {post.urgent && (
                            <Badge variant="destructive" className="text-xs">
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {post.location} • {post.time}
                        </p>
                      </div>
                    </div>

                    <h3 className="font-medium">{post.title}</h3>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 hover:text-foreground">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-foreground">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.replies}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-foreground">
                          <Share2 className="w-4 h-4" />
                          <span>Share</span>
                        </button>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Forum Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Discussion Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg border">
                  <span className="text-sm font-medium">Water Quality</span>
                  <Badge variant="secondary">45 posts</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg border">
                  <span className="text-sm font-medium">Conservation</span>
                  <Badge variant="secondary">32 posts</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg border">
                  <span className="text-sm font-medium">Agriculture</span>
                  <Badge variant="secondary">28 posts</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg border">
                  <span className="text-sm font-medium">Climate Change</span>
                  <Badge variant="secondary">23 posts</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg border">
                  <span className="text-sm font-medium">Renewable Energy</span>
                  <Badge variant="secondary">19 posts</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Learning Modules */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Educational Modules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {learningModules.map((module, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{module.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {module.duration}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {module.level}
                          </Badge>
                          <span>{module.enrolled} enrolled</span>
                        </div>
                      </div>
                      <Button size="sm" variant={module.progress > 0 ? "secondary" : "default"}>
                        {module.progress > 0 ? "Continue" : "Start"}
                      </Button>
                    </div>

                    {module.progress > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Learning Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Learning Journey</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">156</div>
                  <p className="text-sm text-muted-foreground">Learning Hours</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Modules Completed</span>
                    <Badge className="bg-green-500">8/12</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Certificates Earned</span>
                    <Badge className="bg-blue-500">3</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current Streak</span>
                    <Badge className="bg-orange-500">12 days</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Recent Achievements</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span>Climate Expert Badge</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Star className="w-4 h-4 text-blue-500" />
                      <span>7-Day Learning Streak</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leaderboard */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Impact Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {leaderboard.map((user) => (
                  <div key={user.rank} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      {user.rank}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{user.name}</h4>
                      <p className="text-xs text-muted-foreground">{user.badge}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm">{user.points.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Your Impact */}
            <Card>
              <CardHeader>
                <CardTitle>Your Impact Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary">1,247</div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <Badge className="mt-2 bg-green-500">Rank #23</Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Point Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Reports Submitted</span>
                      <span className="font-medium">+450</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Forum Contributions</span>
                      <span className="font-medium">+320</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Learning Completed</span>
                      <span className="font-medium">+280</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Community Helps</span>
                      <span className="font-medium">+197</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Next Milestone</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress to Eco Champion</span>
                      <span>753/1500</span>
                    </div>
                    <Progress value={50.2} className="h-2" />
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
