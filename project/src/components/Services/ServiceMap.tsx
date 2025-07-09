import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { MapPin, Star, Phone, MessageCircle } from 'lucide-react';
import { ProviderProfile } from '../../types';
import L from 'leaflet';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ServiceMapProps {
  providers: ProviderProfile[];
  userLocation: [number, number] | null;
  onProviderSelect: (provider: ProviderProfile) => void;
}

function MapController({ userLocation }: { userLocation: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 13);
    }
  }, [userLocation, map]);

  return null;
}

export function ServiceMap({ providers, userLocation, onProviderSelect }: ServiceMapProps) {
  const defaultCenter: LatLngExpression = [28.6139, 77.2090]; // Delhi
  const center = userLocation || defaultCenter;

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
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMzQjgyRjYiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNiIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMiIgZmlsbD0iIzNCODJGNiIvPgo8L3N2Zz4K',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });

  return (
    <div className="h-full relative">
      <MapContainer
        center={center}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController userLocation={userLocation} />
        
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div className="p-2">
                <div className="font-medium">Your Location</div>
              </div>
            </Popup>
          </Marker>
        )}
        
        {providers.map((provider) => (
          <Marker
            key={provider.id}
            position={[provider.latitude, provider.longitude]}
            icon={providerIcon}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
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
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{provider.address}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Skills: {provider.skills.join(', ')}
                  </div>
                  
                  <div className="text-sm font-medium">
                    Rate: ₹{provider.rate}/hour
                  </div>
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
      </MapContainer>
    </div>
  );
}