import { useRef, useState, useEffect } from 'react';
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
  const clickListenerRef = useRef<((e: mapboxgl.MapMouseEvent) => void) | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoiemdvZG92aW5hMSIsImEiOiJjbTZqcHgxNHQwMGxwMm9zZ3dmcWozcGdyIn0.LyyYbdFWwCgmVoV1miRv5Q';

    const initialCoordinates = initialLocation 
      ? [initialLocation.lng, initialLocation.lat]
      : [14.5058, 46.0569]; // Default to Ljubljana, Slovenia

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCoordinates as [number, number],
      zoom: 9
    });

    map.current = mapInstance;

    // Add navigation controls
    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add initial marker if location exists
    if (initialLocation) {
      marker.current = new mapboxgl.Marker()
        .setLngLat([initialLocation.lng, initialLocation.lat])
        .addTo(mapInstance);
    }

    return () => {
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
      mapInstance.remove();
      map.current = null;
    };
  }, [initialLocation]);

  // Handle map click events in a separate effect
  useEffect(() => {
    if (!map.current) return;

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      
      if (marker.current) {
        marker.current.setLngLat([lng, lat]);
      } else {
        marker.current = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map.current!);
      }

      // Reverse geocoding
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      )
        .then((response) => response.json())
        .then((data) => {
          const placeName = data.features[0]?.place_name || '';
          setAddress(placeName);
          onLocationSelect({ lat, lng, address: placeName });
        })
        .catch((error) => {
          console.error('Error fetching address:', error);
        });
    };

    clickListenerRef.current = handleMapClick;
    map.current.on('click', handleMapClick);

    return () => {
      if (map.current && clickListenerRef.current) {
        map.current.off('click', clickListenerRef.current);
        clickListenerRef.current = null;
      }
    };
  }, [onLocationSelect]);

  const handleAddressSearch = () => {
    if (!address || !map.current) return;

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`
    )
      .then((response) => response.json())
      .then((data) => {
        const [lng, lat] = data.features[0]?.center || [0, 0];
        
        map.current?.flyTo({
          center: [lng, lat],
          zoom: 14,
          essential: true
        });

        if (marker.current) {
          marker.current.setLngLat([lng, lat]);
        } else {
          marker.current = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map.current!);
        }

        onLocationSelect({ lat, lng, address });
      })
      .catch((error) => {
        console.error('Error searching address:', error);
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