import { NextResponse } from 'next/server';
import { readWorkOrders, addWorkOrder } from '../../lib/work-orders';
import { validateWorkOrder } from '../../lib/validation';

export async function GET() {
  try {
    const workOrders = readWorkOrders();
    return NextResponse.json(workOrders);
  } catch (error) {
    console.error('API GET work-orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch work orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = validateWorkOrder(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newWorkOrder = addWorkOrder(validationResult.data);
    return NextResponse.json(newWorkOrder, { status: 201 });
  } catch (error) {
    console.error('API POST work-orders error:', error);
    return NextResponse.json(
      { error: 'Invalid request body or server error' },
      { status: 400 }
    );
  }
}
