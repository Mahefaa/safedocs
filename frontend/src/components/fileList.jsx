import {useEffect, useState} from 'react';

const FILE_SERVICE_URL = `http://localhost:3000/files`;

export default function FileList({userId, jwtToken}) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchFiles = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${FILE_SERVICE_URL}/files?userId=${userId}`, {
                method: "",
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch files');
            const data = await res.json();
            setFiles(data.files ?? []);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchFiles();
    }, [userId]);

    if (loading) return <p>Loading files…</p>;
    if (error) return <p className="">{error}</p>;
    if (files.length === 0) return <p>No files yet.</p>;

    return (
        <ul className="">
            {files.map((file) => (
                <li key={file.id}>
                    <a href={file.url} target="" rel="">
                        {file.filename}
                    </a>
                </li>
            ))}
        </ul>
    );
}

