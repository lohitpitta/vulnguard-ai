import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatSession, Message } from '../types';

interface ChatStore {
  sessions: ChatSession[];
  currentSessionId: string | null;
  currentSession: ChatSession | null;
  
  // Actions
  createSession: () => void;
  deleteSession: (sessionId: string) => void;
  setCurrentSession: (sessionId: string | null) => void;
  updateSessionTitle: (sessionId: string, title: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearCurrentSession: () => void;
  deleteAllSessions: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      currentSession: null,

      createSession: () => {
        const newSession: ChatSession = {
          id: generateId(),
          title: 'New Chat',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: newSession.id,
          currentSession: newSession,
        }));
      },

      deleteSession: (sessionId) => {
        set((state) => {
          const newSessions = state.sessions.filter((s) => s.id !== sessionId);
          const newCurrentSessionId = state.currentSessionId === sessionId 
            ? (newSessions.length > 0 ? newSessions[0].id : null)
            : state.currentSessionId;
          
          return {
            sessions: newSessions,
            currentSessionId: newCurrentSessionId,
            currentSession: newSessions.find((s) => s.id === newCurrentSessionId) || null,
          };
        });
      },

      setCurrentSession: (sessionId) => {
        const session = get().sessions.find((s) => s.id === sessionId);
        set({
          currentSessionId: sessionId,
          currentSession: session || null,
        });
      },

      updateSessionTitle: (sessionId, title) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, title, updatedAt: Date.now() } : s
          ),
          currentSession:
            state.currentSession?.id === sessionId
              ? { ...state.currentSession, title, updatedAt: Date.now() }
              : state.currentSession,
        }));
      },

      addMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: generateId(),
          timestamp: Date.now(),
        };

        set((state) => {
          if (!state.currentSessionId) return state;

          const updatedSessions = state.sessions.map((session) =>
            session.id === state.currentSessionId
              ? {
                  ...session,
                  messages: [...session.messages, newMessage],
                  updatedAt: Date.now(),
                  title: session.messages.length === 0 && message.role === 'user'
                    ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
                    : session.title,
                }
              : session
          );

          return {
            sessions: updatedSessions,
            currentSession: updatedSessions.find((s) => s.id === state.currentSessionId) || null,
          };
        });
      },

      clearCurrentSession: () => {
        set((state) => {
          if (!state.currentSessionId) return state;

          const updatedSessions = state.sessions.map((session) =>
            session.id === state.currentSessionId
              ? { ...session, messages: [], updatedAt: Date.now(), title: 'New Chat' }
              : session
          );

          return {
            sessions: updatedSessions,
            currentSession: updatedSessions.find((s) => s.id === state.currentSessionId) || null,
          };
        });
      },

      deleteAllSessions: () => {
        set({
          sessions: [],
          currentSessionId: null,
          currentSession: null,
        });
      },
    }),
    {
      name: 'cve-chat-storage',
    }
  )
);
