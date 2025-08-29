import { NextResponse } from 'next/server';
import { createItem, getItem, getAllItems, updateItem, deleteItem } from '@/lib/crud';
import { pageSchema } from '@/validations/page';
import { serviceSchema } from '@/validations/service';
import { jobSchema } from '@/validations/job';
import { z } from 'zod';

export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (params.type === 'pages' || params.type === 'services' || params.type === 'jobs') {
      if (id) {
        const item = await getItem(params.type, id);
        return item ? NextResponse.json(item) : NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      const allItems = await getAllItems(params.type);
      return NextResponse.json(allItems);
    }

    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  } catch (error) {
    console.error(`Error in GET /api/content/${params.type}:`, error);
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
        { error: 'Unsupported media type, expected application/json' },
        { status: 415 }
      );
    }

    const body = await request.json();
    let newItem;

    if (params.type === 'pages') {
      const validatedData = pageSchema.parse(body);
      newItem = await createItem(params.type, validatedData);
    } else if (params.type === 'services') {
      const validatedData = serviceSchema.parse(body);
      newItem = await createItem(params.type, validatedData);
    } else if (params.type === 'jobs') {
      const validatedData = jobSchema.parse(body);
      newItem = await createItem(params.type, validatedData);
    } else {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.errors, message: 'Validation failed' },
        { status: 422 }
      );
    }
    console.error(`Error in POST /api/content/${params.type}:`, error);
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
        { error: 'Unsupported media type, expected application/json' },
        { status: 415 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 });

    const body = await request.json();
    let updatedItem;
    
    if (params.type === 'pages') {
      const validatedData = pageSchema.partial().parse(body);
      updatedItem = await updateItem(params.type, id, validatedData);
    } else if (params.type === 'services') {
      const validatedData = serviceSchema.partial().parse(body);
      updatedItem = await updateItem(params.type, id, validatedData);
    } else if (params.type === 'jobs') {
      const validatedData = jobSchema.partial().parse(body);
      updatedItem = await updateItem(params.type, id, validatedData);
    } else {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }
    
    return updatedItem
      ? NextResponse.json(updatedItem)
      : NextResponse.json({ error: 'Item not found for update' }, { status: 404 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.errors, message: 'Validation failed' },
        { status: 422 }
      );
    }
    console.error(`Error in PUT /api/content/${params.type}:`, error);
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
    if (!id) return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 });

    if (params.type === 'pages' || params.type === 'services' || params.type === 'jobs') {
      const success = await deleteItem(params.type, id);
      return success
        ? NextResponse.json({ message: 'Item deleted successfully' })
        : NextResponse.json({ error: 'Item not found for deletion' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  } catch (error) {
    console.error(`Error in DELETE /api/content/${params.type}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}