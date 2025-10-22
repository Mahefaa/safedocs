import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with clsx and tailwind-merge
 * @param {...any} inputs - Class names to merge
 * @returns {string} Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted relative time
 */
export function formatRelativeTime(date) {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return past.toLocaleDateString();
}

/**
 * Get file extension from filename
 * @param {string} filename - File name
 * @returns {string} File extension
 */
export function getFileExtension(filename) {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

/**
 * Get file icon based on file type
 * @param {string} filename - File name
 * @returns {string} Icon name
 */
export function getFileIcon(filename) {
  const ext = getFileExtension(filename).toLowerCase();

  const iconMap = {
    // Documents
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    txt: '📝',
    rtf: '📝',

    // Spreadsheets
    xls: '📊',
    xlsx: '📊',
    csv: '📊',

    // Presentations
    ppt: '📊',
    pptx: '📊',

    // Images
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    svg: '🖼️',
    webp: '🖼️',

    // Videos
    mp4: '🎥',
    avi: '🎥',
    mov: '🎥',
    wmv: '🎥',

    // Audio
    mp3: '🎵',
    wav: '🎵',
    flac: '🎵',

    // Archives
    zip: '📦',
    rar: '📦',
    '7z': '📦',
    tar: '📦',
    gz: '📦',

    // Code
    js: '💻',
    jsx: '💻',
    ts: '💻',
    tsx: '💻',
    py: '💻',
    java: '💻',
    cpp: '💻',
    c: '💻',
    html: '💻',
    css: '💻',
  };

  return iconMap[ext] || '📎';
}

/**
 * Get file type image/illustration
 * @param {string} filename - File name
 * @returns {object} Object with color and icon component
 */
export function getFileTypeImage(filename) {
  const ext = getFileExtension(filename).toLowerCase();

  if (['pdf'].includes(ext)) {
    return {
      color: 'from-red-100 to-red-200',
      icon: (
        <svg className="h-8 w-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <path d="M14 2v6h6M9 13h6M9 17h6M9 9h1" />
        </svg>
      ),
    };
  }

  if (['doc', 'docx'].includes(ext)) {
    return {
      color: 'from-blue-100 to-blue-200',
      icon: (
        <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <path d="M14 2v6h6M10 9H8M16 13H8M16 17H8" />
        </svg>
      ),
    };
  }

  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return {
      color: 'from-green-100 to-green-200',
      icon: (
        <svg className="h-8 w-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <path d="M14 2v6h6M8 13h8M8 17h8M8 9h2" />
        </svg>
      ),
    };
  }

  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
    return {
      color: 'from-purple-100 to-purple-200',
      icon: (
        <svg className="h-8 w-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
      ),
    };
  }

  if (['mp4', 'avi', 'mov', 'wmv'].includes(ext)) {
    return {
      color: 'from-pink-100 to-pink-200',
      icon: (
        <svg className="h-8 w-8 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
        </svg>
      ),
    };
  }

  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return {
      color: 'from-yellow-100 to-yellow-200',
      icon: (
        <svg className="h-8 w-8 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <path d="M12 18v-6M9 15h6" />
        </svg>
      ),
    };
  }

  return {
    color: 'from-amber-100 to-amber-200',
    icon: (
      <svg className="h-8 w-8 text-amber-700" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
        <path d="M14 2v6h6" />
      </svg>
    ),
  };
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 50) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
