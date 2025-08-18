import { NextResponse } from 'next/server';
import { createItem, getItem, getAllItems, updateItem, deleteItem } from '@/lib/crud';
import { pageSchema } from

Here's the complete implementation for the API route with enhanced validation:

<dyad-write path="src/app/api/content/[type]/route.ts" description="Completing API validation with publish status">
import { NextResponse } from 'next/server';
import { createItem, getItem, getAllItems, updateItem, deleteItem } from '@/lib/crud';
import { pageSchema } from '@/validations/page';
import { z } from 'zod';

export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (params.type === 'pages') {
      if (id) {
        const item = await getItem(params.type, id);
        return item ? NextResponse.json(item) : NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      const allItems = await getAllItems(params.type);
      return NextResponse.json(allItems);
    }

    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
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
    if (request.headers.get('content-type') !== 'application/json') {
      return NextResponse.json(
        { error: 'Unsupported media type' },
        { status: 415 }
      );
    }

    const body = await request.json();
    
    if (params.type === 'pages') {
      const validatedData = pageSchema.parse(body);
      const newItem = await createItem(params.type, validatedData);
      return NextResponse.json(newItem, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
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

export async function PUT(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    if (request.headers.get('content-type') !== 'application/json') {
      return NextResponse.json(
        { error: 'Unsupported media type' },
        { status: 415 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const body = await request.json();
    
    if (params.type === 'pages') {
      const validatedData = pageSchema.partial().parse(body);
      const updatedItem = await updateItem(params.type, id, validatedData);
      
      return updatedItem
        ? NextResponse.json(updatedItem)
        : NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
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

export async function DELETE(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    if (params.type === 'pages') {
      const success = await deleteItem(params.type, id);
      return success
        ? NextResponse.json({ message: 'Item deleted' })
        : NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}