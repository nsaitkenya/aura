export class MapService {
  constructor() {
    this.googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    this.mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    this.isGoogleMapsLoaded = false;
    this.isMapboxLoaded = false;
    this.preferredProvider = 'google'; // Default to Google Maps
    
    // Check if we're in browser environment
    if (typeof window !== 'undefined') {
      console.log('MapService initialized with keys:', {
        googleMaps: !!this.googleMapsApiKey,
        mapbox: !!this.mapboxToken
      });
    }
  }

  async initializeMap(container, options = {}) {
    const defaultOptions = {
      center: { lat: -1.2921, lng: 36.8219 }, // Kenya coordinates
      zoom: 8,
      mapTypeId: 'satellite'
    };

    const mapOptions = { ...defaultOptions, ...options };

    try {
      // Try Google Maps first
      if (this.preferredProvider === 'google') {
        const googleMap = await this.initializeGoogleMap(container, mapOptions);
        if (googleMap) {
          console.log('Google Maps initialized successfully');
          return { map: googleMap, provider: 'google' };
        }
      }

      // Fallback to Mapbox
      console.log('Falling back to Mapbox...');
      const mapboxMap = await this.initializeMapbox(container, mapOptions);
      if (mapboxMap) {
        console.log('Mapbox initialized successfully');
        return { map: mapboxMap, provider: 'mapbox' };
      }

      throw new Error('Both Google Maps and Mapbox failed to initialize');
    } catch (error) {
      console.error('Map initialization failed:', error);
      throw error;
    }
  }

  async initializeGoogleMap(container, options) {
    try {
      console.log('Attempting to initialize Google Maps...');
      
      // Check if API key is available and valid
      if (!this.googleMapsApiKey || this.googleMapsApiKey === 'your_google_maps_api_key_here' || this.googleMapsApiKey.length < 10) {
        console.warn('Google Maps API key not configured properly or invalid');
        return null;
      }

      // Wait for Google Maps to be available or load it
      if (!window.google) {
        console.log('Loading Google Maps API...');
        try {
          await this.loadGoogleMapsScript();
        } catch (loadError) {
          console.error('Failed to load Google Maps script:', loadError);
          return null;
        }
      }

      if (!window.google || !window.google.maps) {
        console.warn('Google Maps API not available after loading');
        return null;
      }

      console.log('Creating Google Maps instance...');
      const map = new window.google.maps.Map(container, {
        center: options.center,
        zoom: options.zoom,
        mapTypeId: options.mapTypeId || 'satellite',
        styles: options.styles || [],
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        gestureHandling: 'cooperative'
      });

      // Wait for map to be ready with better error handling
      await new Promise((resolve, reject) => {
        let resolved = false;
        
        const listener = map.addListener('idle', () => {
          if (!resolved) {
            resolved = true;
            window.google.maps.event.removeListener(listener);
            console.log('Google Maps is ready');
            resolve();
          }
        });
        
        // Check for map errors
        const errorListener = map.addListener('error', (error) => {
          if (!resolved) {
            resolved = true;
            window.google.maps.event.removeListener(listener);
            window.google.maps.event.removeListener(errorListener);
            console.error('Google Maps error:', error);
            reject(error);
          }
        });
        
        // Fallback timeout
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            console.log('Google Maps ready timeout - proceeding anyway');
            resolve();
          }
        }, 8000);
      });

      this.isGoogleMapsLoaded = true;
      return map;
    } catch (error) {
      console.error('Google Maps initialization failed:', error);
      return null;
    }
  }

  async initializeMapbox(container, options) {
    try {
      if (!window.mapboxgl) {
        console.log('Loading Mapbox GL JS...');
        await this.loadMapboxScript();
      }

      if (!window.mapboxgl) {
        console.warn('Mapbox GL JS not available');
        return null;
      }

      window.mapboxgl.accessToken = this.mapboxToken;

      const map = new window.mapboxgl.Map({
        container: container,
        style: options.style || 'mapbox://styles/mapbox/satellite-v9',
        center: [options.center.lng, options.center.lat],
        zoom: options.zoom || 8
      });

      // Wait for map to load
      await new Promise((resolve, reject) => {
        map.on('load', resolve);
        map.on('error', reject);
      });

      // Add navigation controls
      map.addControl(new window.mapboxgl.NavigationControl());

      this.isMapboxLoaded = true;
      return map;
    } catch (error) {
      console.error('Mapbox initialization failed:', error);
      return null;
    }
  }

  async loadGoogleMapsScript() {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        console.log('Google Maps already loaded');
        resolve();
        return;
      }

      // Check if script is already loading
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        console.log('Google Maps script already loading, waiting...');
        let resolved = false;
        
        const handleLoad = () => {
          if (!resolved) {
            resolved = true;
            console.log('Google Maps API loaded (existing script)');
            resolve();
          }
        };
        
        const handleError = (error) => {
          if (!resolved) {
            resolved = true;
            console.error('Existing Google Maps script failed:', error);
            reject(error);
          }
        };
        
        existingScript.addEventListener('load', handleLoad);
        existingScript.addEventListener('error', handleError);
        
        // Timeout for existing script
        setTimeout(() => {
          if (!resolved && window.google && window.google.maps) {
            resolved = true;
            resolve();
          } else if (!resolved) {
            resolved = true;
            reject(new Error('Timeout waiting for existing Google Maps script'));
          }
        }, 10000);
        
        return;
      }

      console.log('Loading Google Maps script with key:', this.googleMapsApiKey?.substring(0, 10) + '...');
      
      // Use a unique callback name to avoid conflicts
      const callbackName = `initGoogleMaps_${Date.now()}`;
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.googleMapsApiKey}&libraries=visualization&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      
      let resolved = false;
      
      // Add global callback
      window[callbackName] = () => {
        if (!resolved) {
          resolved = true;
          console.log('Google Maps API loaded via callback');
          delete window[callbackName];
          resolve();
        }
      };
      
      script.onload = () => {
        console.log('Google Maps API script loaded');
        // Callback should handle this, but fallback just in case
        setTimeout(() => {
          if (!resolved && window.google && window.google.maps) {
            resolved = true;
            delete window[callbackName];
            resolve();
          }
        }, 1000);
      };
      
      script.onerror = (error) => {
        if (!resolved) {
          resolved = true;
          console.error('Failed to load Google Maps API:', error);
          delete window[callbackName];
          reject(new Error('Google Maps script failed to load'));
        }
      };
      
      // Timeout for script loading
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          console.error('Google Maps script loading timeout');
          delete window[callbackName];
          reject(new Error('Google Maps script loading timeout'));
        }
      }, 15000);
      
      document.head.appendChild(script);
    });
  }

  async loadMapboxScript() {
    return new Promise((resolve, reject) => {
      if (window.mapboxgl) {
        resolve();
        return;
      }

      // Check if script is already loading
      const existingScript = document.querySelector('script[src*="mapbox-gl"]');
      if (existingScript) {
        existingScript.onload = resolve;
        existingScript.onerror = reject;
        return;
      }

      // Load Mapbox CSS if not already loaded
      if (!document.querySelector('link[href*="mapbox-gl.css"]')) {
        const link = document.createElement('link');
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }

      // Load Mapbox JS
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
      script.onload = () => {
        console.log('Mapbox GL JS loaded');
        resolve();
      };
      script.onerror = (error) => {
        console.error('Failed to load Mapbox GL JS:', error);
        reject(error);
      };
      document.head.appendChild(script);
    });
  }

  // Add Earth Engine overlay to map
  addEarthEngineOverlay(map, provider, earthEngineLayer) {
    if (!window.ee || !earthEngineLayer) return;

    try {
      if (provider === 'google') {
        const mapId = earthEngineLayer.getMap();
        const tileSource = new window.ee.layers.EarthEngineTileSource(mapId);
        const overlay = new window.ee.layers.ImageOverlay(tileSource);
        
        map.overlayMapTypes.clear();
        map.overlayMapTypes.push(overlay);
      } else if (provider === 'mapbox') {
        // For Mapbox, we need to convert Earth Engine tiles to Mapbox format
        const mapId = earthEngineLayer.getMap();
        const tileUrl = `https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/${mapId.mapid}/tiles/{z}/{x}/{y}?token=${mapId.token}`;
        
        if (map.getSource('earth-engine-layer')) {
          map.removeLayer('earth-engine-layer');
          map.removeSource('earth-engine-layer');
        }

        map.addSource('earth-engine-layer', {
          type: 'raster',
          tiles: [tileUrl],
          tileSize: 256
        });

        map.addLayer({
          id: 'earth-engine-layer',
          type: 'raster',
          source: 'earth-engine-layer',
          paint: {}
        });
      }
    } catch (error) {
      console.error('Failed to add Earth Engine overlay:', error);
    }
  }

  // Add click handler that works with both providers
  addClickHandler(map, provider, callback) {
    if (provider === 'google') {
      map.addListener('click', (event) => {
        callback({
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        });
      });
    } else if (provider === 'mapbox') {
      map.on('click', (event) => {
        callback({
          lat: event.lngLat.lat,
          lng: event.lngLat.lng
        });
      });
    }
  }

  // Set map center that works with both providers
  setCenter(map, provider, center) {
    if (provider === 'google') {
      map.setCenter(center);
    } else if (provider === 'mapbox') {
      map.setCenter([center.lng, center.lat]);
    }
  }

  // Set zoom that works with both providers
  setZoom(map, provider, zoom) {
    if (provider === 'google') {
      map.setZoom(zoom);
    } else if (provider === 'mapbox') {
      map.setZoom(zoom);
    }
  }
}

export const mapService = new MapService();
