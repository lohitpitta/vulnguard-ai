import { Moon, Sun } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useChatStore } from '../../stores/chatStore';

const TopBar = () => {
  const { theme, setTheme } = useSettingsStore();
  const { currentSession, clearCurrentSession } = useChatStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">🛡️ VulnGuard AI</h1>
        <span className="text-sm text-muted-foreground hidden sm:inline">AI-Powered CVE Intelligence Platform</span>
      </div>

      <div className="flex items-center gap-2">
        {currentSession && currentSession.messages.length > 0 && (
          <button
            onClick={clearCurrentSession}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 font-medium"
          >
            Clear Chat
          </button>
        )}
        <button
          onClick={toggleTheme}
          className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </div>
  );
};

export default TopBar;
