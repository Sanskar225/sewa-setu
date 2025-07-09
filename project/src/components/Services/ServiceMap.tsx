import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  Circle
} from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
// @ts-ignore
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { MapPin, Star, MessageCircle, LocateIcon } from 'lucide-react';
import { ProviderProfile } from '../../types';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

interface ServiceMapProps {
  providers: ProviderProfile[];
  userLocation: [number, number] | null;
  onProviderSelect: (provider: ProviderProfile) => void;
  onPickLocation?: (location: [number, number]) => void;
}

function MapController({ userLocation }: { userLocation: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 13);
    }
  }, [userLocation, map]);

  useEffect(() => {
    // @ts-ignore
    const control = L.Control.geocoder({ defaultMarkGeocode: true }).addTo(map);
    return () => map.removeControl(control);
  }, [map]);

  return null;
}

function ClickHandler({ onSelect }: { onSelect: (coords: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onSelect([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
}

// Calculate distance between two coordinates (Haversine formula)
function getDistanceInMeters([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]) {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function ServiceMap({
  providers,
  userLocation: initialUserLocation,
  onProviderSelect,
  onPickLocation
}: ServiceMapProps) {
  const defaultCenter: LatLngExpression = [26.8467, 80.9462]; // Lucknow
  const [userLocation, setUserLocation] = useState<[number, number] | null>(initialUserLocation);
  const [pickedLocation, setPickedLocation] = useState<[number, number] | null>(null);
  const [radius, setRadius] = useState<number>(2000);

  const providerIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const userIcon = new L.Icon({
    iconUrl:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMzQjgyRjYiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNiIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMiIgZmlsbD0iIzNCODJGNiIvPgo8L3N2Zz4K',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });

  // Filter providers based on radius
  const filteredProviders = userLocation
    ? providers.filter(
        (p) =>
          typeof p.latitude === 'number' &&
          typeof p.longitude === 'number' &&
          getDistanceInMeters(userLocation, [p.latitude, p.longitude]) <= radius
      )
    : providers;

  const handleLocateMe = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setPickedLocation(null);
      },
      (err) => {
        alert('Failed to get your location. Please allow location permission.');
        console.error(err);
      }
    );
  };

  return (
    <div className="h-full relative">
      {/* Controls */}
      <div className="absolute top-3 left-3 z-[999] bg-white rounded-lg shadow px-4 py-2 flex items-center space-x-4">
        <button
          onClick={handleLocateMe}
          className="text-sm px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
        >
          📍 Locate Me
        </button>
        <select
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="text-sm border rounded px-2 py-1"
        >
          <option value={1000}>1 km</option>
          <option value={2000}>2 km</option>
          <option value={5000}>5 km</option>
          <option value={10000}>10 km</option>
          <option value={15000}>15 km</option>
        </select>
      </div>

      <MapContainer center={userLocation || defaultCenter} zoom={13} className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController userLocation={userLocation} />

        <ClickHandler
          onSelect={(coords) => {
            setPickedLocation(coords);
            onPickLocation?.(coords);
          }}
        />

        {userLocation && (
          <>
            <Marker position={userLocation} icon={userIcon}>
              <Popup>Your Location</Popup>
            </Marker>
            <Circle
              center={userLocation}
              radius={radius}
              pathOptions={{ color: 'blue', fillOpacity: 0.1 }}
            />
          </>
        )}

        {pickedLocation && (
          <Marker position={pickedLocation}>
            <Popup>Selected Location</Popup>
          </Marker>
        )}

        <MarkerClusterGroup key={filteredProviders.length}>
          {filteredProviders.map((provider) => (
            <Marker
              key={provider.id}
              position={[provider.latitude!, provider.longitude!]}
              icon={providerIcon}
            >
              <Popup>
                <div className="p-2 min-w-[200px] max-h-[220px] overflow-y-auto">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {provider.user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{provider.user.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">4.8</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{provider.address}</span>
                    </div>
                    <div className="text-gray-600">
                      Skills: {provider.skills?.join(', ') || 'Not specified'}
                    </div>
                    <div className="font-medium">Rate: ₹{provider.rate}/hour</div>
                  </div>

                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => onProviderSelect(provider)}
                      className="flex-1 bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800 transition-colors"
                    >
                      Book Now
                    </button>
                    <button className="p-1 border border-gray-300 rounded hover:bg-gray-50">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
