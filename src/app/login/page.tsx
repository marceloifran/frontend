'use client';

import { useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { LogIn, UserPlus, HelpCircle, ArrowRight, Loader2, Check, X, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();

  // If user is already logged in, redirect to chat
  useEffect(() => {
    if (user && !loading) {
      router.push('/chat');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setSuccess('Password reset link sent! Please check your inbox.');
        setMode('login');
        return; // Success, don't redirect yet
      }
      router.push('/chat');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-hide success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <main className="auth-page">
      {/* Toast Notification */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="glass"
            style={{ 
              position: 'fixed',
              top: '20px',
              left: '50%',
              zIndex: 100,
              padding: '12px 24px',
              borderLeft: '4px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              minWidth: '300px'
            }}
          >
            <div style={{ background: '#10b981', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Check size={12} color="white" />
            </div>
            <span style={{ fontSize: '0.9rem', color: '#f8fafc' }}>{success}</span>
            <button 
              onClick={() => setSuccess('')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: 'auto' }}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="auth-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass animate-fade-in" 
        style={{ 
          width: '100%', 
          maxWidth: '430px', 
          padding: '48px',
          margin: '20px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ 
              width: '64px', 
              height: '64px', 
              background: 'linear-gradient(135deg, var(--primary-color), #a855f7)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)'
            }}
          >
            <LogIn color="white" size={32} />
          </motion.div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.02em' }}>
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Create Account'}
            {mode === 'reset' && 'Reset Password'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.5' }}>
            {mode === 'login' && 'Enter your credentials to access your secure chat workspace.'}
            {mode === 'register' && 'Join our community and experience the future of secure communication.'}
            {mode === 'reset' && 'No worries! Enter your email and we\'ll send you instructions.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="e.g. alex@vision.ai" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          {mode !== 'reset' && (
            <div className="input-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Your secure password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: '46px' }}
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    opacity: 0.7,
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="error-banner"
              style={{ padding: '10px 14px', marginBottom: '20px' }}
            >
              <HelpCircle size={16} />
              <span style={{ fontSize: '0.85rem' }}>{error}</span>
            </motion.div>
          )}

          <button className="premium-button" style={{ width: '100%', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                {mode === 'login' && 'Sign In'}
                {mode === 'register' && 'Get Started'}
                {mode === 'reset' && 'Send Reset Link'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
          {mode === 'login' ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>New here?</span>
                <button 
                  onClick={() => setMode('register')} 
                  style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                >
                  Create an account
                </button>
              </div>
              <button 
                onClick={() => setMode('reset')} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', opacity: 0.8 }}
              >
                Forgot your password?
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Already have an account?</span>
              <button 
                onClick={() => setMode('login')} 
                style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: '700', cursor: 'pointer', padding: 0 }}
              >
                Log in
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </main>
  );
}
