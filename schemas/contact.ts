import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  subject: z
    .string()
    .min(1, 'Subject is required')
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must be less than 200 characters'),
  
  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
});

export type ContactFormInput = z.infer<typeof contactSchema>;

