import { writeWorkOrders } from '../src/app/lib/work-orders';
import { WorkOrder } from '../src/app/types/work-order';
import { v4 as uuidv4 } from 'uuid';

const sampleWorkOrders: WorkOrder[] = [
  {
    id: uuidv4(),
    title: 'Repair Lobby HVAC',
    description: 'The HVAC unit in the main lobby is making a loud rattling noise and failing to cool the area.',
    priority: 'high',
    status: 'open',
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Fix Flickering Lights in Hallway B',
    description: 'Several fluorescent tubes in Hallway B are flickering and need replacement.',
    priority: 'low',
    status: 'open',
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Unclog Restroom Drain',
    description: 'The main drain in the second-floor men\'s restroom is clogged and draining extremely slowly.',
    priority: 'high',
    status: 'in_progress',
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Fix Cracked Window Pane',
    description: 'A window pane in Conference Room 104 has a hairline crack and needs to be replaced.',
    priority: 'medium',
    status: 'open',
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Install New Door Lock',
    description: 'The lock mechanism on the server room door has failed. Install a new smart lock system.',
    priority: 'high',
    status: 'Done',
    updatedAt: new Date().toISOString(),
  },
];

console.log('Seeding 5 sample work orders...');
try {
  writeWorkOrders(sampleWorkOrders);
  console.log('Successfully seeded database!');
} catch (error) {
  console.error('Failed to seed database:', error);
  process.exit(1);
}
