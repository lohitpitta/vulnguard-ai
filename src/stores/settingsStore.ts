import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings } from '../types';

interface SettingsStore extends AppSettings {
  // Actions
  setTheme: (theme: 'dark' | 'light') => void;
  setModel: (model: string) => void;
  setTemperature: (temperature: number) => void;
  setMaxTokens: (maxTokens: number) => void;
  setSystemPrompt: (systemPrompt: string) => void;
  resetSettings: () => void;
  showAbout: boolean;
  setShowAbout: (show: boolean) => void;
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  model: 'llama-3.3-70b-versatile',
  temperature: 0.7,
  maxTokens: 4096,
  systemPrompt: `You are a cybersecurity expert specializing in vulnerability analysis and threat intelligence. Your role is to help users understand CVEs (Common Vulnerabilities and Exposures) by providing:

1. Clear explanations of the vulnerability
2. Assessment of severity and risk
3. Potential impact on systems
4. Recommended mitigation strategies
5. Related vulnerabilities or attack patterns

When analyzing CVEs, consider:
- CVSS scores and metrics
- Affected software versions
- Exploit availability
- Patch status and availability
- Real-world exploitation evidence

Provide accurate, actionable intelligence while maintaining a professional and security-focused tone.`,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      showAbout: false,

      setTheme: (theme) => set({ theme }),
      
      setModel: (model) => set({ model }),
      
      setTemperature: (temperature) => set({ temperature }),
      
      setMaxTokens: (maxTokens) => set({ maxTokens }),
      
      setSystemPrompt: (systemPrompt) => set({ systemPrompt }),
      
      resetSettings: () => set(defaultSettings),
      
      setShowAbout: (show) => set({ showAbout: show }),
    }),
    {
      name: 'cve-settings-storage-v2',
    }
  )
);
