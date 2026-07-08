export const PRIORITIES = ['low', 'medium', 'high'] as const;
export type Priority = typeof PRIORITIES[number];

export const STATUSES = ['open', 'in_progress', 'Done'] as const;
export type Status = typeof STATUSES[number];

export const DEFAULT_STATUS: Status = 'open';

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  updatedAt: string;
}
