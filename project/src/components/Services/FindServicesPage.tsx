import React, { useState } from 'react';
import { ServiceMap } from './ServiceMap';
import { ProviderProfile } from '../../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'; // use your modal implementation

// Replace this with API call in real use
const providersMock: ProviderProfile[] = [
  {
    id: '1',
    latitude: 26.8825,
    longitude: 80.9995,
    address: 'Indira Nagar, Lucknow',
    rate: 500,
    skills: ['Cleaning', 'Home Sanitization'],
    user: {
      name: 'Ravi Verma',
      email: 'ravi@example.com',
    },
  },
  {
    id: '2',
    latitude: 26.8615,
    longitude: 80.9442,
    address: 'Alambagh, Lucknow',
    rate: 400,
    skills: ['AC Repair'],
    user: {
      name: 'Ankit Singh',
      email: 'ankit@example.com',
    },
  },
];

export default function FindServicesPage() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>([
    26.8467, 80.9462, // Lucknow default center
  ]);
  const [selectedProvider, setSelectedProvider] = useState<ProviderProfile | null>(null);

  return (
    <div className="h-[calc(100vh-4rem)] relative">
      <ServiceMap
        providers={providersMock}
        userLocation={userLocation}
        onPickLocation={setUserLocation}
        onProviderSelect={setSelectedProvider}
      />

      <Dialog open={!!selectedProvider} onOpenChange={() => setSelectedProvider(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Service</DialogTitle>
          </DialogHeader>

          {selectedProvider && (
            <div className="space-y-3 text-sm">
              <p><strong>Name:</strong> {selectedProvider.user.name}</p>
              <p><strong>Address:</strong> {selectedProvider.address}</p>
              <p><strong>Skills:</strong> {selectedProvider.skills?.join(', ') || 'N/A'}</p>
              <p><strong>Rate:</strong> ₹{selectedProvider.rate}/hour</p>

              <button
                className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                onClick={() => {
                  alert(`Booked ${selectedProvider.user.name}`);
                  setSelectedProvider(null);
                }}
              >
                Confirm Booking
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
