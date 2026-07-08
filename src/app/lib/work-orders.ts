import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { WorkOrder, Priority, Status, DEFAULT_STATUS } from '../types/work-order';

const DATA_FILE = path.join(process.cwd(), 'src/app/data/work-orders.json');

export function readWorkOrders(): WorkOrder[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
    if (!fileContent.trim()) {
      return [];
    }
    return JSON.parse(fileContent) as WorkOrder[];
  } catch (error) {
    console.error('Failed to read work orders:', error);
    return [];
  }
}

export function writeWorkOrders(workOrders: WorkOrder[]): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(workOrders, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write work orders:', error);
    throw error;
  }
}

export function addWorkOrder(data: {
  title: string;
  description: string;
  priority: Priority;
  status?: Status;
}): WorkOrder {
  const newOrder: WorkOrder = {
    id: uuidv4(),
    title: data.title,
    description: data.description,
    priority: data.priority,
    status: data.status ?? DEFAULT_STATUS,
    updatedAt: new Date().toISOString(),
  };
  const list = readWorkOrders();
  list.push(newOrder);
  writeWorkOrders(list);
  return newOrder;
}

