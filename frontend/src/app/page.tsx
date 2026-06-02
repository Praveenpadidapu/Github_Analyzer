"use client";
import { FiGithub, FiZap, FiShield, FiActivity } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const handleLogin = () => {
    // Uses Next.js API Routes (no more Render delay)
    window.location.href = `/api/auth/github`;
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Pitch Black Theme - Cyber Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00f0ff]/10 rounded-full blur-[150px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#00ff66]/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center">
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-[#00f0ff] text-xs font-mono mb-10 tracking-widest neon-glow-cyan uppercase">
          <FiZap className="w-3 h-3" /> Next-Gen Developer Intelligence
        </div>

        {/* Hero Text */}
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-[1.1] mb-6 tracking-tighter text-center">
          Dev<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#00ff66] neon-text-cyan">Insight</span>
        </h1>
        <p className="text-[#a0a0a0] text-lg sm:text-xl mb-12 leading-relaxed max-w-2xl text-center font-medium">
          Zero latency. Instant analytics. Analyze your repository health, track commit frequency, and get actionable AI insights for your GitHub profile.
        </p>
        
        {/* Login Card */}
        <Card className="w-full max-w-md glass-panel border-[#1a1a1a] shadow-[0_0_50px_-10px_rgba(0,240,255,0.1)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00f0ff] to-[#00ff66]"></div>
          <CardContent className="p-8 sm:p-10 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Authenticate</h2>
            
            <Button 
              onClick={handleLogin}
              size="lg"
              className="w-full h-14 text-base font-bold bg-white text-black hover:bg-gray-200"
            >
              <FiGithub className="w-5 h-5 mr-3" />
              Continue with GitHub
            </Button>

            <div className="w-full flex justify-between mt-8 text-xs text-[#505050] font-mono">
               <span className="flex items-center gap-1"><FiShield /> Secure OAuth</span>
               <span className="flex items-center gap-1"><FiActivity /> Serverless Speed</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}