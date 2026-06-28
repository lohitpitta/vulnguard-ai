import { Plus, Trash2, MessageSquare, Shield, Info } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { cn } from '../../utils/cn';

const Sidebar = () => {
  const { sessions, currentSessionId, createSession, deleteSession, setCurrentSession } = useChatStore();
  const { setShowAbout } = useSettingsStore();

  return (
    <div className="w-[280px] bg-secondary/50 border-r border-border flex flex-col backdrop-blur-sm">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
            <Shield className="text-primary-foreground" size={20} />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">VulnGuard AI</h1>
            <p className="text-xs text-muted-foreground">CVE Intelligence</p>
          </div>
        </div>
        <button
          onClick={createSession}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#90CF2A] text-black rounded-xl hover:bg-[#7FB822] transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
        >
          <Plus size={18} />
          <span>New Chat</span>
        </button>
        <button
          onClick={() => setShowAbout(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary/50 text-foreground rounded-xl hover:bg-secondary transition-all duration-200 font-medium text-sm mt-2"
        >
          <Info size={18} />
          <span>About</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageSquare size={32} className="mb-2 opacity-50" />
            <p className="text-sm">No chats yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  'group relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200',
                  currentSessionId === session.id
                    ? 'bg-[#90CF2A]/20 text-accent-foreground border border-[#90CF2A]/30 shadow-sm'
                    : 'hover:bg-[#334254] text-muted-foreground hover:text-foreground hover:scale-[1.02] hover:shadow-sm'
                )}
                onClick={() => setCurrentSession(session.id)}
              >
                <MessageSquare size={16} className={cn(currentSessionId === session.id ? 'text-primary' : '')} />
                <span className="flex-1 truncate text-sm font-medium">{session.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          AI-Powered CVE Intelligence Platform
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
