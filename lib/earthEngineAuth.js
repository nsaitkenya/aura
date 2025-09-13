export class EarthEngineAuth {
  constructor() {
    this.isInitialized = false;
    this.isAuthenticated = false;
    this.initPromise = null;
    this.authPromise = null;
  }

  async initialize() {
    if (typeof window === 'undefined') {
      return Promise.resolve(); // Don't throw in SSR
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      if (this.isInitialized && window.ee) {
        resolve();
        return;
      }

      if (window.ee) {
        this.isInitialized = true;
        resolve();
        return;
      }

      // Check if script is already loading
      const existingScript = document.querySelector('script[src*="earthengine-api"]');
      if (existingScript) {
        existingScript.onload = () => {
          this.isInitialized = true;
          resolve();
        };
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://ajax.googleapis.com/ajax/libs/earthengine/0.1.365/earthengine-api.min.js';
      script.async = true;
      script.onload = () => {
        this.isInitialized = true;
        console.log('Earth Engine API loaded successfully');
        resolve();
      };
      script.onerror = (error) => {
        console.error('Failed to load Earth Engine API:', error);
        // Don't reject - allow maps to work without EE
        resolve();
      };
      document.head.appendChild(script);
    });

    return this.initPromise;
  }

  async authenticate() {
    if (this.authPromise) {
      return this.authPromise;
    }

    this.authPromise = this._performAuthentication();
    return this.authPromise;
  }

  async _performAuthentication() {
    try {
      await this.initialize();
      
      if (this.isAuthenticated) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        // Skip token auth for now and go straight to basic initialization
        // This avoids authentication issues in development
        window.ee.initialize(null, null, () => {
          this.isAuthenticated = true;
          console.log('Earth Engine initialized successfully');
          resolve();
        }, (error) => {
          console.warn('Earth Engine initialization failed:', error);
          // Still resolve to allow map to work without EE
          resolve();
        });
      });
    } catch (error) {
      console.error('Earth Engine authentication failed:', error);
      // Don't throw - allow maps to work without EE
      return Promise.resolve();
    }
  }

  authenticateViaPopup() {
    return new Promise((resolve, reject) => {
      window.ee.data.authenticateViaPopup((success) => {
        if (success) {
          window.ee.initialize();
          this.isAuthenticated = true;
          resolve();
        } else {
          reject(new Error('Authentication failed'));
        }
      });
    });
  }

  // Alternative authentication using service account token
  async authenticateWithToken() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const token = process.env.NEXT_PUBLIC_GOOGLE_EARTH_ENGINE_TOKEN;
      if (!token) {
        reject(new Error('No Earth Engine token provided'));
        return;
      }

      window.ee.initialize(
        null,
        null,
        () => {
          this.isAuthenticated = true;
          resolve();
        },
        reject,
        null,
        token
      );
    });
  }

  async getEnvironmentalData(bounds, analysisType) {
    if (!this.isAuthenticated || !window.ee) {
      throw new Error('Earth Engine not authenticated');
    }

    try {
      let analysis, visualization;
      const geometry = window.ee.Geometry.Rectangle([
        bounds.west, bounds.south, bounds.east, bounds.north
      ]);

      switch (analysisType) {
        case 'deforestation':
          // Hansen Global Forest Change
          const gfc = window.ee.Image('UMD/hansen/global_forest_change_2022_v1_10');
          const lossYear = gfc.select(['lossyear']);
          const loss2020Plus = lossYear.gte(20);
          
          analysis = loss2020Plus.updateMask(loss2020Plus).clip(geometry);
          visualization = { palette: ['red'] };
          break;

        case 'water_quality':
          // Water occurrence
          const water = window.ee.Image('JRC/GSW1_4/GlobalSurfaceWater');
          analysis = water.select('occurrence').clip(geometry);
          visualization = {
            min: 0, max: 100,
            palette: ['white', 'lightblue', 'blue', 'darkblue']
          };
          break;

        case 'air_quality':
          // Sentinel-5P NO2
          const no2 = window.ee.ImageCollection('COPERNICUS/S5P/NRTI/L3_NO2')
            .filterBounds(geometry)
            .filterDate('2024-01-01', '2024-12-31')
            .select('NO2_column_number_density')
            .mean();
          
          analysis = no2.clip(geometry);
          visualization = {
            min: 0, max: 0.0002,
            palette: ['blue', 'green', 'yellow', 'orange', 'red']
          };
          break;

        case 'land_use':
          // ESA WorldCover
          const landcover = window.ee.Image('ESA/WorldCover/v200/2021');
          analysis = landcover.clip(geometry);
          visualization = {
            min: 10, max: 95,
            palette: [
              '006400', 'ffbb22', 'ffff4c', 'f096ff', 'fa0000',
              'b4b4b4', 'f0f0f0', '0064c8', '0096a0', '00cf75', 'fae6a0'
            ]
          };
          break;

        case 'vegetation':
          // MODIS NDVI
          const ndvi = window.ee.ImageCollection('MODIS/061/MOD13A2')
            .filterBounds(geometry)
            .filterDate('2024-01-01', '2024-12-31')
            .select('NDVI')
            .mean();
          
          analysis = ndvi.clip(geometry);
          visualization = {
            min: 0, max: 9000,
            palette: ['FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163',
                     '99B718', '74A901', '66A000', '529400', '3E8601',
                     '207401', '056201', '004C00', '023B01', '012E01',
                     '011D01', '011301']
          };
          break;

        case 'rainfall':
          // CHIRPS Daily Precipitation
          const chirps = window.ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
            .filterBounds(geometry)
            .filterDate('2024-01-01', '2024-12-31')
            .select('precipitation')
            .mean();
          
          analysis = chirps.clip(geometry);
          visualization = {
            min: 0, max: 50,
            palette: ['white', 'lightblue', 'blue', 'darkblue', 'purple']
          };
          break;

        case 'temperature':
          // MODIS Land Surface Temperature
          const lst = window.ee.ImageCollection('MODIS/061/MOD11A2')
            .filterBounds(geometry)
            .filterDate('2024-01-01', '2024-12-31')
            .select('LST_Day_1km')
            .mean()
            .multiply(0.02)
            .subtract(273.15);
          
          analysis = lst.clip(geometry);
          visualization = {
            min: 0, max: 50,
            palette: ['blue', 'cyan', 'green', 'yellow', 'orange', 'red']
          };
          break;

        default:
          throw new Error(`Unknown analysis type: ${analysisType}`);
      }

      return analysis.getMap(visualization);
    } catch (error) {
      console.error('Error getting environmental data:', error);
      throw error;
    }
  }

  async getCropAnalysis(bounds, cropType) {
    if (!this.isAuthenticated || !window.ee) {
      throw new Error('Earth Engine not authenticated');
    }

    try {
      const geometry = window.ee.Geometry.Rectangle([
        bounds.west, bounds.south, bounds.east, bounds.north
      ]);

      let analysis, visualization;

      switch (cropType) {
        case 'ndvi':
          // Sentinel-2 NDVI
          const sentinel2 = window.ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
            .filterBounds(geometry)
            .filterDate('2024-01-01', '2024-12-31')
            .filter(window.ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
            .median();
          
          const ndvi = sentinel2.normalizedDifference(['B8', 'B4']).rename('NDVI');
          analysis = ndvi.clip(geometry);
          visualization = {
            min: -1, max: 1,
            palette: ['red', 'yellow', 'green']
          };
          break;

        case 'soil_moisture':
          // SMAP Soil Moisture
          const soilMoisture = window.ee.ImageCollection('NASA_USDA/HSL/SMAP10KM_soil_moisture')
            .filterBounds(geometry)
            .filterDate('2024-01-01', '2024-12-31')
            .select('ssm')
            .mean();
          
          analysis = soilMoisture.clip(geometry);
          visualization = {
            min: 0, max: 0.5,
            palette: ['brown', 'yellow', 'lightgreen', 'green', 'blue']
          };
          break;

        case 'temperature':
          // MODIS Land Surface Temperature
          const lst = window.ee.ImageCollection('MODIS/061/MOD11A2')
            .filterBounds(geometry)
            .filterDate('2024-01-01', '2024-12-31')
            .select('LST_Day_1km')
            .mean()
            .multiply(0.02)
            .subtract(273.15);
          
          analysis = lst.clip(geometry);
          visualization = {
            min: 0, max: 50,
            palette: ['blue', 'cyan', 'green', 'yellow', 'orange', 'red']
          };
          break;

        case 'precipitation':
          // CHIRPS Precipitation
          const chirps = window.ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
            .filterBounds(geometry)
            .filterDate('2024-01-01', '2024-12-31')
            .select('precipitation')
            .sum();
          
          analysis = chirps.clip(geometry);
          visualization = {
            min: 0, max: 2000,
            palette: ['white', 'lightblue', 'blue', 'darkblue', 'purple']
          };
          break;

        case 'crop_health':
          // Enhanced Vegetation Index (EVI)
          const s2 = window.ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
            .filterBounds(geometry)
            .filterDate('2024-01-01', '2024-12-31')
            .filter(window.ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
            .median();
          
          const evi = s2.expression(
            '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
              'NIR': s2.select('B8'),
              'RED': s2.select('B4'),
              'BLUE': s2.select('B2')
            }).rename('EVI');
          
          analysis = evi.clip(geometry);
          visualization = {
            min: -1, max: 1,
            palette: ['red', 'orange', 'yellow', 'lightgreen', 'green', 'darkgreen']
          };
          break;

        default:
          throw new Error(`Unknown crop analysis type: ${cropType}`);
      }

      return analysis.getMap(visualization);
    } catch (error) {
      console.error('Error getting crop analysis:', error);
      throw error;
    }
  }
}

export const earthEngineAuth = new EarthEngineAuth();
