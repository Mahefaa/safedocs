import { useState } from 'react';

export default function AuthForm({ onLogin }) {
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
            const url = mode === 'signin'
                ? 'http://localhost:3000/auth/login'
                : 'http://localhost:3000/auth/signup';

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText);
            }

            const { jwtToken, user } = await res.json();
            onLogin(jwtToken, user); // send JWT and user to App.jsx
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
                            type=""
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
                            type=""
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