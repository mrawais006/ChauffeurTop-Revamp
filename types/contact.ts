export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactSubmissionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

