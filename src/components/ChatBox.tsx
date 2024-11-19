import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useChat } from '../hooks/useChat';
import { ModelSelect } from './ModelSelect';
import { Settings } from './Settings';

export const ChatBox: React.FC = () => {
  const [input, setInput] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    chats,
    activeChat,
    includeHistory,
    setIncludeHistory,
  } = useChatStore();

  const { isLoading, sendMessage } = useChat();

  const activeMessages = useMemo(() => 
    activeChat
      ? chats.find((chat) => chat.id === activeChat)?.messages.filter(
          (msg) => msg.role !== 'system'
        ) || []
      : []
  , [activeChat, chats]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [activeMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeChat) return;

    await sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="p-4 border-b border-gray-700 bg-black/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-purple-400" size={24} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              NeuraTalk AI
            </h1>
          </div>
          <Settings isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
        </div>
        <div className="flex items-center justify-between">
          <ModelSelect />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeMessages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-white/10 text-white/90'
              }`}
            >
              {message.content}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700">
        <label className="flex items-center gap-2 text-white/80 mb-4 select-none">
          <input
            type="checkbox"
            checked={includeHistory}
            onChange={(e) => setIncludeHistory(e.target.checked)}
            className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-offset-gray-900 focus:ring-purple-500"
          />
          <span>Include conversation history</span>
        </label>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={!activeChat || isLoading}
            className="flex-1 bg-white/10 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!activeChat || isLoading || !input.trim()}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};