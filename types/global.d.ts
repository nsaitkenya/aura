// Global type declarations for Google Maps and Earth Engine APIs

declare global {
  interface Window {
    google: typeof google;
    ee: any;
    mapboxgl: any;
  }

  // Mapbox GL JS types
  namespace mapboxgl {
    interface Map {
      addControl(control: any): void;
      addSource(id: string, source: any): void;
      addLayer(layer: any): void;
      removeLayer(id: string): void;
      removeSource(id: string): void;
      getSource(id: string): any;
      setCenter(center: [number, number]): void;
      setZoom(zoom: number): void;
      on(event: string, callback: (e: any) => void): void;
    }

    interface NavigationControl {
      new(): NavigationControl;
    }
  }

  namespace google {
    namespace maps {
      class Map {
        constructor(mapDiv: Element | null, opts?: MapOptions);
        overlayMapTypes: MVCArray<MapType>;
        addListener(eventName: string, handler: (event: any) => void): MapsEventListener;
      }

      interface MapOptions {
        center?: LatLng | LatLngLiteral;
        zoom?: number;
        mapTypeId?: MapTypeId | string;
        mapId?: string;
      }

      interface LatLng {
        lat(): number;
        lng(): number;
      }

      interface LatLngLiteral {
        lat: number;
        lng: number;
      }

      interface MVCArray<T> {
        clear(): void;
        push(elem: T): number;
        insertAt(i: number, elem: T): void;
      }

      interface MapType {}
      interface MapsEventListener {}

      enum MapTypeId {
        HYBRID = 'hybrid',
        ROADMAP = 'roadmap',
        SATELLITE = 'satellite',
        TERRAIN = 'terrain'
      }
    }
  }
}

export {};
