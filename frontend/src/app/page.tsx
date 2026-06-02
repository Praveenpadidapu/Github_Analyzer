"use client";
import { FiGithub, FiZap, FiShield, FiActivity } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { particlesEnabled } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Uses Next.js API Routes for GitHub OAuth
    window.location.href = `/api/auth/github`;
  };

  return (
    <div className="relative min-h-screen bg-[#050816] flex flex-col items-center justify-center overflow-hidden font-sans">
      
      {/* Subtle Animated Background Gradients */}
      {particlesEnabled && (
        <>
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#7C3AED]/20 rounded-full blur-[150px] pointer-events-none"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#00E5FF]/10 rounded-full blur-[150px] pointer-events-none"
          />
        </>
      )}

      {/* Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Top Floating Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono mb-8 tracking-widest uppercase shadow-sm">
            <FiZap className="w-3 h-3 text-[#00E5FF]" /> AI-Powered Developer Intelligence
          </div>
        </motion.div>

        {/* Hero Text */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight text-center"
        >
          Analyze GitHub activity with
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7C3AED]">AI-powered insights</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-400 text-lg sm:text-xl mb-12 leading-relaxed max-w-2xl text-center font-medium"
        >
          The enterprise-grade platform to track commit frequency, monitor repository health, and boost your coding productivity.
        </motion.p>
        
        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="w-full glass border-white/10 shadow-2xl relative overflow-hidden bg-[#0B1120]/80 backdrop-blur-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00E5FF] via-[#7C3AED] to-[#00FFB3]"></div>
            <CardContent className="p-8 sm:p-10 flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-white text-center mb-2">Welcome Back</h2>
              <p className="text-sm text-slate-400 mb-8 text-center">Sign in to access your analytics dashboard</p>
              
              <Button 
                onClick={handleLogin}
                size="lg"
                disabled={isLoading}
                className="w-full h-14 text-base font-semibold bg-white text-black hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <FiGithub className="w-5 h-5" />
                )}
                {isLoading ? "Authenticating..." : "Continue with GitHub"}
              </Button>

              <div className="w-full flex justify-between mt-8 text-xs text-slate-500 font-mono">
                 <span className="flex items-center gap-1"><FiShield className="text-emerald-400" /> Secure OAuth</span>
                 <span className="flex items-center gap-1"><FiActivity className="text-[#00E5FF]" /> 99.9% Uptime</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}