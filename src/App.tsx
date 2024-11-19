import { useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatBox } from './components/ChatBox';
import { ApiKeyModal } from './components/ApiKeyModal';
import { useChatStore } from './store/chatStore';
import { AIModelId } from './types/chat';

const API_KEY_TIMEOUT = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

function App() {
  const { apiKey, setApiKey, chats, activeChat, addChat, setActiveChat } = useChatStore();

  // Secure cleanup of API key
  const clearApiKey = useCallback(() => {
    setApiKey(null);
  }, [setApiKey]);

  // Handle tab/browser closure
  useEffect(() => {
    const handleUnload = () => {
      clearApiKey();
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [clearApiKey]);

  // Time-based API key expiration (3 hours)
  useEffect(() => {
    let timeoutId: number | undefined;

    if (apiKey) {
      timeoutId = window.setTimeout(() => {
        clearApiKey();
      }, API_KEY_TIMEOUT);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [apiKey, clearApiKey]);

  // Initialize first chat
  useEffect(() => {
    if (chats.length === 0) {
      const newChat = {
        id: crypto.randomUUID(),
        title: 'Chat 1',
        messages: [],
        createdAt: Date.now(),
        systemMessage: '',
        model: 'gpt-4o-mini' as AIModelId,
      };
      addChat(newChat);
      setActiveChat(newChat.id);
    } else if (!activeChat && chats.length > 0) {
      setActiveChat(chats[0].id);
    }
  }, [chats.length, activeChat, addChat, setActiveChat, chats]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ChatBox />
      </div>
      {!apiKey && <ApiKeyModal />}
    </div>
  );
}

export default App;