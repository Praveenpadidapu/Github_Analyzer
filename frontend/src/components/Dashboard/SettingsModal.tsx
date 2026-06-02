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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0F19]/80 backdrop-blur-md">
      <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">AI Configuration</h3>
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-[#0F172A]">
              <div>
                <p className="text-sm font-medium text-white">Strict Analysis Mode</p>
                <p className="text-xs text-gray-400 mt-1">Force AI to prioritize performance suggestions.</p>
              </div>
              <div className="w-10 h-6 bg-[#22D3EE] rounded-full flex items-center p-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full transform translate-x-4"></div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Preferences</h3>
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-[#0F172A]">
              <div>
                <p className="text-sm font-medium text-white">Auto-sort Repositories</p>
                <p className="text-xs text-gray-400 mt-1">Sort by star count automatically.</p>
              </div>
              <div className="w-5 h-5 rounded border border-[#22D3EE] bg-[#22D3EE]/10 flex items-center justify-center">
                <FiCheck className="w-3 h-3 text-[#22D3EE]" />
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
