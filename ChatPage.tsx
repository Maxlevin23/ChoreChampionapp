
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { SendIcon, BellIcon, MessageSquareIcon } from '../constants'; 

interface ChatPageProps {
  messages: ChatMessage[];
  onSendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  isLoadingGemini: boolean;
}

const ChatPage: React.FC<ChatPageProps> = ({ messages, onSendMessage, isLoadingGemini }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage({ sender: 'User', text: newMessage.trim(), type: 'message' });
      setNewMessage('');
    }
  };

  const getMessageStyle = (message: ChatMessage) => {
    let baseStyle = "p-3 rounded-lg max-w-xs sm:max-w-md md:max-w-lg break-words shadow";
    if (message.sender === 'User') {
      return `${baseStyle} bg-primary text-white self-end dark:bg-blue-500 dark:text-white`;
    } else if (message.type === 'reminder') {
      return `${baseStyle} bg-amber-100 text-amber-800 self-start border border-amber-300 dark:bg-amber-800/30 dark:text-amber-300 dark:border-amber-700`;
    } else if (message.type === 'system') {
      return `${baseStyle} bg-gray-200 text-gray-700 self-center text-sm italic w-full text-center max-w-full dark:bg-gray-600 dark:text-gray-300`;
    } else if (message.type === 'error') {
      return `${baseStyle} bg-red-100 text-red-700 self-start border border-red-300 dark:bg-red-800/30 dark:text-red-300 dark:border-red-700`;
    }
    // Default for other (e.g., older system messages, or future direct messages from others)
    return `${baseStyle} bg-card text-textPrimary self-start dark:bg-gray-700 dark:text-gray-200`; 
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] bg-card dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      <header className="p-4 bg-gray-100 border-b border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <h2 className="text-2xl font-semibold text-textPrimary dark:text-gray-100 flex items-center">
          <MessageSquareIcon className="mr-2 text-primary dark:text-blue-400" />
          Reminders & Chat
        </h2>
      </header>

      <div className="flex-grow p-4 space-y-4 overflow-y-auto flex flex-col bg-gray-50 dark:bg-gray-900">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
            <div className={getMessageStyle(msg)}>
              {msg.type === 'reminder' && <BellIcon size={16} className="inline mr-1 mb-0.5 text-amber-600 dark:text-amber-400" />}
              <p className="text-sm font-medium mb-1">{msg.sender === 'User' ? 'You' : msg.sender}</p>
              <p>{msg.text}</p>
              <p className="text-xs opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
        {isLoadingGemini && (
           <div className="flex justify-start">
            <div className="p-3 rounded-lg max-w-xs sm:max-w-md md:max-w-lg break-words shadow bg-gray-200 text-gray-700 self-start dark:bg-gray-600 dark:text-gray-300">
              <p className="text-sm font-medium mb-1">System</p>
              <p className="italic">Generating response...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 flex items-center space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message (for future direct chat)..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-500"
          disabled 
        />
        <button
          type="submit"
          className="p-3 bg-primary text-white rounded-full shadow-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-blue-500 dark:focus:ring-offset-gray-700 disabled:opacity-50"
          disabled 
        >
          <SendIcon size={20} />
        </button>
      </form>
      <p className="text-xs text-center p-2 text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400">Currently, chat is primarily for system reminders. Direct messaging will be enabled in a future update.</p>
    </div>
  );
};

export default ChatPage;