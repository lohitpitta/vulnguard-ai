import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { groqService } from '../../services/groqService';
import { nvdService } from '../../services/nvdService';

const ChatInput = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addMessage, currentSession } = useChatStore();
  const { model, temperature, maxTokens, systemPrompt } = useSettingsStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || !currentSession || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
    });

    try {
      // Check if query contains a CVE ID
      const cveId = nvdService.extractCVEIdFromQuery(userMessage);
      let cveData = null;

      if (cveId) {
        try {
          cveData = await nvdService.fetchCVE(cveId);
        } catch (error) {
          console.warn('Failed to fetch CVE data:', error);
          // Continue without CVE data if fetch fails
        }
      }

      // Prepare messages for Groq API
      const conversationHistory = currentSession.messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

      const groqMessages = groqService.buildMessages(conversationHistory, systemPrompt);

      // Call Groq API
      const response = await groqService.chatCompletion({
        messages: groqMessages,
        model,
        temperature,
        max_tokens: maxTokens,
      });

      // Add assistant response
      addMessage({
        role: 'assistant',
        content: response,
        cveData: cveData || undefined,
      });
    } catch (error) {
      console.error('Error in chat completion:', error);
      addMessage({
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response from AI'}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t border-border p-6 bg-background/80 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a CVE or vulnerability..."
              className="w-full px-5 py-3.5 bg-secondary/50 border-2 border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-sm transition-all duration-200 placeholder:text-muted-foreground/60"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-[#90CF2A] text-black rounded-full hover:bg-[#7FB822] hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            <Send size={20} />
          </button>
        </div>
        {isLoading && (
          <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
            <Loader2 size={16} className="animate-spin" />
            <span>AI is thinking...</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatInput;
