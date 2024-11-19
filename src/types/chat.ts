/**
 * Represents a chat message with role-based content
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

/**
 * Represents a chat session with messages and metadata
 */
export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  systemMessage: string;
  model: AIModelId;
}

/**
 * Global chat state and actions
 */
export interface ChatState {
  chats: Chat[];
  activeChat: string | null;
  includeHistory: boolean;
  apiKey: string | null;
  includeSystemMessage: boolean;
  
  // Action handlers
  addChat: (chat: Chat) => Promise<void> | void;
  setActiveChat: (id: string) => Promise<void> | void;
  addMessage: (chatId: string, message: Message) => Promise<void> | void;
  setIncludeHistory: (include: boolean) => void;
  setApiKey: (key: string | null) => void;
  setModelForChat: (chatId: string, model: AIModelId) => void;
  setSystemMessage: (chatId: string, message: string) => Promise<void> | void;
  clearAllData: () => Promise<void> | void;
  setIncludeSystemMessage: (include: boolean) => void;
  deleteChat: (id: string) => Promise<void> | void;
  renameChat: (id: string, newTitle: string) => Promise<void> | void;
}

/**
 * Available AI model configurations
 */
export const AI_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'o1-preview', name: 'Strawberry' },
  { id: 'o1-mini', name: 'Strawberry Mini' },
] as const;

export type AIModelId = typeof AI_MODELS[number]['id'];

/**
 * Checks if the given model ID is a Strawberry model
 */
export const isStrawberryModel = (modelId: AIModelId): boolean => {
  return modelId === 'o1-preview' || modelId === 'o1-mini';
};