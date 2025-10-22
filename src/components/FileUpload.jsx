import { useState } from 'react';

import toast from 'react-hot-toast';

import { supabase } from '../lib/supabase.js';
import { Alert } from './ui';
import { Button } from './ui';
import { Card, CardContent, CardHeader, CardTitle } from './ui';

export default function FileUpload({ userId, onUpload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    setError('');
    setSuccess('');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError('');
      setSuccess('');
    }
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
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.from('safedocs').upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get signed URL for private access
      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from('safedocs')
        .createSignedUrl(filePath, 60 * 60); // 1 hour expiry

      if (urlError) throw urlError;

      const fileUrl = signedUrlData.signedUrl;

      // Insert metadata into database
      const { error: dbError } = await supabase.from('files').insert([
        {
          user_id: userId,
          filename: file.name,
          url: fileUrl,
        },
      ]);

      if (dbError) throw dbError;

      toast.success('File uploaded successfully!', {
        style: {
          background: '#fef3c7',
          color: '#78350f',
          border: '1px solid #fcd34d',
        },
      });

      setFile(null);
      onUpload?.();
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-amber-900">Upload Document</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-all ${
            dragActive ? 'border-amber-600 bg-amber-50' : 'border-amber-300 hover:border-amber-500 hover:bg-amber-50/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            id="file-upload"
          />
          <div className="pointer-events-none">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <svg className="h-8 w-8 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="mb-2 text-sm font-medium text-amber-900">
              {file ? (
                <span className="text-amber-800">{file.name}</span>
              ) : (
                <>
                  <span className="text-amber-800">Click to upload</span> or drag and drop
                </>
              )}
            </p>
            <p className="text-xs text-amber-600">PDF, DOC, DOCX, XLS, XLSX, or any file type</p>
          </div>
        </div>
        {(error || success) && (
          <div className="mt-4">
            {error && (
              <Alert variant="error" onClose={() => setError('')}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert variant="success" onClose={() => setSuccess('')}>
                {success}
              </Alert>
            )}
          </div>
        )}
        {file && (
          <div className="mt-4 flex items-center justify-between rounded-lg bg-amber-50 p-4 border border-amber-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <svg className="h-5 w-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-900">{file.name}</p>
                <p className="text-xs text-amber-600">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <Button onClick={handleUpload} disabled={uploading} loading={uploading} size="md">
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
