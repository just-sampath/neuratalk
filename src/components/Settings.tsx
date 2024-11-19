import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, X } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { isStrawberryModel, AIModelId } from '../types/chat';

interface SettingsProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onOpenChange }) => {
  const { 
    chats, 
    activeChat, 
    setSystemMessage, 
    includeSystemMessage, 
    setIncludeSystemMessage,
    setModelForChat
  } = useChatStore();
  
  const activeSystemMessage = activeChat ? chats.find(chat => chat.id === activeChat)?.systemMessage || '' : '';
  const [tempSystemMessage, setTempSystemMessage] = React.useState(activeSystemMessage);
  const activeModel = activeChat 
    ? chats.find(chat => chat.id === activeChat)?.model ?? 'gpt-4o-mini'
    : 'gpt-4o-mini';
  const isStrawberrySelected = isStrawberryModel(activeModel);

  React.useEffect(() => {
    setTempSystemMessage(activeSystemMessage);
  }, [activeSystemMessage]);

  const handleUpdateSystemMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeChat) {
      setSystemMessage(activeChat, tempSystemMessage.trim());
      onOpenChange(false);
    }
  };

  const handleModelChange = (model: AIModelId) => {
    if (activeChat) {
      setModelForChat(activeChat, model);
    }
  };

  return (
    <>
      <button
        onClick={() => onOpenChange(true)}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
      >
        <SettingsIcon className="text-white/80 hover:text-white" size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Chat Settings</h2>
                <button
                  onClick={() => onOpenChange(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="text-white/80 hover:text-white" size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateSystemMessage} className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={includeSystemMessage && !isStrawberrySelected}
                    onClick={() => !isStrawberrySelected && setIncludeSystemMessage(!includeSystemMessage)}
                    disabled={isStrawberrySelected}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out
                      ${(includeSystemMessage && !isStrawberrySelected) ? 'bg-purple-500' : 'bg-gray-700'}
                      ${isStrawberrySelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out
                        ${(includeSystemMessage && !isStrawberrySelected) ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                  <label 
                    className={`text-white/80 ${isStrawberrySelected ? 'opacity-50' : ''} select-none cursor-pointer`}
                    onClick={() => !isStrawberrySelected && setIncludeSystemMessage(!includeSystemMessage)}
                  >
                    Include system message
                    {isStrawberrySelected && (
                      <span className="block text-xs text-yellow-500 mt-1">
                        System messages are not supported for Strawberry models
                      </span>
                    )}
                  </label>
                </div>
                <AnimatePresence mode="sync">
                  {(includeSystemMessage && !isStrawberrySelected) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          System Message
                        </label>
                        <textarea
                          value={tempSystemMessage}
                          onChange={(e) => setTempSystemMessage(e.target.value)}
                          placeholder="Set the behavior and context for the AI..."
                          rows={4}
                          disabled={isStrawberrySelected}
                          className="w-full bg-white/10 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                        />
                      </div>
                      <motion.button
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        type="submit"
                        disabled={isStrawberrySelected}
                        className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
                      >
                        Update System Message
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Model
                  </label>
                  <select
                    value={activeModel}
                    onChange={(e) => handleModelChange(e.target.value as AIModelId)}
                    className="w-full bg-white/10 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="gpt-4o-mini">GPT-4o-mini</option>
                    <option value="strawberry">Strawberry</option>
                  </select>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};