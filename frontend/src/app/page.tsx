"use client";
import { FiGithub, FiZap, FiShield, FiBarChart2 } from "react-icons/fi";

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/github";
  };

  return (
    <div className="relative min-h-screen bg-[#020617] flex items-center justify-center overflow-hidden">
      {/* Background Animated Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>

      <div className="relative z-10 max-w-4xl w-full px-6 flex flex-col md:flex-row items-center gap-16">
        {/* Left Side: Branding */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono mb-6">
            <FiZap className="animate-pulse" /> AI-POWERED CODE INTELLIGENCE
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            Dev<span className="text-indigo-500">Insight</span> AI
          </h1>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            The ultimate engineering dashboard. Analyze repository health, track commit frequency, and get AI-generated insights for your GitHub profile.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FiShield className="text-green-500" /> Secure OAuth
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FiBarChart2 className="text-blue-500" /> Real-time Analytics
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full max-w-sm">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
            <h2 className="text-2xl font-bold text-white text-center mb-2">Welcome Back</h2>
            <p className="text-gray-500 text-center text-sm mb-10">Connect your GitHub to begin</p>
            
            <button 
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-200 py-4 rounded-2xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <FiGithub size={20} />
              Continue with GitHub
            </button>

            <p className="mt-8 text-[10px] text-center text-gray-600 uppercase tracking-widest leading-relaxed">
              By connecting, you agree to our <br/> Terms of Service & Privacy Policy
            </p>
          </div>
        </div>
      </div>

      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
    </div>
  );
}