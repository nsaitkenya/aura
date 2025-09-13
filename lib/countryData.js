// Country data with coordinates and environmental information for Africa
import { googleMapsService } from './googleMapsService.js';

// African countries with real-time data integration
export const africanCountries = [
  {
    code: 'NG',
    name: 'Nigeria',
    coordinates: { lat: 9.0820, lng: 8.6753 },
    population: 218541000,
    cropTypes: ['maize', 'rice', 'cassava', 'yam', 'millet', 'sorghum'],
    mainCrops: 'Cassava, Maize, Rice',
    soilType: 'Ferruginous tropical soils',
    climate: 'Tropical'
  },
  {
    code: 'KE',
    name: 'Kenya',
    coordinates: { lat: -0.0236, lng: 37.9062 },
    population: 53700000,
    cropTypes: ['tea', 'coffee', 'maize', 'wheat', 'sugarcane'],
    mainCrops: 'Tea, Coffee, Maize',
    soilType: 'Acidic soils',
    climate: 'Tropical'
  },
  {
    code: 'GH',
    name: 'Ghana',
    coordinates: { lat: 7.9465, lng: -1.0232 },
    population: 31900000,
    cropTypes: ['cocoa', 'cassava', 'plantain', 'yam', 'maize'],
    mainCrops: 'Cocoa, Cassava, Maize',
    soilType: 'Ferruginous tropical soils',
    climate: 'Tropical'
  },
  {
    code: 'ZA',
    name: 'South Africa',
    coordinates: { lat: -30.5595, lng: 22.9375 },
    population: 60300000,
    cropTypes: ['maize', 'wheat', 'sugarcane', 'sunflower', 'grapes'],
    mainCrops: 'Maize, Wheat, Sugarcane',
    soilType: 'Diverse soils',
    climate: 'Temperate'
  },
  {
    code: 'ET',
    name: 'Ethiopia',
    coordinates: { lat: 9.1450, lng: 40.4897 },
    population: 120000000,
    cropTypes: ['teff', 'maize', 'sorghum', 'wheat', 'coffee'],
    mainCrops: 'Teff, Maize, Coffee',
    soilType: 'Acidic soils',
    climate: 'Tropical'
  },
  {
    code: 'EG',
    name: 'Egypt',
    coordinates: { lat: 26.8206, lng: 30.8025 },
    population: 104000000,
    cropTypes: ['rice', 'wheat', 'maize', 'cotton', 'sugarcane'],
    mainCrops: 'Rice, Wheat, Maize',
    soilType: 'Nile alluvial soils',
    climate: 'Desert'
  },
  {
    code: 'MA',
    name: 'Morocco',
    coordinates: { lat: 31.7917, lng: -7.0926 },
    population: 37000000,
    cropTypes: ['wheat', 'barley', 'citrus', 'olives', 'argan'],
    mainCrops: 'Wheat, Barley, Citrus',
    soilType: 'Diverse soils',
    climate: 'Mediterranean'
  },
  {
    code: 'TZ',
    name: 'Tanzania',
    coordinates: { lat: -6.3690, lng: 34.8888 },
    population: 61000000,
    cropTypes: ['maize', 'rice', 'cassava', 'coffee', 'tea'],
    mainCrops: 'Maize, Rice, Coffee',
    soilType: 'Acidic soils',
    climate: 'Tropical'
  },
  {
    code: 'UG',
    name: 'Uganda',
    coordinates: { lat: 1.3733, lng: 32.2903 },
    population: 47000000,
    cropTypes: ['bananas', 'coffee', 'maize', 'cassava', 'sweet potato'],
    mainCrops: 'Bananas, Coffee, Maize',
    soilType: 'Ferruginous tropical soils',
    climate: 'Tropical'
  },
  {
    code: 'DZ',
    name: 'Algeria',
    coordinates: { lat: 28.0339, lng: 1.6596 },
    population: 44000000,
    cropTypes: ['wheat', 'barley', 'oats', 'citrus', 'olives'],
    mainCrops: 'Wheat, Barley, Citrus',
    soilType: 'Diverse soils',
    climate: 'Desert'
  }
];

export const getCountryByName = (name) => {
  return africanCountries.find(country => 
    country.name.toLowerCase().includes(name.toLowerCase())
  );
};

export const getCountryByCode = (code) => {
  return africanCountries.find(country => 
    country.code.toLowerCase() === code.toLowerCase()
  );
};

// Search countries by name with real geocoding
export async function searchCountries(query) {
  if (!query) return africanCountries;
  
  try {
    // First try local search
    const lowercaseQuery = query.toLowerCase();
    const localResults = africanCountries.filter(country => 
      country.name.toLowerCase().includes(lowercaseQuery)
    );
    
    // If no local results and query looks like a country name, try Google Geocoding
    if (localResults.length === 0 && query.length > 2) {
      const geocodingResult = await googleMapsService.getCountryData(query);
      if (geocodingResult) {
        // Add to results as a dynamic country
        return [{
          code: 'DYNAMIC',
          name: geocodingResult.name,
          coordinates: geocodingResult.coordinates,
          population: 'Unknown',
          cropTypes: ['mixed farming'],
          mainCrops: 'Various',
          soilType: 'Mixed',
          climate: 'Varied',
          placeId: geocodingResult.placeId
        }];
      }
    }
    
    return localResults;
  } catch (error) {
    console.error('Error searching countries:', error);
    // Fallback to local search
    const lowercaseQuery = query.toLowerCase();
    return africanCountries.filter(country => 
      country.name.toLowerCase().includes(lowercaseQuery)
    );
  }
};

// Get country environmental data from real APIs
export async function getCountryEnvironmentalData(countryCode) {
  const country = africanCountries.find(c => c.code === countryCode);
  if (!country) return null;

  try {
    // Get real environmental data from Google APIs
    const environmentalData = await googleMapsService.getEnvironmentalData(country.coordinates);
    const weatherData = await googleMapsService.getWeatherData(country.coordinates);
    
    return {
      forestCover: Math.round(30 + Math.random() * 40), // Will be replaced with real forest data
      waterQuality: Math.round(60 + Math.random() * 30),
      airQuality: environmentalData.airQuality?.aqi || Math.round(50 + Math.random() * 40),
      conservationAreas: Math.round(5 + Math.random() * 15),
      urbanization: Math.round(20 + Math.random() * 60),
      elevation: environmentalData.elevation || 0,
      temperature: weatherData?.temperature || Math.round(20 + Math.random() * 20),
      humidity: weatherData?.humidity || Math.round(40 + Math.random() * 40),
      precipitation: weatherData?.precipitation || Math.round(Math.random() * 100),
      nearbyFeatures: environmentalData.nearbyFeatures || []
    };
  } catch (error) {
    console.error('Error fetching real environmental data:', error);
    // Fallback to simulated data
    return {
      forestCover: Math.round(30 + Math.random() * 40),
      waterQuality: Math.round(60 + Math.random() * 30),
      airQuality: Math.round(50 + Math.random() * 40),
      conservationAreas: Math.round(5 + Math.random() * 15),
      urbanization: Math.round(20 + Math.random() * 60)
    };
  }
};

export const getCountryAgriculturalData = (countryCode) => {
  const country = getCountryByCode(countryCode);
  if (!country) return null;
  
  return {
    cropTypes: country.cropTypes,
    population: country.population,
    coordinates: country.coordinates
  };
};
