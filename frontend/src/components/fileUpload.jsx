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
        <div className="">
            <input type="" onChange={handleFileChange} disabled={uploading}/>

            <button
                onClick={handleUpload}
                disabled={uploading || !file}
                className=""
            >
                {uploading ? 'Uploading…' : 'Upload'}
            </button>

            {error && <p className="">{error}</p>}
            {success && <p className="">{success}</p>}
        </div>
    );
}
