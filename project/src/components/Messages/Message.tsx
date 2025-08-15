import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Loader2, User, Shield } from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

export function MessagesDashboard() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [receiverType, setReceiverType] = useState<'ADMIN' | 'PROVIDER'>('ADMIN');
  const [receiverId, setReceiverId] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  const predefinedAdminId = 'admin-123';
  const predefinedProviderId = 'provider-456';

  useEffect(() => {
    setMessages([]);
    setReceiverId(receiverType === 'ADMIN' ? predefinedAdminId : predefinedProviderId);
  }, [receiverType]);

  useEffect(() => {
    if (!receiverId) return;
    fetchMessages();
  }, [receiverId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-6 h-6 text-black" />
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>
        <p className="text-gray-600">Chat with Admin or Service Provider</p>

        {/* Receiver Type Toggle */}
        <div className="flex items-center gap-4 mt-4">
          {['ADMIN', 'PROVIDER'].map((type) => (
            <button
              key={type}
              onClick={() => setReceiverType(type as 'ADMIN' | 'PROVIDER')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all ${
                receiverType === type
                  ? 'bg-black text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {type === 'ADMIN' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
              Message {type}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Box */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 max-h-[60vh] overflow-y-auto space-y-4 mb-6 scroll-smooth">
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
              className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs shadow-md transition-all ${
                  msg.senderId === user?.id
                    ? 'bg-black text-white rounded-br-none'
                    : 'bg-white border border-gray-300 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs text-right mt-1 text-gray-400">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex items-center space-x-2 sticky bottom-0 bg-white py-2">
        <input
          type="text"
          placeholder="Type your message..."
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
