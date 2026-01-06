'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      // Redirect will happen via useAuth hook
      router.push('/admin');
    } catch (err: any) {
      console.error('[Login] Error:', err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-luxury-gold/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-br from-luxury-gold/8 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="mt-6 text-center text-4xl font-serif font-bold text-white mb-2">
          Admin Login
        </h2>
        <div className="w-48 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto mb-4"></div>
        <p className="text-center text-sm text-luxury-gold/70 font-serif">
          ChauffeurTop Melbourne
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-black/50 backdrop-blur-md py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-luxury-gold/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-[10px] text-luxury-gold uppercase tracking-wider font-bold mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white text-sm placeholder:text-white/30 focus:border-luxury-gold focus:outline-none transition-all"
                placeholder="admin@chauffeurtop.com.au"
              />
            </div>

            {/* Password */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-[10px] text-luxury-gold uppercase tracking-wider font-bold mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white text-sm placeholder:text-white/30 focus:border-luxury-gold focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-luxury-gold text-luxury-black hover:bg-white hover:text-black font-bold uppercase tracking-widest py-4 px-6 rounded-sm transition-all duration-300 shadow-lg hover:shadow-xl text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-luxury-gold"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-luxury-black border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-center text-xs text-white/50">
              Protected access for authorized personnel only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


