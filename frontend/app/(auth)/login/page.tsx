'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';

const DEMO_EMAIL = 'officer@smartpark.gov.in';
const DEMO_PASSWORD = 'enforce123';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      localStorage.setItem('officer_logged_in', 'true');
      localStorage.setItem('officer_email', email);
      router.push('/overview');
    } else {
      setError('Invalid credentials. Please check your email and password.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] px-4">
      <div
        className="rounded-2xl border bg-[#12151B] p-8 shadow-2xl"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-[#4C6FFF]/15 border border-[#4C6FFF]/30 mb-4">
            <Shield className="h-7 w-7 text-[#4C6FFF]" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#EDEEF1] tracking-tight">
              SmartPark Enforcer
            </div>
            <div className="text-xs text-[#5B6070] mt-0.5 font-mono uppercase tracking-widest">
              AI · v2.0
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-[#EDEEF1]">Officer Login</h1>
          <p className="text-sm text-[#9096A3] mt-1">Municipal Traffic Enforcement System</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#EF4444]" />
            <p className="text-sm text-[#EF4444]">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-[#9096A3] mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5B6070]"
                strokeWidth={1.5}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="officer@smartpark.gov.in"
                className="w-full rounded-lg border bg-[#191D25] pl-10 pr-4 py-2.5 text-sm text-[#EDEEF1] placeholder:text-[#5B6070] outline-none focus:border-[#4C6FFF]/60 focus:ring-1 focus:ring-[#4C6FFF]/30 transition-all"
                style={{ borderColor: 'rgba(255,255,255,0.07)' }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-[#9096A3] mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5B6070]"
                strokeWidth={1.5}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-lg border bg-[#191D25] pl-10 pr-10 py-2.5 text-sm text-[#EDEEF1] placeholder:text-[#5B6070] outline-none focus:border-[#4C6FFF]/60 focus:ring-1 focus:ring-[#4C6FFF]/30 transition-all"
                style={{ borderColor: 'rgba(255,255,255,0.07)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5B6070] hover:text-[#9096A3] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                ) : (
                  <Eye className="h-4 w-4" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* Demo hint */}
          <div
            className="rounded-lg border px-3 py-2 text-xs text-[#5B6070]"
            style={{ borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}
          >
            <span className="text-[#9096A3] font-medium">Demo: </span>
            officer@smartpark.gov.in / enforce123
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#4C6FFF] py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#3d5ce6] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Authenticating…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="mt-6 text-center text-[11px] text-[#5B6070]">
        SmartPark Enforcer v2.0 | Municipal Traffic Authority
      </p>
    </div>
  );
}
