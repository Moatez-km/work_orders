import { readWorkOrders } from '../../../lib/work-orders';
import { notFound } from 'next/navigation';
import EditWorkOrderClient from '../edit/EditWorkOrderClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWorkOrderPage({ params }: PageProps) {
  const { id } = await params;
  const workOrders = readWorkOrders();
  const workOrder = workOrders.find((wo) => wo.id === id);

  if (!workOrder) {
    notFound();
    return null;
  }

  return <EditWorkOrderClient workOrder={workOrder} />;
}
