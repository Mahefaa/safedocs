import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase.js';
import AuthForm from "./components/authForm.jsx";
import FileUpload from "./components/fileUpload.jsx";
import FileList from "./components/fileList.jsx";

export default function App() {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const initAuth = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data?.session ?? null);
            setUser(data?.session?.user ?? null);
        };
        initAuth();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
    };

    if (!user) return <AuthForm onLogin={(jwt, u) => setSession({ access_token: jwt, user: u })} />;

    return (
        <div className="p-8 max-w-lg mx-auto font-sans">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">My Files</h1>
                <button
                    onClick={handleLogout}
                    className="px-3 py-1 text-sm bg-gray-800 text-white rounded-md hover:bg-gray-700"
                >
                    Sign out
                </button>
            </header>

            <FileUpload
                userId={user.id}
                jwtToken={session?.access_token} // pass JWT for uploads if needed
                onUpload={() => setRefreshKey((k) => k + 1)}
            />

            <div className="mt-6">
                <FileList
                    key={refreshKey}
                    userId={user.id}
                    jwtToken={session?.access_token} // pass JWT for listing
                />
            </div>
        </div>
    );
}