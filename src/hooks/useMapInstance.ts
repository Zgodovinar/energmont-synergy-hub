import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ProjectLocation } from '@/types/project';
import { supabase } from '@/integrations/supabase/client';

export const useMapInstance = (
  containerRef: React.RefObject<HTMLDivElement>,
  initialLocation?: ProjectLocation
) => {
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      if (!containerRef.current || mapInstance.current) return;

      try {
        // Fetch the token from Supabase Edge Function
        const { data: { token }, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error || !token) {
          console.error('Error fetching Mapbox token:', error);
          return;
        }

        // Set the access token
        mapboxgl.accessToken = token;

        const initialCoordinates = initialLocation 
          ? [initialLocation.lng, initialLocation.lat]
          : [14.5058, 46.0569]; // Default to Ljubljana, Slovenia

        // Create map instance
        const map = new mapboxgl.Map({
          container: containerRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: initialCoordinates as [number, number],
          zoom: 12,
          maxZoom: 17,
          minZoom: 3,
          trackResize: true,
          preserveDrawingBuffer: true // This helps with certain WebGL contexts
        });

        // Wait for map to load before doing anything else
        await new Promise<void>((resolve) => {
          map.once('load', () => {
            if (isMounted) {
              resolve();
            }
          });
        });

        if (!isMounted) {
          map.remove();
          return;
        }

        // Store the map instance
        mapInstance.current = map;

        // Add navigation controls after map is loaded
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add initial marker if location exists
        if (initialLocation) {
          markerRef.current = new mapboxgl.Marker({
            draggable: false
          })
            .setLngLat([initialLocation.lng, initialLocation.lat])
            .addTo(map);
        }

        // Force a resize and mark map as ready
        map.resize();
        setIsMapReady(true);

      } catch (error) {
        console.error('Error initializing map:', error);
        setIsMapReady(false);
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      isMounted = false;
      
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

      setIsMapReady(false);
    };
  }, []);

  return { mapInstance, markerRef, isMapReady };
};