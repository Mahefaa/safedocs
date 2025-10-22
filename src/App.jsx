import { useEffect, useState } from 'react';

import { Toaster } from 'react-hot-toast';

import AuthForm from './components/AuthForm';
import FileList from './components/FileList';
import FileUpload from './components/FileUpload';
import { Button } from './components/ui';
import { supabase } from './lib/supabase';

export default function App() {
  const [user, setUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };
    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (!user) return <AuthForm onAuth={() => setRefreshKey((k) => k + 1)} />;

  return (
    <div className="min-h-screen bg-amber-50/30">
      <header className="sticky top-0 z-50 border-b border-amber-200/50 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="h-8 w-8 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div>
                <h1 className="text-xl font-bold text-amber-900">SafeDocs</h1>
                <p className="text-xs text-amber-700">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-fade-in space-y-6">
          <FileUpload userId={user.id} onUpload={() => setRefreshKey((k) => k + 1)} />
          <FileList key={refreshKey} userId={user.id} />
        </div>
      </main>
    </div>
  );
}
