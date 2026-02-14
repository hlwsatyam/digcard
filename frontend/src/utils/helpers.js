// Utility helper functions

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  
  return new Date(date).toLocaleDateString('en-IN', defaultOptions);
};

// Format date time
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate random color
export const getRandomColor = () => {
  const colors = [
    '#1a56db', '#0e9f6e', '#ffc107', '#ff4d4f', '#1890ff',
    '#7e3af2', '#16a34a', '#dc2626', '#ea580c', '#9333ea',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate mobile number (Indian)
export const isValidMobile = (mobile) => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

// Get file extension
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Get file icon based on extension
export const getFileIcon = (filename) => {
  const ext = getFileExtension(filename).toLowerCase();
  
  const iconMap = {
    jpg: 'file-image',
    jpeg: 'file-image',
    png: 'file-image',
    gif: 'file-image',
    pdf: 'file-pdf',
    doc: 'file-word',
    docx: 'file-word',
    xls: 'file-excel',
    xlsx: 'file-excel',
    ppt: 'file-ppt',
    pptx: 'file-ppt',
    txt: 'file-text',
    zip: 'file-zip',
    rar: 'file-zip',
    default: 'file',
  };
  
  return iconMap[ext] || iconMap.default;
};

// Download file
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Copy to clipboard
export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Text copied to clipboard');
    })
    .catch(err => {
      console.error('Failed to copy text: ', err);
    });
};

// Generate QR code data URL
export const generateQRCodeData = (data) => {
  return `data:image/png;base64,${data}`;
};