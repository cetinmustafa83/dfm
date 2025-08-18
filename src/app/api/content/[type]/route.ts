import { NextResponse } from 'next/server';
import { createItem, getItem, getAllItems, updateItem, deleteItem } from '@/lib/crud';
import { pageSchema } from '@/validations/page';
import { z } from 'zod';

// ... existing imports ...

export async function POST(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const body = await request.json();
    
    // Validate based on content type
    if (params.type === 'pages') {
      pageSchema.parse(body);
    }

    const newItem = await createItem(params.type, body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.errors },
        { status: 422 }
      );
    }
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
    
    // Validate based on content type
    if (params.type === 'pages') {
      pageSchema.partial().parse(body);
    }

    const updatedItem = await updateItem(params.type, id, body);
    
    return updatedItem
      ? NextResponse.json(updatedItem)
      : NextResponse.json({ error: 'Not found' }, { status: 404 });
      
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.errors },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}