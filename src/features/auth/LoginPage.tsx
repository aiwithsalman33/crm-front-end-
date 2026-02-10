import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, LayoutDashboard, AlertCircle, ChevronRight, ShieldCheck, Chrome, Linkedin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/shared/ui/Button';

const Logo = () => (
  <div className="flex flex-col items-center mb-10">
    <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-500">
      <LayoutDashboard className="w-7 h-7 text-white" />
    </div>
    <div className="mt-4 text-center">
      <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-1.5 uppercase">
        Ziya <span className="text-primary italic">CRM</span>
      </h1>
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.4em] mt-1.5">Intelligence Layer</p>
    </div>
  </div>
);

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading: isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] relative overflow-hidden font-sans">
      {/* Minimalist Background Accents */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/[0.02] blur-[100px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/[0.02] blur-[100px] rounded-full" />

      <div className="w-full max-w-[420px] px-6 relative z-10">
        <div className="bg-white rounded-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 p-10 md:p-12 animate-fadeIn transition-all hover:shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
          <Logo />

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-xl bg-red-50/50 border border-red-100 flex items-center gap-2.5 animate-shake">
                <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <p className="text-[10px] font-bold text-red-600 leading-tight uppercase tracking-tight">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] px-0.5">Corporate Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:border-primary/20 transition-all outline-none placeholder:text-gray-300"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-0.5">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Password</label>
                  <button type="button" className="text-[9px] font-bold text-primary/40 hover:text-primary transition-colors uppercase tracking-widest leading-none">Recover</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:border-primary/20 transition-all outline-none placeholder:text-gray-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 group cursor-pointer w-fit px-0.5">
              <label className="relative flex items-center justify-center cursor-pointer">
                <input type="checkbox" className="peer sr-only" id="remember" />
                <div className="w-3.5 h-3.5 border border-gray-200 rounded-sm bg-white peer-checked:bg-primary peer-checked:border-primary transition-all duration-200 ease-out group-hover:border-primary/50"></div>
                <svg className="w-2.5 h-2.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transform scale-50 peer-checked:scale-100 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </label>
              <label htmlFor="remember" className="text-[10px] font-bold text-gray-400 cursor-pointer select-none uppercase tracking-wide group-hover:text-gray-600 transition-colors">Remember this session</label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gray-900 hover:bg-black text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-gray-200 active:scale-[0.99] transition-all flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Access...</span>
                </div>
              ) : (
                <>
                  <span>Unlock Workspace</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center px-1"><div className="w-full border-t border-gray-50"></div></div>
              <span className="relative bg-white px-3 text-[8px] font-bold text-gray-300 uppercase tracking-[0.3em]">Access Points</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-[0.98]">
                <Chrome className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-[0.98]">
                <Linkedin className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">LinkedIn</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-1.5 text-gray-300">
          <ShieldCheck className="w-3 h-3" />
          <p className="text-[8px] font-bold uppercase tracking-[0.2em]">End-to-end CRM Encryption</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
