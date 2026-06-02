"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/store/useAppStore';
import { FiSettings, FiCheck, FiSave, FiRefreshCw, FiUser, FiGithub, FiDownload, FiTrash2, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { 
    accentColor, setAccentColor, 
    animationsEnabled, setAnimationsEnabled,
    particlesEnabled, setParticlesEnabled,
    githubToken, setGithubToken,
    userProfile
  } = useAppStore();

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Local state for token input before saving
  const [localToken, setLocalToken] = useState('');
  const [dataRefreshInterval, setDataRefreshInterval] = useState('always');

  useEffect(() => {
    setMounted(true);
    setLocalToken(githubToken || '');
  }, [githubToken]);

  const colors = [
    { name: 'Cyan', value: '#00E5FF' },
    { name: 'Purple', value: '#7C3AED' },
    { name: 'Emerald', value: '#10B981' },
    { name: 'Rose', value: '#F43F5E' },
    { name: 'Amber', value: '#F59E0B' },
  ];

  const handleSaveToken = () => {
    if (localToken && !localToken.startsWith('gh')) {
      toast.error('Invalid token format. GitHub tokens usually start with ghp_, gho_, etc.');
      return;
    }
    setGithubToken(localToken);
    toast.success('GitHub Token updated securely.');
  };

  const handleResetDefaults = () => {
    if (confirm("Are you sure you want to reset all visual preferences to default?")) {
      setTheme('dark');
      setAccentColor('#00E5FF');
      setAnimationsEnabled(true);
      setParticlesEnabled(true);
      toast.success('Settings reset to defaults.');
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <FiSettings className="text-primary" /> Application Settings
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage your dashboard preferences, API tokens, and account configuration.</p>
        </div>
        <button 
          onClick={handleResetDefaults}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
        >
          <FiRefreshCw className="w-4 h-4" /> Reset to defaults
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Profile & API */}
        <div className="md:col-span-1 space-y-6">
          {/* Profile Summary */}
          <Card className="glass-panel">
            <CardHeader className="pb-4 border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2"><FiUser className="text-slate-400" /> GitHub Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#7C3AED] to-primary p-[2px] mb-4">
                <img 
                  src={userProfile?.avatar_url || "https://github.com/identicons/devinsight.png"} 
                  alt="Profile" 
                  className="w-full h-full rounded-full border-4 border-background object-cover"
                />
              </div>
              <h3 className="font-semibold text-foreground text-lg">{userProfile?.name || 'Developer'}</h3>
              <p className="text-sm text-slate-400">@{userProfile?.login || 'username'}</p>
              
              <div className="mt-4 w-full pt-4 border-t border-border grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Followers</p>
                  <p className="font-medium text-foreground">{userProfile?.followers || 0}</p>
                </div>
                <div>
                  <p className="text-slate-500">Following</p>
                  <p className="font-medium text-foreground">{userProfile?.following || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GitHub Token / Rate Limits */}
          <Card className="glass-panel">
            <CardHeader className="pb-4 border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2"><FiGithub className="text-slate-400" /> API Configuration</CardTitle>
              <CardDescription className="text-xs text-slate-400">Provide a Personal Access Token to increase your GitHub API rate limits.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Personal Access Token</label>
                <Input 
                  type="password" 
                  value={localToken}
                  onChange={(e) => setLocalToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="bg-surface border-border text-foreground text-sm"
                />
              </div>
              <button 
                onClick={handleSaveToken}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 text-black py-2 rounded font-medium text-sm transition-colors"
              >
                <FiSave className="w-4 h-4" /> Save Token
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Preferences */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Appearance */}
          <Card className="glass-panel">
            <CardHeader className="pb-4 border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2">Appearance</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              
              {/* Theme Selection */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Application Theme</p>
                  <p className="text-xs text-slate-400 mt-1">Select your preferred color scheme</p>
                </div>
                <div className="flex items-center gap-2 bg-surface border border-border p-1 rounded-lg">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${theme === 'light' ? 'bg-background text-foreground shadow-sm' : 'text-slate-400 hover:text-foreground'}`}
                  >
                    <FiSun className="w-4 h-4" /> Light
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-background text-foreground shadow-sm' : 'text-slate-400 hover:text-foreground'}`}
                  >
                    <FiMoon className="w-4 h-4" /> Dark
                  </button>
                  <button 
                    onClick={() => setTheme('system')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${theme === 'system' ? 'bg-background text-foreground shadow-sm' : 'text-slate-400 hover:text-foreground'}`}
                  >
                    System
                  </button>
                </div>
              </div>

              {/* Accent Color */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-300">Accent Color</label>
                <div className="flex flex-wrap gap-4">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setAccentColor(color.value)}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none"
                      style={{ backgroundColor: color.value, boxShadow: accentColor === color.value ? `0 0 15px ${color.value}80` : 'none' }}
                    >
                      {accentColor === color.value && <FiCheck className="text-black w-5 h-5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">UI Animations</p>
                    <p className="text-xs text-slate-400 mt-1">Smooth hover effects</p>
                  </div>
                  <button 
                    onClick={() => setAnimationsEnabled(!animationsEnabled)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${animationsEnabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${animationsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Background Particles</p>
                    <p className="text-xs text-slate-400 mt-1">Glowing orbs on login</p>
                  </div>
                  <button 
                    onClick={() => setParticlesEnabled(!particlesEnabled)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${particlesEnabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${particlesEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Data & Export */}
          <Card className="glass-panel">
            <CardHeader className="pb-4 border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2"><FiDownload className="text-slate-400" /> Data & Export</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Data Refresh Preferences</p>
                  <p className="text-xs text-slate-400 mt-1">How often should dashboard data bypass cache?</p>
                </div>
                <select 
                  className="bg-surface border border-border text-foreground text-sm rounded px-3 py-2 outline-none focus:ring-1 focus:ring-primary"
                  value={dataRefreshInterval}
                  onChange={(e) => {
                    setDataRefreshInterval(e.target.value);
                    toast.success('Refresh preference updated.');
                  }}
                >
                  <option value="always">Always fetch latest (Recommended)</option>
                  <option value="hourly">Cache for 1 hour</option>
                  <option value="daily">Cache for 1 day</option>
                </select>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Export App Data</p>
                  <p className="text-xs text-slate-400 mt-1">Download your global settings and configurations.</p>
                </div>
                <button 
                  onClick={() => toast.success('Data exported successfully! (Mocked)')}
                  className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-hover text-foreground rounded text-sm font-medium transition-colors border border-border"
                >
                  <FiDownload className="w-4 h-4" /> Export JSON
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Danger Zone */}
          <Card className="glass-panel border-red-500/20">
            <CardHeader className="pb-4 border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2 text-red-400"><FiTrash2 /> Privacy & Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Clear Local Storage</p>
                  <p className="text-xs text-slate-400 mt-1">Removes all saved preferences and cached data.</p>
                </div>
                <button 
                  onClick={() => {
                    if (confirm("Are you sure you want to clear all local data? You will be logged out.")) {
                      localStorage.clear();
                      window.location.href = '/';
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-sm font-medium transition-colors border border-red-500/20"
                >
                  <FiTrash2 className="w-4 h-4" /> Clear Data
                </button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
