import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { ProjectLocation } from '@/types/project';

export const useMapInstance = (
  containerRef: React.RefObject<HTMLDivElement>,
  initialLocation?: ProjectLocation
) => {
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHRxbXd4Z2gwMG5qMmtvMGw2Z3B4amF2In0.a9qmZUxfGGpXk2NqK-edKA';
    
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