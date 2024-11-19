import OpenAI from 'openai';
import { Message, AIModelId, isStrawberryModel } from '../types/chat';

export class OpenAIService {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async sendMessage(
    message: string,
    systemMessage: string,
    history: Message[] = [],
    model: AIModelId = 'gpt-4o-mini',
    includeSystemMessage: boolean = true
  ) {
    // Never include system message for Strawberry models
    const shouldIncludeSystem = includeSystemMessage && !isStrawberryModel(model);
    
    const messages = [
      ...(shouldIncludeSystem ? [{ role: 'system' as const, content: systemMessage }] : []),
      ...history.map(({ role, content }) => ({
        role: role as 'user' | 'assistant',
        content
      })),
      { role: 'user' as const, content: message }
    ];

    try {
      console.log('Sending message to OpenAI with model:', model);
      console.log('The system message is:', messages.find(m => m.role === 'system'));
      console.log('The messages are:', messages);
      const completion = await this.client.chat.completions.create({
        model,
        messages,
      });

      return completion.choices[0]?.message?.content || 'No response';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to get response from OpenAI');
    }
  }
}