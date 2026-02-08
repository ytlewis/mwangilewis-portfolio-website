'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/useToast';
import AnimatedButton from './AnimatedButton';
import AnimatedSection from './AnimatedSection';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
  className?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, className = '' }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) {
      return t('contact.validation.nameRequired');
    }
    if (name.trim().length < 2) {
      return t('contact.validation.nameMinLength');
    }
    if (name.trim().length > 100) {
      return t('contact.validation.nameMaxLength');
    }
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return t('contact.validation.emailRequired');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return t('contact.validation.emailInvalid');
    }
    return undefined;
  };

  const validateMessage = (message: string): string | undefined => {
    if (!message.trim()) {
      return t('contact.validation.messageRequired');
    }
    if (message.trim().length < 10) {
      return t('contact.validation.messageMinLength');
    }
    if (message.trim().length > 1000) {
      return t('contact.validation.messageMaxLength');
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    newErrors.name = validateName(formData.name);
    newErrors.email = validateEmail(formData.email);
    newErrors.message = validateMessage(formData.message);
    
    setErrors(newErrors);
    
    return !newErrors.name && !newErrors.email && !newErrors.message;
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default API call
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || t('contact.error'));
        }
      }

      // Success
      showSuccess(t('contact.success'));
      setFormData({ name: '', email: '', message: '' });
      setIsSuccess(true);
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Contact form error:', error);
      showError(error instanceof Error ? error.message : t('contact.error'));
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = `
    w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${theme === 'dark' 
      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-red-500'
    }
  `;

  const errorClasses = 'text-red-500 text-sm mt-1';

  return (
    <AnimatedSection animation="fadeIn" className={className}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label 
            htmlFor="name" 
            className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}
          >
            {t('contact.name')} *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder={t('contact.placeholders.name')}
            className={inputClasses}
            disabled={isSubmitting}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className={errorClasses}>
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label 
            htmlFor="email" 
            className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}
          >
            {t('contact.email')} *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder={t('contact.placeholders.email')}
            className={inputClasses}
            disabled={isSubmitting}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className={errorClasses}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label 
            htmlFor="message" 
            className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}
          >
            {t('contact.message')} *
          </label>
          <textarea
            id="message"
            rows={6}
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            placeholder={t('contact.placeholders.message')}
            className={`${inputClasses} resize-vertical min-h-[120px]`}
            disabled={isSubmitting}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <p id="message-error" className={errorClasses}>
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <AnimatedButton
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting || isSuccess}
            className={`min-w-[200px] transition-all duration-300`}
            style={{
              backgroundColor: isSuccess ? '#16a34a' : undefined,
              borderColor: isSuccess ? '#16a34a' : undefined,
            }}
          >
            {isSuccess ? (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('contact.sent') || 'Sent!'}
              </span>
            ) : isSubmitting ? (
              t('contact.sending')
            ) : (
              t('contact.send')
            )}
          </AnimatedButton>
        </div>
      </form>
    </AnimatedSection>
  );
};

export default ContactForm;