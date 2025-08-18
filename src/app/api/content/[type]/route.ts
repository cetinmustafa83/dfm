import { NextResponse } from 'next/server';
import { createItem, getItem, getAllItems, updateItem, deleteItem } from '@/lib/crud';

export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const item = await getItem(params.type, id);
      return item 
        ? NextResponse.json(item)
        : NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    const allItems = await getAllItems(params.type);
    return NextResponse.json(allItems);
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const body = await request.json();
    const newItem = await createItem(params.type, body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid data format' },
      { status: 400 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const body = await request.json();
    const updatedItem = await updateItem(params.type, id, body);
    
    return updatedItem
      ? NextResponse.json(updatedItem)
      : NextResponse.json({ error: 'Not found' }, { status: 404 });
      
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const success = await deleteItem(params.type, id);
    return success
      ? NextResponse.json({ message: 'Item deleted' })
      : NextResponse.json({ error: 'Not found' }, { status: 404 });
      
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}