import { expect, test, describe } from 'vitest';
import { validateWorkOrder } from '../app/lib/validation';

describe('validation schema', () => {
  test('should validate valid work order data successfully', () => {
    const validData = {
      title: 'Fix lobby lighting',
      description: 'Replace three flickering bulbs.',
      priority: 'medium',
      status: 'in_progress',
    };

    const result = validateWorkOrder(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        title: 'Fix lobby lighting',
        description: 'Replace three flickering bulbs.',
        priority: 'medium',
        status: 'in_progress',
      });
    }
  });

  test('should fail validation if title is empty or missing', () => {
    const dataWithoutTitle = {
      description: 'Replace three flickering bulbs.',
      priority: 'medium',
    };

    const result = validateWorkOrder(dataWithoutTitle);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.title).toContain('Title is required');
    }
  });

  test('should fail validation if description is empty or missing', () => {
    const dataWithoutDesc = {
      title: 'Fix lighting',
      priority: 'medium',
    };

    const result = validateWorkOrder(dataWithoutDesc);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.description).toContain('Description is required');
    }
  });

  test('should fail validation if priority is invalid', () => {
    const dataWithInvalidPriority = {
      title: 'Fix lighting',
      description: 'Replace three flickering bulbs.',
      priority: 'critical', // not in low, medium, high
    };

    const result = validateWorkOrder(dataWithInvalidPriority);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.priority).toContain('Invalid priority. Must be low, medium, or high.');
    }
  });

  test('should fail validation if status is invalid', () => {
    const dataWithInvalidStatus = {
      title: 'Fix lighting',
      description: 'Replace three flickering bulbs.',
      priority: 'low',
      status: 'archived', // not in open, in_progress, Done
    };

    const result = validateWorkOrder(dataWithInvalidStatus);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.status).toContain('Invalid status. Must be open, in_progress, or Done.');
    }
  });

  test('should default status to open if status is not provided', () => {
    const dataWithoutStatus = {
      title: 'Fix lighting',
      description: 'Replace three flickering bulbs.',
      priority: 'low',
    };

    const result = validateWorkOrder(dataWithoutStatus);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe('open');
    }
  });
});
