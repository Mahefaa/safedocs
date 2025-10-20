import {useState} from 'react';

export default function FileUpload({userId, jwtToken, onUploaded}) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files?.[0] ?? null);
        setError('');
        setSuccess('');
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);

        try {
            const res = await fetch('http://localhost:3000/files/files', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upload failed');

            setSuccess('Upload successful!');
            setFile(null);
            onUploaded?.();
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <input type="file" onChange={handleFileChange} disabled={uploading}/>

            <button
                onClick={handleUpload}
                disabled={uploading || !file}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
                {uploading ? 'Uploading…' : 'Upload'}
            </button>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
        </div>
    );
}
