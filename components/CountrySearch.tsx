"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Users, TreePine, Droplets, Wind } from "lucide-react"
import { searchCountries, getCountryByName } from "@/lib/countryData"

interface Country {
  name: string;
  code: string;
  coordinates: { lat: number; lng: number };
  capital: string;
  population: string;
  forestCover: number;
  waterQuality: number;
  airQuality: number;
  cropTypes: string[];
  conservationAreas: number;
  urbanization: number;
  bbox: number[][];
}

interface CountrySearchProps {
  onCountrySelect: (country: Country) => void;
  placeholder?: string;
  showDetails?: boolean;
}

export function CountrySearch({ onCountrySelect, placeholder = "Search African countries...", showDetails = true }: CountrySearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Country[]>([])
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (query.length > 0) {
      const searchResults = searchCountries(query)
      setResults(searchResults.slice(0, 5)) // Limit to 5 results
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query])

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    setQuery(country.name)
    setIsOpen(false)
    onCountrySelect(country)
  }

  const handleClear = () => {
    setQuery("")
    setSelectedCountry(null)
    setResults([])
    setIsOpen(false)
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-20"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2 text-xs"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isOpen && results.length > 0 && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto">
            <CardContent className="p-2">
              {results.map((country) => (
                <div
                  key={country.code}
                  onClick={() => handleCountrySelect(country)}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-sm">{country.name}</div>
                      <div className="text-xs text-gray-500">{country.capital}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {country.code}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Selected Country Details */}
      {selectedCountry && showDetails && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-emerald-800">{selectedCountry.name}</h3>
                <p className="text-sm text-emerald-600">{selectedCountry.capital}</p>
              </div>
              <Badge className="bg-emerald-600 text-white">
                {selectedCountry.code}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span className="text-gray-600">Population:</span>
                <span className="font-medium">{selectedCountry.population}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <TreePine className="w-4 h-4 text-green-600" />
                <span className="text-gray-600">Forest:</span>
                <span className="font-medium">{selectedCountry.forestCover}%</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600">Water Quality:</span>
                <span className="font-medium">{selectedCountry.waterQuality}/100</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Wind className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Air Quality:</span>
                <span className="font-medium">{selectedCountry.airQuality}/100</span>
              </div>
            </div>

            {selectedCountry.cropTypes && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Main Crops:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedCountry.cropTypes.slice(0, 3).map((crop) => (
                    <Badge key={crop} variant="secondary" className="text-xs">
                      {crop}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
