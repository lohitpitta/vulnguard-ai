import { useChatStore } from '../../stores/chatStore';
import { useEffect } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const MainChatArea = () => {
  const { currentSession, createSession } = useChatStore();

  useEffect(() => {
    if (!currentSession) {
      createSession();
    }
  }, [currentSession, createSession]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <MessageList />
      <ChatInput />
    </div>
  );
};

export default MainChatArea;
