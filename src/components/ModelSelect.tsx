import React from 'react';
import { AI_MODELS, AIModelId } from '../types/chat';
import { useChatStore } from '../store/chatStore';

export const ModelSelect: React.FC = () => {
  const { chats, activeChat, setModelForChat } = useChatStore();
  const activeModel = activeChat ? chats.find(chat => chat.id === activeChat)?.model : 'gpt-4o-mini';

  return (
    <select
      value={activeModel}
      onChange={(e) => activeChat && setModelForChat(activeChat, e.target.value as AIModelId)}
      className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      disabled={!activeChat}
    >
      {AI_MODELS.map((model) => (
        <option key={model.id} value={model.id} className="bg-gray-800">
          {model.name}
        </option>
      ))}
    </select>
  );
};