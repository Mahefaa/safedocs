import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import AuthForm from './components/authForm';
import FileUpload from './components/fileUpload';
import FileList from './components/fileList';

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
        <div className="">
            <header className="">
                <h1 className="">My Files</h1>
                <button
                    onClick={handleLogout}
                    className=""
                >
                    Sign out
                </button>
            </header>

            <FileUpload userId={user.id} onUpload={() => setRefreshKey((k) => k + 1)} />

            <div className="">
                <FileList key={refreshKey} userId={user.id} />
            </div>
        </div>
    );
}