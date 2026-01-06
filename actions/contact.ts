'use server';

import { supabase } from '@/lib/supabase';
import { contactSchema } from '@/schemas/contact';
import type { ContactFormData, ContactSubmissionResult } from '@/types/contact';
import { ZodError } from 'zod';

export async function submitContactForm(
  formData: ContactFormData
): Promise<ContactSubmissionResult> {
  try {
    // 1. Validate form data with Zod
    const validatedData = contactSchema.parse(formData);

    console.log('Submitting contact form:', validatedData);

    // 2. Save to Supabase contacts table
    const { error: contactError } = await supabase
      .from('contacts')
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
      });

    if (contactError) {
      console.error('Supabase error:', contactError);
      throw new Error(`Failed to save contact: ${contactError.message}`);
    }

    // 3. Send email notification using Supabase Edge Function
    const { error: notificationError } = await supabase.functions.invoke(
      'send-notification',
      {
        body: {
          type: 'contact',
          name: validatedData.name,
          email: validatedData.email,
          subject: validatedData.subject,
          message: validatedData.message,
        },
      }
    );

    if (notificationError) {
      console.error('Notification error:', notificationError);
      // Don't throw here - contact is saved, just log the email error
      console.warn('Contact saved but notification may not have been sent');
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    
    // Handle Zod validation errors
    if (error instanceof ZodError && error.issues) {
      const fieldErrors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        if (issue.path && issue.path.length > 0) {
          const field = issue.path[0] as string;
          fieldErrors[field] = issue.message;
        }
      });
      return { 
        success: false, 
        error: 'Please fix the errors in the form.',
        fieldErrors 
      };
    }
    
    // Handle other errors
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: 'Failed to submit contact form. Please try again.' };
  }
}

