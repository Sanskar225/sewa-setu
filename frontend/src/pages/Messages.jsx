import React from 'react';
import './Messages.css';

const Messages = () => {
  const messages = [
    { id: 1, sender: "Provider", content: "Hello! Your booking is confirmed." },
    { id: 2, sender: "User ", content: "Thank you!" },
  ];

  return (
    <div className="messages-container">
      <h2>Messages</h2>
      {messages.map((message) => (
        <div key={message.id} className="message">
          <strong>{message.sender}:</strong> {message.content}
        </div>
      ))}
    </div>
  );
};

export default Messages;
