import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, X,
  Building2, ShieldCheck, Users, BarChart3, ArrowRight
} from 'lucide-react';

const features = [
  { icon: Users,      label: 'Employee Management', desc: 'Manage your entire workforce from one place' },
  { icon: ShieldCheck,label: 'Role-Based Access',   desc: 'Granular permissions & security controls' },
  { icon: BarChart3,  label: 'Analytics Dashboard', desc: 'Real-time insights into your organization' },
];

export default function Login() {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [shakeForm, setShakeForm]       = useState(false);

  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();
    try {
      const data = await login(email, password);
      if (data.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch {
      setShakeForm(true);
      setTimeout(() => setShakeForm(false), 600);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: 'linear-gradient(135deg, #080c14 0%, #0a0f1c 100%)',
      }}
    >
      {/* ════ LEFT PANEL — Branding ════ */}
      <div
        className="hidden lg:flex lg:w-[45%] relative flex-col overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0d1528 0%, #0a1020 50%, #080c18 100%)',
          borderRight: '1px solid rgba(30,45,66,0.6)',
        }}
      >
        {/* Dot grid */}
        <div className="absolute inset-0 dot-pattern opacity-60" />

        {/* Gradient orbs */}
        <div
          className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }}
        />

        {/* Top bar */}
        <div className="relative z-10 px-10 pt-10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 6px 20px rgba(99,102,241,0.45)',
              }}
            >
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                NexaHR
              </span>
              <span
                className="block text-[10px] uppercase tracking-widest font-medium"
                style={{ color: '#4a5568' }}
              >
                Enterprise Platform
              </span>
            </div>
          </div>
        </div>

        {/* Centre content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-10">
          <div className="animate-fade-in-up opacity-0">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6"
              style={{
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.25)',
                color: '#818cf8',
              }}
            >
              ✦ HR Management System v3.0
            </span>
            <h1 className="text-4xl xl:text-5xl font-extrabold mb-4 leading-[1.15]" style={{ fontFamily: 'var(--font-heading)', color: '#f0f4ff' }}>
              The HR Platform<br />
              <span className="gradient-text">Built for Teams</span>
            </h1>
            <p className="text-base leading-relaxed" style={{ color: '#6b7a99', maxWidth: '380px' }}>
              A complete workforce management solution with enterprise-grade security, real-time analytics, and intuitive controls.
            </p>
          </div>

          {/* Feature list */}
          <div className="mt-10 space-y-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-4 animate-fade-in-up opacity-0 stagger-${i + 2}`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.18)' }}
                  >
                    <Icon size={17} style={{ color: '#818cf8' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#c8d3e8' }}>{f.label}</p>
                    <p className="text-xs" style={{ color: '#4a5568' }}>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="relative z-10 px-10 pb-10">
          <div
            className="flex items-center gap-3 p-3.5 rounded-2xl"
            style={{
              background: 'rgba(15,22,35,0.7)',
              border: '1px solid rgba(30,45,66,0.8)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex -space-x-2">
              {['from-indigo-500 to-purple-600', 'from-emerald-500 to-teal-600', 'from-rose-500 to-pink-600'].map((g, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full bg-gradient-to-br ${g} border-2 flex items-center justify-center text-white text-[9px] font-bold`}
                  style={{ borderColor: '#0d1528' }}
                >
                  {['JD','AS','MK'][i]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: '#c8d3e8' }}>Trusted by 2,400+ employees</p>
              <p className="text-[10px]" style={{ color: '#4a5568' }}>across 12 departments worldwide</p>
            </div>
            <div className="ml-auto">
              <span
                className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}
              >
                <span className="w-1.5 h-1.5 rounded-full inline-block bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ════ RIGHT PANEL — Login Form ════ */}
      <div
        className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative"
        style={{ background: 'linear-gradient(160deg, #0c1220 0%, #080c14 100%)' }}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(99,102,241,0.07) 0%, transparent 70%)',
          }}
        />

        {/* Mobile logo */}
        <div className="lg:hidden mb-8 flex flex-col items-center animate-fade-in-up opacity-0">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 6px 20px rgba(99,102,241,0.4)' }}
          >
            <Building2 size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>NexaHR</h1>
        </div>

        <div
          className={`relative z-10 w-full max-w-md ${shakeForm ? 'animate-shake' : ''}`}
          style={{ transition: 'transform 0.1s' }}
        >
          {/* Form card */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(20,30,46,0.9), rgba(12,18,32,0.95))',
              border: '1px solid rgba(30,45,66,0.8)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Header */}
            <div className="mb-7 animate-fade-in-up opacity-0">
              <h2 className="text-2xl font-bold mb-1" style={{ color: '#f0f4ff', fontFamily: 'var(--font-heading)' }}>
                Welcome back
              </h2>
              <p className="text-sm" style={{ color: '#6b7a99' }}>
                Sign in to access your NexaHR workspace
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl text-sm animate-fade-in"
                style={{
                  background: 'rgba(244,63,94,0.08)',
                  border: '1px solid rgba(244,63,94,0.25)',
                  color: '#f43f5e',
                }}
              >
                <AlertCircle size={16} className="flex-shrink-0" />
                <span className="flex-1">{error}</span>
                <button
                  onClick={clearError}
                  className="flex-shrink-0 p-1 rounded-lg transition-colors cursor-pointer hover:bg-white/5"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="animate-fade-in-up opacity-0 stagger-1">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold mb-2 uppercase tracking-wider"
                  style={{ color: '#8896b3' }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#4a5568' }} />
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="input-field pl-10"
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="animate-fade-in-up opacity-0 stagger-2">
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#8896b3' }}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-medium cursor-pointer transition-colors"
                    style={{ color: '#6366f1' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#818cf8'}
                    onMouseLeave={e => e.currentTarget.style.color = '#6366f1'}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#4a5568' }} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="input-field pl-10 pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-lg transition-colors cursor-pointer"
                    style={{ color: '#4a5568' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#8896b3'}
                    onMouseLeave={e => e.currentTarget.style.color = '#4a5568'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="animate-fade-in-up opacity-0 stagger-3 flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={rememberMe}
                  onClick={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 rounded flex items-center justify-center transition-all duration-200 cursor-pointer flex-shrink-0"
                  style={{
                    background: rememberMe ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                    border: rememberMe ? '1px solid #6366f1' : '1px solid #2a3d57',
                    boxShadow: rememberMe ? '0 0 8px rgba(99,102,241,0.4)' : 'none',
                  }}
                >
                  {rememberMe && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5.5L4 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <label
                  className="text-sm cursor-pointer select-none"
                  style={{ color: '#6b7a99' }}
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit */}
              <div className="animate-fade-in-up opacity-0 stagger-4 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-3 text-base"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={17} className="animate-spin-slow" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Sign In to NexaHR
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="animate-fade-in-up opacity-0 stagger-5 mt-6">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: 'rgba(30,45,66,0.8)' }} />
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2a3d57' }}>
                  Secured by NexaHR
                </span>
                <div className="flex-1 h-px" style={{ background: 'rgba(30,45,66,0.8)' }} />
              </div>
              <div className="flex items-center justify-center gap-5 mt-4">
                {[
                  { icon: ShieldCheck, label: 'AES-256' },
                  { icon: Lock,        label: 'TLS 1.3' },
                  { icon: ShieldCheck, label: 'GDPR' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-1.5">
                      <Icon size={11} style={{ color: '#2a3d57' }} />
                      <span className="text-[10px] font-medium" style={{ color: '#2a3d57' }}>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[11px] mt-5" style={{ color: '#2a3d57' }}>
            © 2025 NexaHR Technologies · All rights reserved · Access restricted to authorized personnel
          </p>
        </div>
      </div>
    </div>
  );
}
