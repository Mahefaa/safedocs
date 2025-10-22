import { useState } from 'react';

import toast from 'react-hot-toast';

import { supabase } from '../lib/supabase.js';
import { Alert } from './ui';
import { Button } from './ui';
import { Input } from './ui';

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState('signin');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuth();
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        toast.success('Account created! Please check your email to verify your account.', {
          duration: 6000,
          position: 'top-center',
          style: {
            background: '#fef3c7',
            color: '#78350f',
            border: '1px solid #fcd34d',
          },
        });

        setEmail('');
        setPassword('');
        setMode('signin');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full items-center justify-center bg-amber-50/30 px-8 py-12 lg:w-1/2">
        <div className="w-full max-w-md animate-fade-in">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-amber-900">
                {mode === 'signin' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="mt-1 text-sm text-amber-600">
                {mode === 'signin'
                  ? 'Sign in to access your secure documents'
                  : 'Get started with your secure document storage'}
              </p>
            </div>
            <form onSubmit={handleAuth} className="space-y-4">
              <Input
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
              <Input
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                helperText={mode === 'signup' ? 'Minimum 6 characters' : ''}
              />
              {errorMsg && (
                <Alert variant="error" onClose={() => setErrorMsg('')}>
                  {errorMsg}
                </Alert>
              )}
              <Button type="submit" disabled={loading} loading={loading} className="w-full" size="lg">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
            <div className="text-center">
              <p className="text-sm text-amber-700">
                {mode === 'signin' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => setMode('signup')}
                      className="font-semibold text-amber-800 transition-colors hover:text-amber-900"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => setMode('signin')}
                      className="font-semibold text-amber-800 transition-colors hover:text-amber-900"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block lg:w-1/2">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544396821-4dd40b938ad3?q=80&w=2073&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 via-amber-800/70 to-amber-700/60" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-4">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <div>
              <h1 className="text-2xl font-bold">SafeDocs</h1>
              <p className="text-sm text-amber-100">Secure document storage made simple</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold">Store your documents securely</h3>
              <p className="text-lg text-amber-100">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor saepe, quis voluptatem assumenda nesciunt
                numquam facilis alias, consectetur eligendi provident cupiditate iure culpa sit consequuntur suscipit,
                aut perferendis! Ut, quod!
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg className="mt-1 h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium">End-to-end encryption</p>
                  <p className="text-sm text-amber-100">Your files are encrypted and secure</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="mt-1 h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium">Access anywhere</p>
                  <p className="text-sm text-amber-100">Available on all your devices</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="mt-1 h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium">Easy sharing</p>
                  <p className="text-sm text-amber-100">Share files securely with anyone</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
