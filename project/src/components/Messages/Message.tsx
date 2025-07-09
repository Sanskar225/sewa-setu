import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

interface MessagesDashboardProps {
  receiverId: string;       // ID of the provider or user you are chatting with
  chatActive: boolean;      // ✅ whether chat should be shown
}

export function MessagesDashboard({ receiverId, chatActive }: MessagesDashboardProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!chatActive) return;

    fetchMessages();
  }, [chatActive]);

  const fetchMessages = async () => {
    try {
      const response = await apiService.request(`/messages/${receiverId}`);
      setMessages(response.messages || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      const res = await apiService.request('/messages', {
        method: 'POST',
        body: JSON.stringify({
          receiverId,
          content: newMessage,
        }),
      });

      setMessages((prev) => [...prev, res.message]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  if (!chatActive) {
    return (
      <div className="text-center text-gray-500 py-10">
        <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>Chat is disabled because the booking is completed or cancelled.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-gray-600">Chat with your service provider/user</p>
      </div>

      {/* Chat Box */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 max-h-[70vh] overflow-y-auto space-y-4 mb-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            No messages yet
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderId === user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  msg.senderId === user?.id
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs text-right mt-1 text-gray-400">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={handleSend}
          disabled={sending || !newMessage.trim()}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
