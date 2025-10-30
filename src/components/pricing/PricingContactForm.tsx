"use client";

import { useState } from 'react';
import { Button } from '@/components/ui-kit/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-kit/Card';
import { Input } from '@/components/ui-kit/Input';
import { Select } from '@/components/ui-kit/Select';
import { Textarea } from '@/components/ui-kit/Textarea';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useSubmitContactFormMutation } from '@/store/api/submissionsApi';

interface PricingContactFormProps {
  selectedPlan?: string;
  onSubmit?: (data: ContactFormData) => void;
}

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  plan: string;
  message: string;
  budget: string;
  timeline: string;
}

export function PricingContactForm({ selectedPlan = '', onSubmit }: PricingContactFormProps) {
  const [submitContactForm, { isLoading: isSubmitting }] = useSubmitContactFormMutation();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    plan: selectedPlan,
    message: '',
    budget: '',
    timeline: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Optimistically show success state BEFORE API call
      setSubmitted(true);

      // Call mutation in background
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        await submitContactForm(formData).unwrap();
      }

      // Success! Keep submitted state
    } catch (error) {
      console.error('Form submission failed:', error);
      // Revert optimistic update on error
      setSubmitted(false);
      alert('Failed to submit form. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (submitted) {
    return (
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <CardContent className="p-8 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-green-400 mb-4">Thank You!</h3>
          <p className="text-[var(--muted)] mb-6">
            We've received your inquiry about the {formData.plan} plan. Our team will contact you within 24 hours to discuss your needs and provide a customized solution.
          </p>
          <div className="space-y-2 text-sm text-[var(--muted)]">
            <p>📧 Confirmation sent to: {formData.email}</p>
            <p>📞 We'll call you at: {formData.phone}</p>
            <p>⏱️ Expected contact time: Within 24 hours</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {selectedPlan ? `Get Started with ${selectedPlan}` : 'Contact Sales Team'}
        </CardTitle>
        <p className="text-muted-foreground text-center">
          Tell us about your needs and we'll create a customized solution for your business.
        </p>
      </CardHeader>
      <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
            
            <Input
              label="Business Email *"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@company.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company Name *"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Your company name"
              required
            />
            
            <Input
              label="Phone Number *"
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (55) 123-4567"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Interested Plan"
              id="plan"
              name="plan"
              value={formData.plan}
              onChange={handleChange as React.ChangeEventHandler<HTMLSelectElement>}
            >
              <option value="">Select a plan</option>
              <option value="Starter">Starter (Free)</option>
              <option value="Professional">Professional ($49/month)</option>
              <option value="Enterprise">Enterprise ($199/month)</option>
              <option value="Custom">Custom Solution</option>
            </Select>
            
            <Select
              label="Monthly Budget Range"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange as React.ChangeEventHandler<HTMLSelectElement>}
            >
              <option value="">Select budget range</option>
              <option value="Under $100">Under $100</option>
              <option value="$100 - $500">$100 - $500</option>
              <option value="$500 - $1,000">$500 - $1,000</option>
              <option value="$1,000 - $5,00">$1,000 - $5,000</option>
              <option value="$5,000+">$5,000+</option>
            </Select>
          </div>

          <Select
            label="Implementation Timeline"
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange as React.ChangeEventHandler<HTMLSelectElement>}
          >
            <option value="">Select timeline</option>
            <option value="Immediate">Start immediately</option>
            <option value="1-2 weeks">Within 1-2 weeks</option>
            <option value="1 month">Within 1 month</option>
            <option value="2-3 months">2-3 months</option>
            <option value="Exploring">Just exploring options</option>
          </Select>

          <Textarea
            label="Tell us about your marketing goals"
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange as React.ChangeEventHandler<HTMLTextAreaElement>}
            rows={4}
            placeholder="Describe your current marketing challenges, goals, and what you hope to achieve with our platform..."
          />

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full text-lg py-6 bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent)] hover:scale-105 transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Submitting...
              </>
            ) : (
              <>
                Get Custom Quote
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </Button>

          <p className="text-xs text-[var(--muted)] text-center">
            By submitting this form, you agree to our terms of service and privacy policy. 
            We'll never share your information with third parties.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
