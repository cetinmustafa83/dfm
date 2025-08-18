import { NextResponse } from 'next/server';
import { getItem, updateItem } from '@/lib/crud';

export async function GET() {
  try {
    const settings = await getItem('site', 'settings');
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updatedSettings = await updateItem('site', 'settings', body);
    return NextResponse.json(updatedSettings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}