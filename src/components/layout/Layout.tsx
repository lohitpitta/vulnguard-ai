import { useEffect } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MainChatArea from '../chat/MainChatArea';
import AboutModal from './AboutModal';

const Layout = () => {
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.remove('light');
    } else {
      root.classList.add('light');
    }
  }, [theme]);

  return (
    <div className="flex h-screen bg-[#1B2436] text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <MainChatArea />
      </div>
      <AboutModal />
    </div>
  );
};

export default Layout;
