import { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatBox } from './components/ChatBox';
import { ApiKeyModal } from './components/ApiKeyModal';
import { useChatStore } from './store/chatStore';
import { AIModelId } from './types/chat';

function App() {
  const { apiKey, setApiKey, chats, activeChat, addChat, setActiveChat } = useChatStore();

  useEffect(() => {
    // Check for API key in environment variables
    const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (envApiKey && !apiKey) {
      setApiKey(envApiKey);
    }

    const handleTabClose = () => {
      setApiKey(null);
    };

    window.addEventListener('beforeunload', handleTabClose);
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, [setApiKey, apiKey]);

  useEffect(() => {
    if (chats.length === 0) {
      const newChat = {
        id: crypto.randomUUID(),
        title: 'New Chat',
        messages: [],
        createdAt: Date.now(),
        systemMessage: '',
        model: 'gpt-4o-mini' as AIModelId,
      };
      addChat(newChat);
      setActiveChat(newChat.id);
    } else if (!activeChat && chats.length > 0) {
      // If there are chats but no active chat, set the first one as active
      setActiveChat(chats[0].id);
    }
  }, [chats.length, activeChat, addChat, setActiveChat, chats]);

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <ChatBox />
      {!apiKey && !import.meta.env.VITE_OPENAI_API_KEY && <ApiKeyModal />}
    </div>
  );
}

export default App;