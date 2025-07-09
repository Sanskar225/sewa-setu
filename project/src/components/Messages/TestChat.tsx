import React from 'react';
import { MessagesDashboard } from './Message';

export function TestChat() {
  // Replace with valid user IDs from your DB (two users that exist: USER + PROVIDER)
  const dummyReceiverId = '89f3aac8-c152-4608-860d-71a660d0a573';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-semibold mb-4">🧪 Test Chat Without Booking</h2>
      <MessagesDashboard receiverId={dummyReceiverId} chatActive={true} />
    </div>
  );
}
