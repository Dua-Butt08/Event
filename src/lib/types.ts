// Form types and API interfaces
import type { ZodTypeAny } from 'zod';
import type { FieldValues } from 'react-hook-form';
import type { FormKind } from '@/config/app-config';

export type { FormKind } from '@/config/app-config';


export interface GenerateRequest {
  kind: FormKind;
  inputs: Record<string, unknown>;
  title?: string;
}

export interface GenerateResponse {
  id: string;
}

export interface AiResponse {
  id: string;
  output: string;
  inputs?: Record<string, unknown>;
}

export interface StoredResult {
  id: string;
  kind: FormKind;
  inputs: Record<string, unknown>;
  output: string;
  createdAt: string;
}

export interface ResultsResponse {
  id: string;
  kind: FormKind;
  inputs: Record<string, unknown>;
  output: string;
}

// Form step configuration
export interface FormStep {
  title: string;
  description?: string;
  fields: string[];
}

export interface FormConfig {
  kind: FormKind;
  title: string;
  description: string;
  steps: FormStep[];
  storageKey: string;
}

// Field types for form components
export interface FieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  className?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface RadioOption {
  value: string;
  label: string;
}

export interface CheckboxOption {
  value: string;
  label: string;
}

// Multi-step form props
export interface MultiStepFormProps<TFormData extends FieldValues = FieldValues> {
  schema: ZodTypeAny; // Zod schema
  defaultValues: Partial<TFormData>;
  steps: FormStep[];
  onSubmit: (data: TFormData) => Promise<void>;
  storageKey: string;
  kind: FormKind;
}
