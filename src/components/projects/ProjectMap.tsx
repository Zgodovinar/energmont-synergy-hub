import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { ProjectLocation } from '@/types/project';
import { useMapInstance } from '@/hooks/useMapInstance';

interface ProjectMapProps {
  onLocationSelect: (location: ProjectLocation) => void;
  initialLocation?: ProjectLocation;
}

const ProjectMap = ({ onLocationSelect, initialLocation }: ProjectMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [address, setAddress] = useState(initialLocation?.address || '');
  const { mapInstance, markerRef, isMapReady, clickListenerRef } = useMapInstance(mapContainer, initialLocation);

  // Handle map click events
  useEffect(() => {
    if (!mapInstance.current || !isMapReady) return;

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      
      if (markerRef.current) {
        markerRef.current.setLngLat([lng, lat]);
      } else {
        markerRef.current = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(mapInstance.current!);
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
    mapInstance.current.on('click', handleMapClick);

    return () => {
      if (mapInstance.current && clickListenerRef.current) {
        mapInstance.current.off('click', clickListenerRef.current);
      }
    };
  }, [isMapReady, onLocationSelect]);

  const handleAddressSearch = () => {
    if (!address || !mapInstance.current) return;

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`
    )
      .then((response) => response.json())
      .then((data) => {
        const [lng, lat] = data.features[0]?.center || [0, 0];
        
        mapInstance.current?.flyTo({
          center: [lng, lat],
          zoom: 14,
          essential: true
        });

        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat]);
        } else {
          markerRef.current = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(mapInstance.current!);
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