/**
 * CampusCare Input Validator
 * 
 * Strict schema-based validation that REJECTS invalid input entirely.
 * Does NOT sanitize or escape — if input doesn't match the schema, it fails.
 */

/**
 * Validation result type.
 * @typedef {{ valid: boolean, errors: string[] }} ValidationResult
 */

/**
 * Validate a single field value against a field schema.
 * 
 * @param {*} value - The value to validate
 * @param {object} schema - Field schema definition
 * @param {string} schema.type - 'string' | 'email' | 'number' | 'enum'
 * @param {boolean} [schema.required] - Whether the field is required
 * @param {number} [schema.minLength] - Minimum string length
 * @param {number} [schema.maxLength] - Maximum string length
 * @param {RegExp} [schema.pattern] - Regex pattern to match
 * @param {string[]} [schema.enum] - Allowed values for enum type
 * @param {number} [schema.min] - Minimum numeric value
 * @param {number} [schema.max] - Maximum numeric value
 * @param {string} schema.label - Human-readable field name for error messages
 * @returns {ValidationResult}
 */
export function validateField(value, schema) {
  const errors = [];
  const label = schema.label || 'Field';

  // Required check
  if (schema.required) {
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
      errors.push(`${label} is required.`);
      return { valid: false, errors };
    }
  } else if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    // Not required and empty — skip further validation
    return { valid: true, errors: [] };
  }

  const strValue = typeof value === 'string' ? value.trim() : String(value);

  // Type-specific validation
  switch (schema.type) {
    case 'string':
      if (typeof value !== 'string') {
        errors.push(`${label} must be text.`);
        break;
      }
      if (schema.minLength !== undefined && strValue.length < schema.minLength) {
        errors.push(`${label} must be at least ${schema.minLength} characters.`);
      }
      if (schema.maxLength !== undefined && strValue.length > schema.maxLength) {
        errors.push(`${label} must be at most ${schema.maxLength} characters.`);
      }
      if (schema.pattern && !schema.pattern.test(strValue)) {
        errors.push(schema.patternMessage || `${label} format is invalid.`);
      }
      break;

    case 'email':
      if (typeof value !== 'string') {
        errors.push(`${label} must be text.`);
        break;
      }
      if (strValue.length > 254) {
        errors.push(`${label} is too long (max 254 characters).`);
      }
      // RFC 5322 simplified email pattern
      const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailPattern.test(strValue)) {
        errors.push(`${label} must be a valid email address.`);
      }
      break;

    case 'number':
      const num = Number(value);
      if (isNaN(num)) {
        errors.push(`${label} must be a number.`);
        break;
      }
      if (schema.min !== undefined && num < schema.min) {
        errors.push(`${label} must be at least ${schema.min}.`);
      }
      if (schema.max !== undefined && num > schema.max) {
        errors.push(`${label} must be at most ${schema.max}.`);
      }
      break;

    case 'enum':
      if (!schema.enum || !schema.enum.includes(strValue)) {
        errors.push(`${label} must be one of: ${(schema.enum || []).join(', ')}.`);
      }
      break;

    default:
      errors.push(`${label} has an unknown validation type.`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate an object against a full form schema.
 * 
 * @param {object} data - Key-value pairs of form data
 * @param {object} schema - Schema object where keys match data keys, values are field schemas
 * @returns {{ valid: boolean, errors: object }} errors is a map of field name → error messages
 */
export function validateForm(data, schema) {
  const allErrors = {};
  let valid = true;

  for (const [fieldName, fieldSchema] of Object.entries(schema)) {
    const result = validateField(data[fieldName], fieldSchema);
    if (!result.valid) {
      valid = false;
      allErrors[fieldName] = result.errors;
    }
  }

  return { valid, errors: allErrors };
}

/**
 * Show inline validation error on a form field.
 * @param {HTMLElement} inputEl - The input element
 * @param {string[]} messages - Error messages
 */
export function showFieldError(inputEl, messages) {
  clearFieldError(inputEl);
  
  inputEl.classList.add('border-red-500', 'ring-1', 'ring-red-500');
  inputEl.classList.remove('border-gray-200', 'focus:border-primary', 'focus:ring-primary');

  const errorDiv = document.createElement('div');
  errorDiv.className = 'cc-validation-error text-xs text-red-600 font-medium mt-1';
  errorDiv.setAttribute('role', 'alert');
  errorDiv.textContent = messages.join(' ');
  
  inputEl.parentElement.appendChild(errorDiv);
}

/**
 * Clear inline validation error from a form field.
 * @param {HTMLElement} inputEl - The input element
 */
export function clearFieldError(inputEl) {
  inputEl.classList.remove('border-red-500', 'ring-1', 'ring-red-500');
  inputEl.classList.add('border-gray-200');
  
  const existing = inputEl.parentElement.querySelector('.cc-validation-error');
  if (existing) existing.remove();
}

/**
 * Clear all validation errors in a form.
 * @param {HTMLFormElement} formEl
 */
export function clearAllErrors(formEl) {
  formEl.querySelectorAll('.cc-validation-error').forEach(el => el.remove());
  formEl.querySelectorAll('.border-red-500').forEach(el => {
    el.classList.remove('border-red-500', 'ring-1', 'ring-red-500');
    el.classList.add('border-gray-200');
  });
}

// ─── Pre-built Form Schemas ────────────────────────────────────────

export const LOGIN_SCHEMA = {
  email: {
    type: 'email',
    required: true,
    label: 'Email',
  },
  password: {
    type: 'string',
    required: true,
    minLength: 8,
    maxLength: 128,
    label: 'Password',
  },
  role: {
    type: 'enum',
    required: true,
    enum: ['Student', 'Faculty', 'Staff', 'Admin'],
    label: 'Role',
  },
};

export const COMPLAINT_SCHEMA = {
  title: {
    type: 'string',
    required: true,
    minLength: 5,
    maxLength: 200,
    pattern: /^[^<>{}]*$/,
    patternMessage: 'Title must not contain HTML characters (< > { }).',
    label: 'Complaint Title',
  },
  category: {
    type: 'enum',
    required: true,
    enum: ['Plumbing', 'Electrical', 'Carpentry', 'HVAC', 'Cleaning'],
    label: 'Category',
  },
  priority: {
    type: 'enum',
    required: true,
    enum: ['Low', 'Medium', 'High'],
    label: 'Priority',
  },
  description: {
    type: 'string',
    required: true,
    minLength: 10,
    maxLength: 500,
    label: 'Description',
  },
  building: {
    type: 'string',
    required: false,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-.']*$/,
    patternMessage: 'Building name may only contain letters, numbers, spaces, hyphens, periods, and apostrophes.',
    label: 'Building',
  },
  floor: {
    type: 'string',
    required: false,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s\-.']*$/,
    patternMessage: 'Floor may only contain letters, numbers, spaces, and hyphens.',
    label: 'Floor',
  },
  room: {
    type: 'string',
    required: false,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s\-.']*$/,
    patternMessage: 'Room may only contain letters, numbers, spaces, and hyphens.',
    label: 'Room',
  },
};

export const TECHNICIAN_NOTES_SCHEMA = {
  notes: {
    type: 'string',
    required: false,
    maxLength: 2000,
    label: 'Technician Notes',
  },
  inventoryItem: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 200,
    pattern: /^[^<>{}]*$/,
    patternMessage: 'Item name must not contain HTML characters.',
    label: 'Part Name',
  },
};
