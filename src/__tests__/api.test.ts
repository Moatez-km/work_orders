import { expect, test, describe, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { GET, POST } from '../app/api/work-orders/route';
import { writeWorkOrders } from '../app/lib/work-orders';

const DATA_FILE = path.join(process.cwd(), 'src/app/data/work-orders.json');

describe('API Route /api/work-orders', () => {
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

  test('GET should return list of work orders', async () => {
    writeWorkOrders([
      {
        id: 'test-1',
        title: 'Fix AC',
        description: 'Blowing warm air',
        priority: 'high',
        status: 'open',
        updatedAt: new Date().toISOString(),
      },
    ]);

    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.length).toBe(1);
    expect(data[0].title).toBe('Fix AC');
  });

  test('POST should create a new work order when data is valid', async () => {
    writeWorkOrders([]);

    const req = new Request('http://localhost/api/work-orders', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Leaking pipe',
        description: 'Restroom is flooding',
        priority: 'high',
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data.id).toBeDefined();
    expect(data.title).toBe('Leaking pipe');
    expect(data.status).toBe('open');
  });

  test('POST should return 400 when validation fails', async () => {
    const req = new Request('http://localhost/api/work-orders', {
      method: 'POST',
      body: JSON.stringify({
        title: '', // invalid title
        priority: 'invalid-priority',
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.errors).toBeDefined();
    expect(data.errors.title).toBeDefined();
    expect(data.errors.description).toBeDefined();
    expect(data.errors.priority).toBeDefined();
  });
});
