import { z } from 'zod';
import { PRIORITIES, STATUSES } from '../types/work-order';

export const workOrderSchema = z.object({
  title: z
    .string({ message: 'Title is required' })
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title must be 100 characters or less' })
    .trim(),
  description: z
    .string({ message: 'Description is required' })
    .min(1, { message: 'Description is required' })
    .max(500, { message: 'Description must be 500 characters or less' })
    .trim(),
  priority: z.enum(PRIORITIES, {
    message: 'Invalid priority. Must be low, medium, or high.',
  }),
  status: z.enum(STATUSES, {
    message: 'Invalid status. Must be open, in_progress, or Done.',
  }).default('open'),
});

export type WorkOrderInput = z.infer<typeof workOrderSchema>;

export function validateWorkOrder(data: unknown) {
  return workOrderSchema.safeParse(data);
}
