import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, X } from 'lucide-react';
import logo from '../assets/logo.svg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shakeForm, setShakeForm] = useState(false);

  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    try {
      const data = await login(email, password);
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch {
      setShakeForm(true);
      setTimeout(() => setShakeForm(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[40%] bg-bg mesh-pattern relative flex-col items-center justify-center p-12 border-r border-border">
        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent-glow/5 rounded-full blur-[80px]" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="animate-fade-in-up opacity-0">
            <img src={logo} alt="SecureCorp" className="w-28 h-auto mb-8 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]" />
          </div>

          <h1 className="animate-fade-in-up opacity-0 stagger-1 text-4xl font-bold font-[family-name:var(--font-heading)] bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent mb-4">
            SecureCorp
          </h1>
          <p className="animate-fade-in-up opacity-0 stagger-2 text-lg text-muted-light tracking-[0.2em] uppercase font-light mb-8">
            Enterprise. Secure. Reliable.
          </p>

          <div className="animate-fade-in-up opacity-0 stagger-3 flex items-center gap-2 px-3 py-1.5 bg-surface/50 rounded-full border border-border">
            <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse-glow" />
            <span className="text-xs text-muted">v2.4.1 — Internal Use Only</span>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-surface relative">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none" />

        {/* Mobile logo */}
        <div className="lg:hidden mb-8 flex flex-col items-center animate-fade-in-up opacity-0">
          <img src={logo} alt="SecureCorp" className="w-16 h-auto mb-4" />
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-text">SecureCorp</h1>
        </div>

        <div className={`relative z-10 w-full max-w-md ${shakeForm ? 'animate-shake' : ''}`}>
          {/* Form Header */}
          <div className="mb-8 animate-fade-in-up opacity-0">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-text mb-2">
              Welcome Back
            </h2>
            <p className="text-muted">Sign in to SecureCorp Portal</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm animate-fade-in">
              <AlertCircle size={18} className="shrink-0" />
              <span className="flex-1">{error}</span>
              <button onClick={clearError} className="shrink-0 hover:bg-danger/20 rounded p-0.5 transition-colors">
                <X size={16} />
              </button>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="animate-fade-in-up opacity-0 stagger-1">
              <label htmlFor="email" className="block text-sm font-medium text-muted-light mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@securecorp.com"
                  className="w-full pl-11 pr-4 py-3 bg-bg border border-border rounded-lg text-text placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all duration-200"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="animate-fade-in-up opacity-0 stagger-2">
              <label htmlFor="password" className="block text-sm font-medium text-muted-light mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 bg-bg border border-border rounded-lg text-text placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="animate-fade-in-up opacity-0 stagger-3 flex items-center gap-2.5">
              <button
                type="button"
                role="checkbox"
                aria-checked={rememberMe}
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all duration-200 ${
                  rememberMe
                    ? 'bg-accent border-accent'
                    : 'border-border-light hover:border-muted'
                }`}
              >
                {rememberMe && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <label
                className="text-sm text-muted cursor-pointer select-none"
                onClick={() => setRememberMe(!rememberMe)}
              >
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <div className="animate-fade-in-up opacity-0 stagger-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-accent hover:bg-accent-glow disabled:opacity-70 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:shadow-accent/40 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin-slow" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Subtle divider */}
          <div className="mt-8 animate-fade-in-up opacity-0 stagger-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted">SECURED BY SECURECORP</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <p className="text-center text-xs text-muted/60">
              Access restricted to authorized personnel only.
              <br />
              All login attempts are monitored and logged.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 text-center">
          <p className="text-xs text-muted/50">
            © 2025 SecureCorp Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
