import { useEffect, useState } from 'react';

import toast from 'react-hot-toast';

import { supabase } from '../lib/supabase';
import { formatRelativeTime, getFileTypeImage } from '../lib/utils';
import { Button, Modal } from './ui';
import { Card, CardContent } from './ui';

export default function FileList({ userId }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, file: null });

  const fetchFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from('safedocs')
      .list(`${userId}/`, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

    if (error) {
      console.error('List error:', error);
    }
    setFiles(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, [userId]);

  const handleDownload = async (file) => {
    const { data, error } = await supabase.storage.from('safedocs').download(`${userId}/${file.name}`);

    if (error) {
      console.error('Download error:', error);
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openDeleteModal = (file) => {
    setDeleteModal({ isOpen: true, file });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, file: null });
  };

  const confirmDelete = async () => {
    if (!deleteModal.file) return;

    const { error } = await supabase.storage.from('safedocs').remove([`${userId}/${deleteModal.file.name}`]);

    if (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
      return;
    }

    toast.success('File deleted successfully', {
      style: {
        background: '#fef3c7',
        color: '#78350f',
        border: '1px solid #fcd34d',
      },
    });

    closeDeleteModal();
    fetchFiles();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-amber-200 border-t-amber-700"></div>
            <p className="text-sm text-amber-700">Loading your files...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (files.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
              <svg className="h-10 w-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-amber-900">No files yet</h3>
            <p className="text-sm text-amber-700">Upload your first document to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div>
        <h2 className="mb-4 text-2xl font-semibold text-amber-900">Your Documents</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => {
            const fileType = getFileTypeImage(file.name);
            return (
              <Card key={file.id} className="group hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br ${fileType.color}`}
                    >
                      {fileType.icon}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteModal(file)}
                      className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-100 hover:text-danger-600"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </Button>
                  </div>

                  <div className="mb-4">
                    <h3 className="mb-1 truncate font-medium text-amber-900" title={file.name}>
                      {file.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-amber-600">
                      <span>{(file.metadata?.size / 1024).toFixed(2)} KB</span>
                      <span>•</span>
                      <span>{formatRelativeTime(file.created_at)}</span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" onClick={() => handleDownload(file)} className="w-full">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete File"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      >
        <p>
          Are you sure you want to delete <strong>{deleteModal.file?.name}</strong>?
        </p>
        <p className="mt-2 text-sm">This action cannot be undone.</p>
      </Modal>
    </>
  );
}
