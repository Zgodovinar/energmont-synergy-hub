import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { ProjectLocation } from '@/types/project';
import { supabase } from '@/integrations/supabase/client';

export const useMapInstance = (
  containerRef: React.RefObject<HTMLDivElement>,
  initialLocation?: ProjectLocation
) => {
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      if (!containerRef.current) return;

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
          minZoom: 3
        });

        // Wait for map to load before doing anything else
        await new Promise((resolve) => {
          map.on('load', resolve);
        });

        if (!isMounted) {
          map.remove();
          return;
        }

        mapInstance.current = map;

        // Add navigation controls after map is loaded
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add initial marker if location exists
        if (initialLocation) {
          markerRef.current = new mapboxgl.Marker()
            .setLngLat([initialLocation.lng, initialLocation.lat])
            .addTo(map);
        }

      } catch (error) {
        console.error('Error initializing map:', error);
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
    };
  }, []);

  return { mapInstance, markerRef };
};