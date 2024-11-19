import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

export const ApiKeyModal: React.FC = () => {
  const [key, setKey] = useState('');
  const { setApiKey } = useChatStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      setApiKey(key.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full"
      >
        <div className="flex items-center gap-3 mb-4">
          <Key className="text-blue-500" size={24} />
          <h2 className="text-xl font-semibold text-white">Enter OpenAI API Key</h2>
        </div>
        <p className="text-gray-300 mb-4">
          Your API key will be stored securely in memory and will be deleted when you close the tab.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-..."
            className="w-full bg-white/10 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300"
          >
            Save API Key
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};