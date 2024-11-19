import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatState } from '../types/chat';

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: [],
      activeChat: null,
      includeHistory: true,
      apiKey: null,
      includeSystemMessage: true,

      addChat: (chat) =>
        set((state) => ({
          chats: [...state.chats, { ...chat, systemMessage: '', model: 'gpt-4o-mini' }],
          activeChat: chat.id,
        })),

      setActiveChat: (id) =>
        set(() => ({
          activeChat: id,
        })),

      addMessage: (chatId, message) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? { ...chat, messages: [...chat.messages, message] }
              : chat
          ),
        })),

      setIncludeHistory: (include) =>
        set(() => ({
          includeHistory: include,
        })),

      setApiKey: (key) =>
        set(() => ({
          apiKey: key,
        })),

      setModelForChat: (chatId, model) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, model } : chat
          ),
        })),

      setSystemMessage: (chatId, message) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, systemMessage: message } : chat
          ),
        })),

      setIncludeSystemMessage: (include) =>
        set(() => ({
          includeSystemMessage: include,
        })),

      clearAllData: () =>
        set(() => ({
          chats: [],
          activeChat: null,
          includeHistory: true,
          includeSystemMessage: true,
          apiKey: null,
        })),

      deleteChat: (id) =>
        set((state) => {
          const newChats = state.chats.filter((chat) => chat.id !== id);
          return {
            chats: newChats,
            activeChat: state.activeChat === id ? (newChats[0]?.id || null) : state.activeChat,
          };
        }),

      renameChat: (id, newTitle) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === id ? { ...chat, title: newTitle } : chat
          ),
        })),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        chats: state.chats,
        includeHistory: state.includeHistory,
        includeSystemMessage: state.includeSystemMessage,
      }),
    }
  )
);