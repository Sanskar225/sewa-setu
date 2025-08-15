// AdminUsersPage.tsx
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  servicesUsed: string[];
  complaints: number;
  status: 'active' | 'blocked';
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [blockModalUser, setBlockModalUser] = useState<User | null>(null);
  const [blockReason, setBlockReason] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await apiService.get('/admin/users');
    setUsers(res.data);
  };

  const toggleUserSelection = (id: string) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const blockUser = async () => {
    if (!blockModalUser) return;
    await apiService.post(`/admin/users/${blockModalUser.id}/block`, { reason: blockReason });
    toast.success('User blocked');
    setBlockModalUser(null);
    fetchUsers();
  };

  const unblockUser = async (id: string) => {
    await apiService.post(`/admin/users/${id}/unblock`);
    toast.success('User unblocked');
    fetchUsers();
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-1/3"
        />
        <Button
          variant="destructive"
          disabled={selectedUsers.length === 0}
          onClick={() => {
            const user = users.find(u => u.id === selectedUsers[0]);
            if (user) setBlockModalUser(user);
          }}
        >
          Block Selected
        </Button>
      </div>

      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2"><Checkbox
              checked={selectedUsers.length === users.length}
              onCheckedChange={() => {
                if (selectedUsers.length === users.length) setSelectedUsers([]);
                else setSelectedUsers(users.map(u => u.id));
              }}
            /></th>
            <th className="p-2 text-left">User</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Services Used</th>
            <th className="p-2 text-left">Complaints</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id} className="border-t">
              <td className="p-2">
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => toggleUserSelection(user.id)}
                />
              </td>
              <td className="p-2 flex items-center gap-2">
                <img src={user.profileImage} alt="profile" className="w-8 h-8 rounded-full" />
                {user.name}
              </td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.servicesUsed.join(', ')}</td>
              <td className="p-2">{user.complaints}</td>
              <td className="p-2">
                <span className={`text-sm font-medium ${user.status === 'blocked' ? 'text-red-500' : 'text-green-600'}`}>
                  {user.status}
                </span>
              </td>
              <td className="p-2 space-x-2">
                {user.status === 'active' ? (
                  <Button size="sm" onClick={() => setBlockModalUser(user)}>
                    Block
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => unblockUser(user.id)}>
                    Unblock
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={!!blockModalUser} onOpenChange={() => setBlockModalUser(null)}>
        <DialogContent>
          <h2 className="text-lg font-semibold">Block User</h2>
          <p className="text-sm">Choose a reason for blocking <b>{blockModalUser?.name}</b>.</p>
          <select
            value={blockReason}
            onChange={e => setBlockReason(e.target.value)}
            className="w-full border p-2 rounded mt-2"
          >
            <option value="">Select reason</option>
            <option value="Misbehaved with provider">Misbehaved with provider</option>
            <option value="Fake bookings">Fake bookings</option>
            <option value="Abusive language">Abusive language</option>
            <option value="Suspicious activity">Suspicious activity</option>
            <option value="Other">Other</option>
          </select>
          <Button className="mt-4 w-full" onClick={blockUser} disabled={!blockReason}>
            Confirm Block
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
