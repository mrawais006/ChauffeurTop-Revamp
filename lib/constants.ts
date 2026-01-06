// Business Constants Configuration
export const BUSINESS_CONFIG = {
  // Contact Information
  PHONE: '+61430240945',
  PHONE_DISPLAY: '(04) 3024 0945',
  EMAIL: 'admin@chauffeurtop.com.au',
  
  // Business Details
  NAME: 'ChauffeurTop Melbourne',
  NAME_SHORT: 'ChauffeurTop',
  
  // URLs
  WEBSITE_URL: 'https://www.chauffeurtop.com.au',
} as const;

// Contact Helper Functions
export const contactHelpers = {
  getPhoneUrl: () => `tel:${BUSINESS_CONFIG.PHONE}`,
  
  getSmsUrl: (message: string = 'Hi, I would like to inquire about your chauffeur services.') => 
    `sms:${BUSINESS_CONFIG.PHONE}?body=${encodeURIComponent(message)}`,
  
  getEmailUrl: (subject: string = 'Service Inquiry') =>
    `mailto:${BUSINESS_CONFIG.EMAIL}?subject=${encodeURIComponent(subject)}`,
  
  handleCall: () => {
    if (typeof window !== 'undefined') {
      window.location.href = contactHelpers.getPhoneUrl();
    }
  },
  
  handleSms: (message?: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = contactHelpers.getSmsUrl(message);
    }
  },
};

