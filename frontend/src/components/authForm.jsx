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
                ? 'http://localhost:4000/login'
                : 'http://localhost:4000/signup';

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
        <div className="max-w-sm mx-auto mt-20 p-6 border rounded-lg shadow-sm">
            <h1 className="text-2xl font-semibold text-center mb-6">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </h1>
            <form onSubmit={handleAuth} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full p-2 border rounded"
                />
                {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                    {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
            </form>
            <p className="text-sm text-center mt-4 text-gray-600">
                {mode === 'signin' ? (
                    <>
                        Don’t have an account?{' '}
                        <button
                            type="button"
                            onClick={() => setMode('signup')}
                            className="text-indigo-600 hover:underline"
                        >
                            Register
                        </button>
                    </>
                ) : (
                    <>
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={() => setMode('signin')}
                            className="text-indigo-600 hover:underline"
                        >
                            Sign in
                        </button>
                    </>
                )}
            </p>
        </div>
    );
}