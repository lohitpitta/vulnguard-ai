import { GroqChatRequest, GroqChatResponse, GroqMessage } from '../types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const groqService = {
  async chatCompletion(request: GroqChatRequest): Promise<string> {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
      throw new Error('Groq API key is not configured. Please set VITE_GROQ_API_KEY environment variable.');
    }

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Groq API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`
        );
      }

      const data: GroqChatResponse = await response.json();

      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response choices returned from Groq API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to call Groq API: ${error.message}`);
      }
      throw new Error('Failed to call Groq API: Unknown error');
    }
  },

  buildMessages(
    userMessages: Array<{ role: 'user' | 'assistant'; content: string }>,
    systemPrompt: string
  ): GroqMessage[] {
    const messages: GroqMessage[] = [];

    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt,
      });
    }

    userMessages.forEach((msg) => {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    });

    return messages;
  },
};
