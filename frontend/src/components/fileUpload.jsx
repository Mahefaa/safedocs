import {useState} from 'react';
import {supabase} from '../lib/supabase.js';

export default function FileUpload({userId, onUploaded}) {
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
        if (!file) {
            setError('Please select a file first.');
            return;
        }

        setUploading(true);
        setError('');
        setSuccess('');

        const filePath = `${userId}/${Date.now()}-${file.name}`;

        try {
            // 1️⃣ Upload to Supabase Storage
            const {error: uploadError} = await supabase.storage
                .from('safedocs')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2️⃣ Get signed URL for private access
            const {data: signedUrlData, error: urlError} = await supabase.storage
                .from('safedocs')
                .createSignedUrl(filePath, 60 * 60); // 1 hour expiry

            if (urlError) throw urlError;

            const fileUrl = signedUrlData.signedUrl;
            console.log('test ', {
                user_id: userId,
                filename: file.name,
                url: fileUrl,
            })
            // 3️⃣ Insert metadata into database
            const {error: dbError} = await supabase.from('files').insert([
                {
                    user_id: userId,
                    filename: file.name,
                    url: fileUrl,
                },
            ]);

            if (dbError) throw dbError;

            setSuccess('Upload successful!');
            setFile(null);
            onUploaded?.();
        } catch (err) {
            console.error('Upload failed:', err);
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
