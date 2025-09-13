"use client"

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Satellite, Layers, Download } from "lucide-react"

export function EarthEngineMap() {
  const mapRef = useRef(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedDataset, setSelectedDataset] = useState('LANDSAT/LC08/C02/T1_L2')

  useEffect(() => {
    initializeEarthEngine()
  }, [])

  const initializeEarthEngine = async () => {
    try {
      // Load Earth Engine API
      await loadEarthEngineAPI()
      
      // Initialize authentication
      await authenticateUser()
      
      // Initialize the map
      setupMap()
    } catch (error) {
      console.error('Earth Engine initialization failed:', error)
    }
  }

  const loadEarthEngineAPI = () => {
    return new Promise((resolve, reject) => {
      if (window.ee) {
        resolve(window.ee)
        return
      }

      // Load Earth Engine API script
      const script = document.createElement('script')
      script.src = 'https://ajax.googleapis.com/ajax/libs/earthengine/0.1.365/earthengine-api.min.js'
      script.onload = () => resolve(window.ee)
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  const authenticateUser = async () => {
    return new Promise((resolve, reject) => {
      window.ee.initialize(
        process.env.NEXT_PUBLIC_EARTH_ENGINE_TOKEN,
        () => {
          setIsAuthenticated(true)
          setLoading(false)
          resolve()
        },
        reject,
        ['https://www.googleapis.com/auth/earthengine.readonly'],
        () => {
          // Handle authentication failure
          setLoading(false)
          reject('Authentication failed')
        }
      )
    })
  }

  const setupMap = () => {
    if (!mapRef.current || !window.ee || !isAuthenticated) return

    // Initialize Google Maps
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 0, lng: 20 }, // Center on Africa
      zoom: 4,
      mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID
    })

    // Add Earth Engine layers
    addEarthEngineLayer(map, selectedDataset)
  }

  const addEarthEngineLayer = (map, dataset) => {
    // Define Earth Engine computation
    const image = window.ee.ImageCollection(dataset)
      .filterDate('2023-01-01', '2023-12-31')
      .filterBounds(window.ee.Geometry.Rectangle([-25, -35, 55, 37])) // Africa bounds
      .median()

    // Visualization parameters for different datasets
    const visParams = getVisualizationParams(dataset)
    
    // Add to map
    map.overlayMapTypes.insertAt(0, 
      window.ee.layers.EarthEngineLayer({
        eeObject: image,
        visParams: visParams,
        name: dataset
      })
    )
  }

  const getVisualizationParams = (dataset) => {
    const params = {
      'LANDSAT/LC08/C02/T1_L2': {
        bands: ['SR_B4', 'SR_B3', 'SR_B2'],
        min: 0.0,
        max: 0.3,
        gamma: 1.4
      },
      'MODIS/006/MOD13Q1': {
        bands: ['NDVI'],
        min: -0.2,
        max: 1,
        palette: ['FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', 
                 '99B718', '74A901', '66A000', '529400', '3E8601', '207401', '056201', 
                 '004C00', '023B01', '012E01', '011D01', '011301']
      }
    }
    return params[dataset] || params['LANDSAT/LC08/C02/T1_L2']
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Satellite className="w-6 h-6 mr-2 text-blue-600" />
            Earth Engine Satellite Data
          </CardTitle>
          {isAuthenticated && (
            <Badge className="bg-green-100 text-green-700">Connected</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading Earth Engine...</span>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-4">
              <Button 
                variant={selectedDataset.includes('LANDSAT') ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedDataset('LANDSAT/LC08/C02/T1_L2')}
              >
                Landsat 8
              </Button>
              <Button 
                variant={selectedDataset.includes('MODIS') ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedDataset('MODIS/006/MOD13Q1')}
              >
                NDVI
              </Button>
              <Button 
                variant={selectedDataset.includes('COPERNICUS') ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedDataset('COPERNICUS/S2_SR')}
              >
                Sentinel-2
              </Button>
            </div>
            <div 
              ref={mapRef} 
              className="w-full h-96 rounded-lg border"
              style={{ minHeight: '400px' }}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}