import { useState, useEffect } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { User, Bot, Shield, Copy, Check, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../../utils/cn';

const getSeverityBadge = (severity: string) => {
  const severityMap: Record<string, { color: string; label: string }> = {
    LOW: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Low' },
    MEDIUM: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Medium' },
    HIGH: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', label: 'High' },
    CRITICAL: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Critical' },
  };
  return severityMap[severity.toUpperCase()] || null;
};

const MessageList = () => {
  const { currentSession } = useChatStore();
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const stripMarkdown = (text: string): string => {
    return text
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      .replace(/[-*+]\s/g, '')
      .replace(/\d+\.\s/g, '')
      .replace(/\n+/g, ' ')
      .trim();
  };

  const handleCopy = async (content: string, messageId: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSpeak = (content: string, messageId: string) => {
    if (!window.speechSynthesis) return;

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = stripMarkdown(content);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!currentSession || currentSession.messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#90CF2A]/20 to-[#90CF2A]/5 mb-6 shadow-lg">
              <Shield className="text-[#90CF2A]" size={40} />
            </div>
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Welcome to VulnGuard AI
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              AI-Powered CVE Intelligence Platform
            </p>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border rounded-2xl">
            <p className="text-muted-foreground mb-4">Start a conversation by asking about a CVE or vulnerability</p>
            <div className="text-sm text-muted-foreground/70">
              <p className="font-medium mb-2">Example queries:</p>
              <p className="font-mono bg-secondary/50 px-3 py-2 rounded-lg inline-block">"What is CVE-2023-23397?"</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {currentSession.messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-4',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Bot size={18} className="text-primary-foreground" />
              </div>
            )}
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-5 py-4 shadow-lg',
                message.role === 'user'
                  ? 'bg-gradient-to-br from-[#90CF2A] to-[#90CF2A]/80 text-black'
                  : 'bg-gradient-to-br from-secondary/80 to-secondary/60 text-foreground border border-border/50'
              )}
            >
              <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                {message.content}
              </div>
              {message.cveData && (
                <div className="mt-3 pt-3 border-t border-border/30">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono bg-[#90CF2A]/20 text-[#90CF2A] px-2 py-1 rounded-md">
                      {message.cveData.id}
                    </span>
                    {message.cveData.metrics && (
                      <SeverityBadge severity={message.cveData.metrics.cvssMetricV31?.[0]?.cvssData?.baseSeverity} />
                    )}
                  </div>
                </div>
              )}
              {message.role === 'assistant' && (
                <div className="mt-3 pt-3 border-t border-border/30">
                  <div className="flex items-center gap-4">
                    {window.speechSynthesis && (
                      <button
                        onClick={() => handleSpeak(message.content, message.id)}
                        className={cn(
                          'flex items-center gap-2 text-xs transition-colors',
                          speakingMessageId === message.id
                            ? 'text-[#90CF2A]'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                        title={speakingMessageId === message.id ? 'Stop' : 'Read aloud'}
                      >
                        {speakingMessageId === message.id ? (
                          <>
                            <VolumeX size={14} />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 size={14} />
                            <span>Read aloud</span>
                          </>
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => handleCopy(message.content, message.id)}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copiedMessageId === message.id ? (
                        <>
                          <Check size={14} />
                          <span>Copied ✓</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            {message.role === 'user' && (
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg">
                <User size={18} className="text-accent-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SeverityBadge = ({ severity }: { severity?: string }) => {
  const badge = getSeverityBadge(severity || '');
  if (!badge) return null;
  
  return (
    <span className={cn('text-xs font-medium px-2 py-1 rounded-md border', badge.color)}>
      {badge.label}
    </span>
  );
};

export default MessageList;
