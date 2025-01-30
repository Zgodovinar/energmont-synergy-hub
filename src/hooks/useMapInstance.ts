import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { ProjectLocation } from '@/types/project';

// Set the access token from environment variable
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export const useMapInstance = (
  containerRef: React.RefObject<HTMLDivElement>,
  initialLocation?: ProjectLocation
) => {
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const initialCoordinates = initialLocation 
      ? [initialLocation.lng, initialLocation.lat]
      : [14.5058, 46.0569]; // Default to Ljubljana, Slovenia

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCoordinates as [number, number],
      zoom: 12
    });

    mapInstance.current = map;

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    if (initialLocation) {
      markerRef.current = new mapboxgl.Marker()
        .setLngLat([initialLocation.lng, initialLocation.lat])
        .addTo(map);
    }

    return () => {
      map.remove();
      mapInstance.current = null;
      markerRef.current = null;
    };
  }, []);

  return { mapInstance, markerRef };
};