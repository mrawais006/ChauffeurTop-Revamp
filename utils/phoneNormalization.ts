/**
 * Phone Number Normalization Utility
 * Handles common formatting errors for Australian phone numbers
 */

export function normalizePhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  
  // Remove all whitespace, dashes, parentheses
  let normalized = phone.replace(/[\s\-\(\)]/g, '');
  
  // Handle: +610xxx → +61xxx (remove leading 0 after +61)
  if (normalized.startsWith('+610')) {
    normalized = '+61' + normalized.substring(4);
  }
  
  // Handle: +0xxx → +61xxx (user typed +0 instead of +61)
  if (normalized.startsWith('+0')) {
    normalized = '+61' + normalized.substring(2);
  }
  
  // Handle: 610xxx → +61xxx (missing +)
  if (normalized.startsWith('610') && normalized.length >= 11) {
    normalized = '+61' + normalized.substring(2);
  }
  
  // Handle: 61xxx → +61xxx (missing +, no leading 0 after 61)
  if (normalized.startsWith('61') && !normalized.startsWith('+') && normalized.length >= 11) {
    normalized = '+' + normalized;
  }
  
  // Handle Australian local: 0xxx → +61xxx
  if (normalized.startsWith('0') && !normalized.startsWith('+')) {
    normalized = '+61' + normalized.substring(1);
  }
  
  // If still no + and looks like a number, assume Australian
  if (!normalized.startsWith('+') && /^\d{9,10}$/.test(normalized)) {
    normalized = '+61' + normalized;
  }
  
  return normalized;
}

export function formatPhoneForDisplay(phone: string | null | undefined): string {
  const normalized = normalizePhoneNumber(phone);
  
  if (!normalized) return 'N/A';
  
  // Format Australian numbers: +61 412 345 678
  if (normalized.startsWith('+61') && normalized.length === 12) {
    const number = normalized.substring(3);
    return `+61 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
  }
  
  return normalized;
}

