import { apiClient } from './client';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
}

export interface ContactFormResponse {
  message: string;
}

/**
 * Send contact form submission
 */
export async function sendContactForm(data: ContactFormData) {
  return apiClient<ContactFormResponse>('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
