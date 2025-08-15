// AdminProvidersPage.tsx
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';

interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceCategory: string;
  rating: number;
  complaints: number;
  status: 'active' | 'blocked';
  profileImage: string;
}

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [blockModalProvider, setBlockModalProvider] = useState<Provider | null>(null);
  const [blockReason, setBlockReason] = useState('');

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    const res = await apiService.get('/admin/providers');
    setProviders(res.data);
  };

  const toggleProviderSelection = (id: string) => {
    setSelectedProviders(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const blockProvider = async () => {
    if (!blockModalProvider) return;
    await apiService.post(`/admin/providers/${blockModalProvider.id}/block`, { reason: blockReason });
    toast.success('Provider blocked');
    setBlockModalProvider(null);
    fetchProviders();
  };

  const unblockProvider = async (id: string) => {
    await apiService.post(`/admin/providers/${id}/unblock`);
    toast.success('Provider unblocked');
    fetchProviders();
  };

  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search providers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-1/3"
        />
        <Button
          variant="destructive"
          disabled={selectedProviders.length === 0}
          onClick={() => {
            const provider = providers.find(p => p.id === selectedProviders[0]);
            if (provider) setBlockModalProvider(provider);
          }}
        >
          Block Selected
        </Button>
      </div>

      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">
              <Checkbox
                checked={selectedProviders.length === providers.length}
                onCheckedChange={() => {
                  if (selectedProviders.length === providers.length) setSelectedProviders([]);
                  else setSelectedProviders(providers.map(p => p.id));
                }}
              />
            </th>
            <th className="p-2 text-left">Provider</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">Rating</th>
            <th className="p-2 text-left">Complaints</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProviders.map(provider => (
            <tr key={provider.id} className="border-t">
              <td className="p-2">
                <Checkbox
                  checked={selectedProviders.includes(provider.id)}
                  onCheckedChange={() => toggleProviderSelection(provider.id)}
                />
              </td>
              <td className="p-2 flex items-center gap-2">
                <img src={provider.profileImage} alt="profile" className="w-8 h-8 rounded-full" />
                {provider.name}
              </td>
              <td className="p-2">{provider.email}</td>
              <td className="p-2">{provider.serviceCategory}</td>
              <td className="p-2">⭐ {provider.rating.toFixed(1)}</td>
              <td className="p-2">{provider.complaints}</td>
              <td className="p-2">
                <span className={`text-sm font-medium ${provider.status === 'blocked' ? 'text-red-500' : 'text-green-600'}`}>
                  {provider.status}
                </span>
              </td>
              <td className="p-2 space-x-2">
                {provider.status === 'active' ? (
                  <Button size="sm" onClick={() => setBlockModalProvider(provider)}>
                    Block
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => unblockProvider(provider.id)}>
                    Unblock
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={!!blockModalProvider} onOpenChange={() => setBlockModalProvider(null)}>
        <DialogContent>
          <h2 className="text-lg font-semibold">Block Provider</h2>
          <p className="text-sm">Choose a reason for blocking <b>{blockModalProvider?.name}</b>.</p>
          <select
            value={blockReason}
            onChange={e => setBlockReason(e.target.value)}
            className="w-full border p-2 rounded mt-2"
          >
            <option value="">Select reason</option>
            <option value="Unprofessional behavior">Unprofessional behavior</option>
            <option value="Poor service quality">Poor service quality</option>
            <option value="Fake profile">Fake profile</option>
            <option value="Scam / Fraud">Scam / Fraud</option>
            <option value="Other">Other</option>
          </select>
          <Button className="mt-4 w-full" onClick={blockProvider} disabled={!blockReason}>
            Confirm Block
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
