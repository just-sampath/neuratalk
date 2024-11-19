import { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { OpenAIService } from '../services/openai';
import { Message } from '../types/chat';

export const useChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    chats,
    activeChat: activeChatId,
    addMessage,
    apiKey,
    includeHistory,
    includeSystemMessage,
  } = useChatStore();

  const sendMessage = async (content: string) => {
    if (!content.trim() || !activeChatId || !apiKey) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    addMessage(activeChatId, userMessage);
    setIsLoading(true);

    try {
      const openai = new OpenAIService(apiKey);
      const activeChat = chats.find((chat) => chat.id === activeChatId);
      
      if (!activeChat) {
        throw new Error('Active chat not found.');
      }

      const activeMessages = activeChat.messages.filter((msg) => msg.role !== 'system');
      const systemMessage = activeChat.systemMessage || '';

      const historyMessages = includeHistory ? activeMessages : [];
      
      const response = await openai.sendMessage(
        content,
        systemMessage,
        historyMessages,
        activeChat.model,
        includeSystemMessage
      );

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      addMessage(activeChat.id, assistantMessage);
    } catch (error) {
      console.error('Error in sendMessage:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.',
        timestamp: Date.now(),
      };
      addMessage(activeChatId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    sendMessage,
  };
};