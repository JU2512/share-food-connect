import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { DonationListing } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';

interface DonationMapProps {
  donations: DonationListing[];
  userLocation: { lat: number; lng: number } | null;
  onSelectDonation: (donation: DonationListing) => void;
  mapboxToken: string;
  onTokenChange: (token: string) => void;
}

const DonationMap: React.FC<DonationMapProps> = ({
  donations,
  userLocation,
  onSelectDonation,
  mapboxToken,
  onTokenChange,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [tokenInput, setTokenInput] = useState(mapboxToken);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;

      const center: [number, number] = userLocation
        ? [userLocation.lng, userLocation.lat]
        : [77.5946, 12.9716]; // Default to Bangalore

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center,
        zoom: 12,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add user location marker
      if (userLocation) {
        const userMarkerEl = document.createElement('div');
        userMarkerEl.className = 'user-marker';
        userMarkerEl.innerHTML = `
          <div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <div class="w-2 h-2 bg-white rounded-full"></div>
          </div>
        `;
        
        new mapboxgl.Marker({ element: userMarkerEl })
          .setLngLat([userLocation.lng, userLocation.lat])
          .addTo(map.current);
      }

      setMapError(null);
    } catch (error) {
      setMapError('Invalid Mapbox token. Please check your token and try again.');
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [mapboxToken, userLocation]);

  // Add donation markers
  useEffect(() => {
    if (!map.current || !mapboxToken) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    donations.forEach(donation => {
      const markerEl = document.createElement('div');
      markerEl.className = 'donation-marker cursor-pointer';
      markerEl.innerHTML = `
        <div class="w-10 h-10 bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform" style="background-color: hsl(142, 76%, 36%);">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `;

      markerEl.addEventListener('click', () => {
        onSelectDonation(donation);
      });

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-sm">${donation.foodName}</h3>
          <p class="text-xs text-gray-600">${donation.quantity}</p>
          ${donation.distance ? `<p class="text-xs text-primary font-medium">${donation.distance.toFixed(1)} km away</p>` : ''}
        </div>
      `);

      const marker = new mapboxgl.Marker({ element: markerEl })
        .setLngLat([donation.longitude, donation.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [donations, mapboxToken, onSelectDonation]);

  if (!mapboxToken) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-muted/50 rounded-xl p-6 space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Key className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-foreground">Mapbox Token Required</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Enter your Mapbox public token to view the map. Get one free at{' '}
            <a 
              href="https://mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
        <div className="w-full max-w-sm space-y-3">
          <Input
            placeholder="pk.eyJ1IjoiLi..."
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="text-xs"
          />
          <Button 
            onClick={() => onTokenChange(tokenInput)} 
            className="w-full"
            disabled={!tokenInput.trim()}
          >
            Enable Map
          </Button>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-destructive/10 rounded-xl p-6 space-y-4">
        <p className="text-destructive text-sm text-center">{mapError}</p>
        <Button variant="outline" onClick={() => onTokenChange('')}>
          Enter New Token
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default DonationMap;
