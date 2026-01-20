export const MELBOURNE_TIMEZONE = 'Australia/Melbourne';

export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function toCityISOString(
  date: Date, 
  time: string, 
  timezone: string
): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Parse time (could be "14:30" or "2:30 PM")
  const [hourStr, minuteStr, period] = time.split(/[:\s]/);
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10) || 0;
  
  // Convert to 24-hour if AM/PM present
  if (period) {
    if (period.toUpperCase() === 'PM' && hour < 12) hour += 12;
    if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;
  }
  
  const hourStr24 = String(hour).padStart(2, '0');
  const minuteStr24 = String(minute).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hourStr24}:${minuteStr24}:00`;
}

export function isWithinTwoHours(date: Date, time: string): boolean {
  const now = new Date();
  const [hourStr, minuteStr, period] = time.split(/[:\s]/);
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10) || 0;
  
  if (period) {
    if (period.toUpperCase() === 'PM' && hour < 12) hour += 12;
    if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;
  }
  
  const bookingDateTime = new Date(date);
  bookingDateTime.setHours(hour, minute, 0, 0);
  
  const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  
  return bookingDateTime <= twoHoursFromNow;
}

export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
}

export function isPastTime(date: Date, time: string): boolean {
  const now = new Date();
  const [hourStr, minuteStr, period] = time.split(/[:\s]/);
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10) || 0;
  
  if (period) {
    if (period.toUpperCase() === 'PM' && hour < 12) hour += 12;
    if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;
  }
  
  const bookingDateTime = new Date(date);
  bookingDateTime.setHours(hour, minute, 0, 0);
  
  return bookingDateTime < now;
}

export function isDateToday(date: Date | undefined): boolean {
  if (!date) return false;
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

