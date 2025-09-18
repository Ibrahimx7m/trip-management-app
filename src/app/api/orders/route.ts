import { NextResponse } from 'next/server';
import { createOrder, listOrders } from '@/lib/orders-store';
import type { Order, PaymentMethod } from '@/types/order';

export async function GET() {
  const orders = listOrders();
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      carType,
      carModel,
      plateNumber,
      fromCity,
      toCity,
      paymentMethod,
      price = 0,
    } = body as Partial<Order>;

    if (!carType || !carModel || !plateNumber || !fromCity || !toCity || !paymentMethod) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const order = createOrder({
      carType,
      carModel,
      plateNumber,
      fromCity,
      toCity,
      paymentMethod: paymentMethod as PaymentMethod,
      price,
    } as any);

    return NextResponse.json(order, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Invalid JSON' }, { status: 400 });
  }
}
