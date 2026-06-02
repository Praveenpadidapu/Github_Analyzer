"use client";
import { FiGithub, FiZap, FiShield, FiBarChart2 } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/github`;
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden">
      {/* Background Animated Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl w-full px-6 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        {/* Left Side: Branding */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono mb-8 font-semibold tracking-wide shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]">
            <FiZap className="animate-pulse" /> AI-POWERED CODE INTELLIGENCE
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-100 leading-[1.1] mb-6 tracking-tight">
            Dev<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Insight</span> AI
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
            The ultimate engineering dashboard. Analyze repository health, track commit frequency, and get actionable AI-generated insights for your GitHub profile.
          </p>
          
          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto lg:mx-0">
            <div className="flex items-center justify-center lg:justify-start gap-3 text-sm font-semibold text-slate-300">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <FiShield className="text-emerald-400 w-5 h-5" />
              </div>
              Secure OAuth
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-3 text-sm font-semibold text-slate-300">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FiBarChart2 className="text-blue-400 w-5 h-5" />
              </div>
              Real-time Analytics
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full max-w-md">
          <Card className="border-indigo-500/20 shadow-[0_0_50px_-12px_rgba(99,102,241,0.15)] bg-slate-900/50 backdrop-blur-2xl">
            <CardContent className="p-8 sm:p-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/25">
                <FiGithub className="text-white w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-100 text-center mb-2">Welcome Back</h2>
              <p className="text-slate-400 text-center text-sm mb-8 font-medium">Connect your GitHub workspace to begin</p>
              
              <Button 
                onClick={handleLogin}
                size="lg"
                className="w-full h-14 text-base font-bold shadow-indigo-500/25"
              >
                <FiGithub className="w-5 h-5 mr-2" />
                Continue with GitHub
              </Button>

              <p className="mt-8 text-[10px] text-center text-slate-500 uppercase tracking-widest leading-relaxed font-semibold">
                By connecting, you agree to our <br/> Terms of Service & Privacy Policy
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}