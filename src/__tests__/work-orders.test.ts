import { expect, test, describe, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { readWorkOrders, writeWorkOrders, addWorkOrder } from '../app/lib/work-orders';
import { WorkOrder } from '../app/types/work-order';

const DATA_FILE = path.join(process.cwd(), 'src/app/data/work-orders.json');

describe('work-orders lib', () => {
  let originalContent: string | null = null;
  const originalExists = fs.existsSync(DATA_FILE);

  beforeAll(() => {
    if (originalExists) {
      originalContent = fs.readFileSync(DATA_FILE, 'utf-8');
    }
  });

  afterAll(() => {
    if (originalExists && originalContent !== null) {
      fs.writeFileSync(DATA_FILE, originalContent, 'utf-8');
    } else if (fs.existsSync(DATA_FILE)) {
      fs.unlinkSync(DATA_FILE);
    }
  });

  test('should write and read work orders correctly', () => {
    const mockWorkOrders: WorkOrder[] = [
      {
        id: 'test-1',
        title: 'Leaking pipe in restroom',
        description: 'Water is pooling near the main sink.',
        priority: 'high',
        status: 'open',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'test-2',
        title: 'Broken AC unit',
        description: 'AC is blowing warm air in meeting room B.',
        priority: 'medium',
        status: 'in_progress',
        updatedAt: new Date().toISOString(),
      },
    ];

    // Write mock data
    writeWorkOrders(mockWorkOrders);

    // Read mock data
    const readData = readWorkOrders();

    expect(readData).toEqual(mockWorkOrders);
    expect(readData.length).toBe(2);
    expect(readData[0].title).toBe('Leaking pipe in restroom');
  });

  test('should add a new work order with generated uuid and default status', () => {
    // Clear list
    writeWorkOrders([]);

    const added = addWorkOrder({
      title: 'Fix flickering lights',
      description: 'The lights in the hallway are flickering.',
      priority: 'low',
    });

    expect(added.id).toBeDefined();
    expect(added.id.length).toBeGreaterThan(10); // Check that uuid is generated
    expect(added.status).toBe('open'); // Default status
    expect(added.title).toBe('Fix flickering lights');
    expect(added.description).toBe('The lights in the hallway are flickering.');
    expect(added.priority).toBe('low');
    expect(added.updatedAt).toBeDefined();

    // Verify it is saved in the file
    const currentList = readWorkOrders();
    expect(currentList.length).toBe(1);
    expect(currentList[0].id).toBe(added.id);
  });

  test('should add a new work order with specified status', () => {
    // Clear list
    writeWorkOrders([]);

    const added = addWorkOrder({
      title: 'Broken window',
      description: 'Window pane in room 101 is cracked.',
      priority: 'high',
      status: 'in_progress',
    });

    expect(added.status).toBe('in_progress'); // Specified status

    const currentList = readWorkOrders();
    expect(currentList.length).toBe(1);
    expect(currentList[0].status).toBe('in_progress');
  });
});

