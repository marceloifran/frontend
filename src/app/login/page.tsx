'use client';

import { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { LogIn, UserPlus, HelpCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();

  // If user is already logged in, redirect to chat
  if (user) {
    router.push('/chat');
    return null;
  }

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
        alert('Password reset email sent!');
        setMode('login');
      }
      router.push('/chat');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div className="glass animate-fade-in" style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '40px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Create Account'}
            {mode === 'reset' && 'Reset Password'}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {mode === 'login' && 'Sign in to continue to the chat'}
            {mode === 'register' && 'Join the future of real-time chat'}
            {mode === 'reset' && 'Enter your email to get a link'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          {mode !== 'reset' && (
            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          )}

          {error && (
            <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '15px' }}>
              {error}
            </p>
          )}

          <button className="premium-button" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                {mode === 'login' && 'Sign In'}
                {mode === 'register' && 'Create Account'}
                {mode === 'reset' && 'Send Reset Link'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center', fontSize: '0.9rem' }}>
          {mode === 'login' ? (
            <>
              <a href="#" onClick={() => setMode('register')} style={{ color: 'var(--primary-color)' }}>
                Don't have an account? <span style={{ fontWeight: '600' }}>Register here</span>
              </a>
              <a href="#" onClick={() => setMode('reset')} style={{ color: 'var(--text-muted)' }}>
                Forgot password?
              </a>
            </>
          ) : (
            <a href="#" onClick={() => setMode('login')} style={{ color: 'var(--primary-color)' }}>
              Already have an account? <span style={{ fontWeight: '600' }}>Log in</span>
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
