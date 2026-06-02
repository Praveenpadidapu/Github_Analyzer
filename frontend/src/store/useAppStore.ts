import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  
  githubToken: string | null;
  setGithubToken: (token: string | null) => void;
  
  userProfile: { login: string; avatar_url: string; name: string } | null;
  setUserProfile: (profile: any) => void;
  
  // Settings
  accentColor: string;
  setAccentColor: (color: string) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  compactMode: boolean;
  setCompactMode: (enabled: boolean) => void;
  particlesEnabled: boolean;
  setParticlesEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      
      theme: 'dark', // App is dark mode only primarily, but keeping toggle for future proofing
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      
      globalSearchQuery: '',
      setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),
      
      githubToken: null,
      setGithubToken: (token) => set({ githubToken: token }),
      
      userProfile: null,
      setUserProfile: (profile) => set({ userProfile: profile }),
      
      accentColor: '#00E5FF',
      setAccentColor: (color) => set({ accentColor: color }),
      
      animationsEnabled: true,
      setAnimationsEnabled: (enabled) => set({ animationsEnabled: enabled }),
      
      compactMode: false,
      setCompactMode: (enabled) => set({ compactMode: enabled }),
      
      particlesEnabled: true,
      setParticlesEnabled: (enabled) => set({ particlesEnabled: enabled }),
    }),
    {
      name: 'devinsights-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({
        // only save these fields to localStorage
        theme: state.theme,
        accentColor: state.accentColor,
        animationsEnabled: state.animationsEnabled,
        compactMode: state.compactMode,
        particlesEnabled: state.particlesEnabled,
        isSidebarOpen: state.isSidebarOpen,
        githubToken: state.githubToken,
        userProfile: state.userProfile,
      }),
    }
  )
);
