import { expect, test, describe, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { GET, POST } from '../app/api/work-orders/route';
import { PUT, DELETE } from '../app/api/work-orders/[id]/route';
import { writeWorkOrders, readWorkOrders } from '../app/lib/work-orders';

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

describe('API Route /api/work-orders/[id]', () => {
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

  test('PUT should update work order when data is valid', async () => {
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

    const req = new Request('http://localhost/api/work-orders/test-1', {
      method: 'PUT',
      body: JSON.stringify({
        title: 'Fix HVAC Unit',
        description: 'Repaired fan motor',
        priority: 'medium',
        status: 'in_progress',
      }),
    });

    const params = Promise.resolve({ id: 'test-1' });
    const response = await PUT(req, { params });
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.title).toBe('Fix HVAC Unit');
    expect(data.description).toBe('Repaired fan motor');
    expect(data.priority).toBe('medium');
    expect(data.status).toBe('in_progress');

    // Verify it is updated in database
    const db = readWorkOrders();
    expect(db[0].title).toBe('Fix HVAC Unit');
  });

  test('PUT should return 404 when work order not found', async () => {
    writeWorkOrders([]);

    const req = new Request('http://localhost/api/work-orders/unknown-id', {
      method: 'PUT',
      body: JSON.stringify({
        title: 'Fix HVAC Unit',
        description: 'Repaired fan motor',
        priority: 'medium',
        status: 'in_progress',
      }),
    });

    const params = Promise.resolve({ id: 'unknown-id' });
    const response = await PUT(req, { params });
    expect(response.status).toBe(404);
  });

  test('DELETE should remove work order when it exists', async () => {
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

    const req = new Request('http://localhost/api/work-orders/test-1', {
      method: 'DELETE',
    });

    const params = Promise.resolve({ id: 'test-1' });
    const response = await DELETE(req, { params });
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.message).toBe('Work order deleted successfully');
    expect(data.id).toBe('test-1');

    // Verify database is empty
    const db = readWorkOrders();
    expect(db.length).toBe(0);
  });

  test('DELETE should return 404 when work order does not exist', async () => {
    writeWorkOrders([]);

    const req = new Request('http://localhost/api/work-orders/unknown-id', {
      method: 'DELETE',
    });

    const params = Promise.resolve({ id: 'unknown-id' });
    const response = await DELETE(req, { params });
    expect(response.status).toBe(404);
  });
});

