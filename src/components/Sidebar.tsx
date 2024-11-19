import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquarePlus, Trash2, DatabaseBackup, Edit2 } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { AIModelId } from '../types/chat';

export const Sidebar: React.FC = () => {
  const { chats, activeChat, addChat, setActiveChat, deleteChat, clearAllData, renameChat } = useChatStore();
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const createNewChat = () => {
    const newChat = {
      id: crypto.randomUUID(),
      title: `Chat ${chats.length + 1}`,
      messages: [],
      createdAt: Date.now(),
      systemMessage: '',
      model: 'gpt-4o-mini' as AIModelId,
    };
    addChat(newChat);
    setActiveChat(newChat.id);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all chats and settings? This cannot be undone.')) {
      clearAllData();
    }
  };

  const startEditing = (chat: { id: string; title: string }) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleRename = (chatId: string) => {
    if (editTitle.trim()) {
      renameChat(chatId, editTitle.trim());
      setEditingChatId(null);
      setEditTitle('');
    }
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4 flex flex-col gap-4"
    >
      <button
        onClick={createNewChat}
        className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300"
      >
        <MessageSquarePlus size={20} />
        <span>New Chat</span>
      </button>

      <div className="flex-1 overflow-y-auto space-y-2">
        {chats.map((chat) => (
          <motion.div
            key={chat.id}
            whileHover={{ scale: 1.02 }}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
              activeChat === chat.id
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30'
                : 'hover:bg-white/5'
            }`}
            onClick={() => setActiveChat(chat.id)}
          >
            <div className="flex items-center justify-between">
              {editingChatId === chat.id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => handleRename(chat.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRename(chat.id);
                    } else if (e.key === 'Escape') {
                      setEditingChatId(null);
                      setEditTitle('');
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gray-800 text-white/90 rounded px-2 py-1 w-full mr-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
              ) : (
                <span className="text-white/90 truncate">{chat.title}</span>
              )}
              <div className="flex items-center gap-2">
                <Edit2
                  size={16}
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(chat);
                  }}
                />
                <Trash2
                  size={16}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this chat?')) {
                      deleteChat(chat.id);
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={handleClearData}
        className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all duration-300 mt-2"
      >
        <DatabaseBackup size={20} />
        <span>Clear All Data</span>
      </button>
    </motion.div>
  );
};