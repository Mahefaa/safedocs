import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function FileList({ userId }) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFiles = async () => {
        setLoading(true);
        const { data, error } = await supabase.storage
            .from('safedocs')
            .list(`${userId}/`, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

        if (error) console.error('List error:', error);
        setFiles(data ?? []);
        setLoading(false);
    };

    useEffect(() => {
        fetchFiles();
    }, [userId]);

    if (loading) return <p className="text-gray-500">Loading files…</p>;
    if (files.length === 0) return <p className="text-gray-400">No files yet.</p>;

    return (
        <ul className="space-y-2">
            {files.map((file) => {
                const { publicUrl } = supabase.storage
                    .from('safedocs')
                    .getPublicUrl(`${userId}/${file.filename}`).data;
                console.log(file)
                return (
                    <li key={file.id}>
                        <a
                            href={publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline"
                        >
                            {file.name}
                        </a>
                    </li>
                );
            })}
        </ul>
    );
}
