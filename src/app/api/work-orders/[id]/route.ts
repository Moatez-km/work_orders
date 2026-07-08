import { NextResponse } from 'next/server';
import { readWorkOrders, writeWorkOrders } from '../../../lib/work-orders';
import { validateWorkOrder } from '../../../lib/validation';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validationResult = validateWorkOrder(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const workOrders = readWorkOrders();
    const index = workOrders.findIndex((wo) => wo.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Work order not found' }, { status: 404 });
    }

    // Update fields
    const updatedWorkOrder = {
      ...workOrders[index],
      title: validationResult.data.title,
      description: validationResult.data.description,
      priority: validationResult.data.priority,
      status: validationResult.data.status,
      updatedAt: new Date().toISOString(),
    };

    workOrders[index] = updatedWorkOrder;
    writeWorkOrders(workOrders);

    return NextResponse.json(updatedWorkOrder);
  } catch (error) {
    console.error('API PUT work-order error:', error);
    return NextResponse.json(
      { error: 'Invalid request body or server error' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workOrders = readWorkOrders();
    const exists = workOrders.some((wo) => wo.id === id);

    if (!exists) {
      return NextResponse.json({ error: 'Work order not found' }, { status: 404 });
    }

    const filteredWorkOrders = workOrders.filter((wo) => wo.id !== id);
    writeWorkOrders(filteredWorkOrders);

    return NextResponse.json({ message: 'Work order deleted successfully', id });
  } catch (error) {
    console.error('API DELETE work-order error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
