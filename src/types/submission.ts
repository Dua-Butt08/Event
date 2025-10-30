export interface StaleSubmission {
  id: string;
  createdAt: Date;
 components: Record<string, unknown> | null;
}
