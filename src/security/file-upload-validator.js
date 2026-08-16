/**
 * CampusCare File Upload Validator
 * 
 * Validates file uploads by checking:
 * 1. File extension (allowlist)
 * 2. File size (configurable max)
 * 3. MIME type via magic bytes (not just extension)
 * 
 * Files that don't pass ALL checks are rejected entirely.
 */

// Configurable limits
const FILE_UPLOAD_CONFIG = {
  maxSizeBytes: 10 * 1024 * 1024, // 10 MB
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.heic', '.webp'],
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/heic', 'image/webp'],
};

/**
 * Magic byte signatures for common image formats.
 * We read the first few bytes of the file to verify its actual type.
 */
const MAGIC_BYTES = {
  'image/jpeg': [
    [0xFF, 0xD8, 0xFF],
  ],
  'image/png': [
    [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
  ],
  'image/webp': [
    // RIFF....WEBP — bytes 0-3 are RIFF, bytes 8-11 are WEBP
    null, // Special handling below
  ],
  'image/heic': [
    // ftyp at offset 4
    null, // Special handling below
  ],
};

/**
 * Read the first N bytes of a file as a Uint8Array.
 * @param {File} file
 * @param {number} numBytes
 * @returns {Promise<Uint8Array>}
 */
function readFileHeader(file, numBytes = 12) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result));
    reader.onerror = () => reject(new Error('Failed to read file header.'));
    reader.readAsArrayBuffer(file.slice(0, numBytes));
  });
}

/**
 * Check if a byte array starts with a given signature.
 * @param {Uint8Array} bytes
 * @param {number[]} signature
 * @param {number} [offset=0]
 * @returns {boolean}
 */
function matchesSignature(bytes, signature, offset = 0) {
  for (let i = 0; i < signature.length; i++) {
    if (bytes[offset + i] !== signature[i]) return false;
  }
  return true;
}

/**
 * Detect the real MIME type from file header bytes.
 * @param {Uint8Array} header
 * @returns {string|null} Detected MIME type or null
 */
function detectMimeFromHeader(header) {
  // JPEG: starts with FF D8 FF
  if (matchesSignature(header, [0xFF, 0xD8, 0xFF])) {
    return 'image/jpeg';
  }

  // PNG: starts with 89 50 4E 47 0D 0A 1A 0A
  if (matchesSignature(header, [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) {
    return 'image/png';
  }

  // WebP: starts with RIFF, bytes 8-11 are WEBP
  if (matchesSignature(header, [0x52, 0x49, 0x46, 0x46]) &&
      header.length >= 12 &&
      matchesSignature(header, [0x57, 0x45, 0x42, 0x50], 8)) {
    return 'image/webp';
  }

  // HEIC/HEIF: bytes 4-7 contain 'ftyp'
  if (header.length >= 8 && matchesSignature(header, [0x66, 0x74, 0x79, 0x70], 4)) {
    return 'image/heic';
  }

  return null;
}

/**
 * Validate a file upload.
 * 
 * @param {File} file - The File object to validate
 * @returns {Promise<{ valid: boolean, errors: string[] }>}
 */
export async function validateFileUpload(file) {
  const errors = [];

  if (!file) {
    return { valid: false, errors: ['No file selected.'] };
  }

  // 1. Check file size
  if (file.size > FILE_UPLOAD_CONFIG.maxSizeBytes) {
    const maxMB = (FILE_UPLOAD_CONFIG.maxSizeBytes / (1024 * 1024)).toFixed(0);
    const fileMB = (file.size / (1024 * 1024)).toFixed(1);
    errors.push(`File is too large (${fileMB} MB). Maximum allowed size is ${maxMB} MB.`);
  }

  if (file.size === 0) {
    errors.push('File is empty.');
  }

  // 2. Check file extension
  const fileName = file.name.toLowerCase();
  const ext = '.' + fileName.split('.').pop();
  if (!FILE_UPLOAD_CONFIG.allowedExtensions.includes(ext)) {
    errors.push(`File type "${ext}" is not allowed. Accepted types: ${FILE_UPLOAD_CONFIG.allowedExtensions.join(', ')}.`);
  }

  // 3. Check MIME type via magic bytes (actual content verification)
  try {
    const header = await readFileHeader(file);
    const detectedMime = detectMimeFromHeader(header);

    if (!detectedMime) {
      errors.push('File content does not match any allowed image format. The file may be corrupted or disguised.');
    } else if (!FILE_UPLOAD_CONFIG.allowedMimeTypes.includes(detectedMime)) {
      errors.push(`File content detected as "${detectedMime}", which is not allowed.`);
    }

    // Cross-check: extension should match detected type
    if (detectedMime) {
      const extensionToMime = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.heic': 'image/heic',
      };
      const expectedMime = extensionToMime[ext];
      if (expectedMime && expectedMime !== detectedMime) {
        errors.push(`File extension "${ext}" does not match actual content (detected: ${detectedMime}). This file may have been renamed.`);
      }
    }
  } catch {
    errors.push('Unable to verify file content. Please try again.');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Show file validation errors in the UI.
 * @param {HTMLElement} container - Element to show errors near
 * @param {string[]} errors - Error messages
 */
export function showFileErrors(container, errors) {
  clearFileErrors(container);

  const errorDiv = document.createElement('div');
  errorDiv.className = 'cc-file-error mt-2 p-3 bg-red-50 border border-red-200 rounded-sm text-xs text-red-700 font-medium space-y-1';
  errorDiv.setAttribute('role', 'alert');
  
  errors.forEach(msg => {
    const p = document.createElement('p');
    p.textContent = msg;
    errorDiv.appendChild(p);
  });

  container.parentElement.appendChild(errorDiv);
}

/**
 * Clear file validation errors.
 * @param {HTMLElement} container
 */
export function clearFileErrors(container) {
  const existing = container.parentElement.querySelector('.cc-file-error');
  if (existing) existing.remove();
}
