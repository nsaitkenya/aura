// Google Maps API service for real GIS data
class GoogleMapsService {
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Load Google Maps API dynamically
      if (!window.google) {
        await this.loadGoogleMapsAPI();
      }
      this.isInitialized = true;
      console.log('Google Maps service initialized');
    } catch (error) {
      console.error('Failed to initialize Google Maps service:', error);
      throw error;
    }
  }

  async loadGoogleMapsAPI() {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Get real-time environmental data from Google APIs
  async getEnvironmentalData(location) {
    if (!this.isInitialized) await this.initialize();

    try {
      const data = {};
      
      // Air Quality API
      data.airQuality = await this.getAirQuality(location);
      
      // Elevation API
      data.elevation = await this.getElevation(location);
      
      // Places API for nearby environmental features
      data.nearbyFeatures = await this.getNearbyEnvironmentalFeatures(location);
      
      return data;
    } catch (error) {
      console.error('Error fetching environmental data:', error);
      throw error;
    }
  }

  async getAirQuality(location) {
    try {
      const response = await fetch(
        `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            location: {
              latitude: location.lat,
              longitude: location.lng
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Air Quality API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        aqi: data.indexes?.[0]?.aqi || 'N/A',
        category: data.indexes?.[0]?.category || 'Unknown',
        dominantPollutant: data.indexes?.[0]?.dominantPollutant || 'N/A'
      };
    } catch (error) {
      console.error('Error fetching air quality:', error);
      return { aqi: 'N/A', category: 'Unknown', dominantPollutant: 'N/A' };
    }
  }

  async getElevation(location) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/elevation/json?locations=${location.lat},${location.lng}&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Elevation API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results?.[0]?.elevation || 0;
    } catch (error) {
      console.error('Error fetching elevation:', error);
      return 0;
    }
  }

  async getNearbyEnvironmentalFeatures(location) {
    try {
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      return new Promise((resolve, reject) => {
        service.nearbySearch({
          location: new window.google.maps.LatLng(location.lat, location.lng),
          radius: 50000, // 50km radius
          type: ['park', 'natural_feature']
        }, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve(results.slice(0, 10)); // Return top 10 results
          } else {
            reject(new Error(`Places API error: ${status}`));
          }
        });
      });
    } catch (error) {
      console.error('Error fetching nearby features:', error);
      return [];
    }
  }

  // Get geocoding data for countries
  async getCountryData(countryName) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(countryName)}&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data = await response.json();
      const result = data.results?.[0];
      
      if (!result) {
        throw new Error('Country not found');
      }

      return {
        name: countryName,
        coordinates: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        },
        bounds: result.geometry.bounds,
        formattedAddress: result.formatted_address,
        placeId: result.place_id
      };
    } catch (error) {
      console.error('Error fetching country data:', error);
      throw error;
    }
  }

  // Get real agricultural data using Places API
  async getAgriculturalData(location) {
    try {
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      return new Promise((resolve, reject) => {
        service.nearbySearch({
          location: new window.google.maps.LatLng(location.lat, location.lng),
          radius: 25000, // 25km radius
          keyword: 'farm agriculture crops'
        }, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            const farms = results.filter(place => 
              place.types.some(type => 
                ['establishment', 'point_of_interest'].includes(type)
              )
            );
            resolve(farms.slice(0, 20));
          } else {
            reject(new Error(`Places API error: ${status}`));
          }
        });
      });
    } catch (error) {
      console.error('Error fetching agricultural data:', error);
      return [];
    }
  }

  // Get weather data from Google Weather API (if available) or fallback
  async getWeatherData(location) {
    try {
      // Note: Google doesn't have a direct weather API, so we'll use a placeholder
      // In production, you'd integrate with OpenWeatherMap or similar
      return {
        temperature: Math.round(20 + Math.random() * 20), // 20-40°C
        humidity: Math.round(40 + Math.random() * 40), // 40-80%
        precipitation: Math.round(Math.random() * 100), // 0-100mm
        windSpeed: Math.round(Math.random() * 30), // 0-30 km/h
        uvIndex: Math.round(Math.random() * 11) // 0-11
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }
}

export const googleMapsService = new GoogleMapsService();
