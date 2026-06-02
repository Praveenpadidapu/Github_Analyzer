"use client";
import React from 'react';
import { FiX, FiCheck } from 'react-icons/fi';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#050505] border border-[#222] rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button onClick={onClose} className="p-2 text-[#808080] hover:text-white transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-[#808080] uppercase tracking-widest mb-3">AI Configuration</h3>
            <div className="flex items-center justify-between p-4 rounded-xl border border-[#222] bg-[#111]">
              <div>
                <p className="text-sm font-medium text-white">Strict Analysis Mode</p>
                <p className="text-xs text-[#555] mt-1">Force AI to prioritize performance suggestions.</p>
              </div>
              <div className="w-10 h-6 bg-[#00f0ff] rounded-full flex items-center p-1 cursor-pointer">
                <div className="w-4 h-4 bg-black rounded-full transform translate-x-4"></div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#808080] uppercase tracking-widest mb-3">Preferences</h3>
            <div className="flex items-center justify-between p-4 rounded-xl border border-[#222] bg-[#111]">
              <div>
                <p className="text-sm font-medium text-white">Auto-sort Repositories</p>
                <p className="text-xs text-[#555] mt-1">Sort by star count automatically.</p>
              </div>
              <div className="w-5 h-5 rounded border border-[#00f0ff] bg-[#00f0ff]/10 flex items-center justify-center">
                <FiCheck className="w-3 h-3 text-[#00f0ff]" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button onClick={onClose} className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
