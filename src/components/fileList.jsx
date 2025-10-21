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

    if (loading) return <p className="">Loading files…</p>;
    if (files.length === 0) return <p className="">No files yet.</p>;

    return (
        <ul className="">
            {files.map((file) => {
                const { publicUrl } = supabase.storage
                    .from('safedocs')
                    .getPublicUrl(`${userId}/${file.filename}`).data;
                console.log(file)
                return (
                    <li key={file.id}>
                        <a
                            href={publicUrl}
                            target=""
                            rel=""
                            className=""
                        >
                            {file.name}
                        </a>
                    </li>
                );
            })}
        </ul>
    );
}
