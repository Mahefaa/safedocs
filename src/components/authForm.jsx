import { useState } from 'react';
import { supabase } from '../lib/supabase.js';

export default function AuthForm({ onAuth }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState('signin');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const { error } =
                mode === 'signin'
                    ? await supabase.auth.signInWithPassword({ email, password })
                    : await supabase.auth.signUp({ email, password });

            if (error) throw error;
            onAuth();
        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="">
            <h1 className="">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </h1>
            <form onSubmit={handleAuth} className="">
                <input
                    type=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=""
                    required
                    className=""
                />
                <input
                    type=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""
                    required
                    className=""
                />
                {errorMsg && <p className="">{errorMsg}</p>}
                <button
                    type=""
                    disabled={loading}
                    className=""
                >
                    {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
            </form>
            <p className="">
                {mode === 'signin' ? (
                    <>
                        Don’t have an account?{' '}
                        <button
                            onClick={() => setMode('signup')}
                            className=""
                        >
                            Register
                        </button>
                    </>
                ) : (
                    <>
                        Already have an account?{' '}
                        <button
                            onClick={() => setMode('signin')}
                            className=""
                        >
                            Sign in
                        </button>
                    </>
                )}
            </p>
        </div>
    );
}
