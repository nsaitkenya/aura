"use client"

import { Bell, Search, Globe2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
            <Input
              placeholder="Search environmental data, locations, alerts..."
              className="pl-11 h-11 bg-emerald-50/50 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm placeholder:text-emerald-600/70"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              >
                <Globe2 className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="p-2 border-b">
                <p className="text-sm font-medium text-emerald-700">Select Language</p>
              </div>
              <DropdownMenuItem className="flex items-center gap-2">
                <span className="text-lg">🇬🇧</span> English
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <span className="text-lg">🇫🇷</span> Français
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <span className="text-lg">🇸🇦</span> العربية
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <span className="text-lg">🇰🇪</span> Kiswahili
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              >
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center p-0 text-xs bg-red-500 text-white border-2 border-white rounded-full">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96">
              <div className="p-4 border-b bg-emerald-50">
                <h3 className="font-semibold text-emerald-800">Environmental Alerts</h3>
                <p className="text-sm text-emerald-600">Real-time notifications from across Africa</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <DropdownMenuItem className="p-4 border-b">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="destructive" className="text-xs">
                        Critical
                      </Badge>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    <p className="font-medium text-sm">Deforestation Alert - Congo Basin</p>
                    <p className="text-xs text-muted-foreground">2.3km² forest loss detected in protected area</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-4 border-b">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="secondary" className="text-xs">
                        Warning
                      </Badge>
                      <span className="text-xs text-muted-foreground">6 hours ago</span>
                    </div>
                    <p className="font-medium text-sm">Drought Conditions - East Africa</p>
                    <p className="text-xs text-muted-foreground">Rainfall 40% below seasonal average</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-4">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                        Info
                      </Badge>
                      <span className="text-xs text-muted-foreground">1 day ago</span>
                    </div>
                    <p className="font-medium text-sm">Air Quality Improvement - Lagos</p>
                    <p className="text-xs text-muted-foreground">AQI improved by 15 points this week</p>
                  </div>
                </DropdownMenuItem>
              </div>
              <div className="p-3 border-t">
                <Button
                  variant="outline"
                  className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50 bg-transparent"
                >
                  View All Alerts
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-emerald-50">
                <Avatar className="h-10 w-10 border-2 border-emerald-200">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User Avatar" />
                  <AvatarFallback className="bg-emerald-600 text-white text-sm font-semibold">AU</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-3 border-b">
                <p className="text-sm font-medium">AURA User</p>
                <p className="text-xs text-muted-foreground">Environmental Analyst</p>
              </div>
              <DropdownMenuItem>My Profile</DropdownMenuItem>
              <DropdownMenuItem>Dashboard Settings</DropdownMenuItem>
              <DropdownMenuItem>Notification Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
