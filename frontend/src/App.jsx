import {useState} from 'react';
import AuthForm from "./components/authForm.jsx";
import FileUpload from "./components/fileUpload.jsx";
import FileList from "./components/fileList.jsx";

export default function App() {
    const [user, setUser] = useState(null);
    const [jwtToken, setJwtToken] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleLogout = () => {
        setUser(null);
        setJwtToken(null);
    };

    if (!user)
        return <AuthForm onLogin={(token, u) => {
            setJwtToken(token);
            setUser(u);
        }}/>;

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
                jwtToken={jwtToken} // use this for gateway/file-service
                onUpload={() => setRefreshKey((k) => k + 1)}
            />

            <div className="mt-6">
                <FileList
                    key={refreshKey}
                    userId={user.id}
                    jwtToken={jwtToken} // use this for fetching file list
                />
            </div>
        </div>
    );
}