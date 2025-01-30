import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { ProjectLocation } from '@/types/project';

interface ProjectMapProps {
  onLocationSelect: (location: ProjectLocation) => void;
  initialLocation?: ProjectLocation;
}

const ProjectMap = ({ onLocationSelect, initialLocation }: ProjectMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [address, setAddress] = useState(initialLocation?.address || '');

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHRxbXd4Z2gwMG5qMmtvMGw2Z3B4amF2In0.a9qmZUxfGGpXk2NqK-edKA';
    
    const initialCoordinates = initialLocation 
      ? [initialLocation.lng, initialLocation.lat]
      : [14.5058, 46.0569]; // Default to Ljubljana, Slovenia

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCoordinates as [number, number],
      zoom: 12
    });

    map.current = mapInstance;

    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');

    if (initialLocation) {
      marker.current = new mapboxgl.Marker()
        .setLngLat([initialLocation.lng, initialLocation.lat])
        .addTo(mapInstance);
    }

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      
      if (marker.current) {
        marker.current.setLngLat([lng, lat]);
      } else {
        marker.current = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(mapInstance);
      }

      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`)
        .then(response => response.json())
        .then(data => {
          const placeName = data.features[0]?.place_name;
          setAddress(placeName || '');
          onLocationSelect({ lat, lng, address: placeName });
        });
    };

    mapInstance.on('click', handleMapClick);

    return () => {
      mapInstance.remove();
    };
  }, []);

  const handleAddressSearch = () => {
    if (!address) return;

    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`)
      .then(response => response.json())
      .then(data => {
        const [lng, lat] = data.features[0]?.center || [0, 0];
        
        if (map.current) {
          map.current.flyTo({
            center: [lng, lat],
            zoom: 14
          });

          if (marker.current) {
            marker.current.setLngLat([lng, lat]);
          } else {
            marker.current = new mapboxgl.Marker()
              .setLngLat([lng, lat])
              .addTo(map.current);
          }

          onLocationSelect({ lat, lng, address });
        }
      });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddressSearch()}
        />
        <Button onClick={handleAddressSearch} type="button">
          <MapPin className="h-4 w-4" />
        </Button>
      </div>
      <div ref={mapContainer} className="h-[300px] rounded-lg overflow-hidden" />
    </div>
  );
};

export default ProjectMap;