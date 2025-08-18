import { NextResponse } from "next/server";
import { getById, update, remove } from "@/lib/crud";

// GET /api/content/:type/:id - Fetch a single entry
export async function GET(
  request: Request,
  { params }: { params: { type: string; id: string } }
) {
  try {
    const { type, id } = params;
    const item = await getById(type, id);
    
    if (!item) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

// PUT /api/content/:type/:id - Update entry
export async function PUT(
  request: Request,
  { params }: { params: { type: string; id: string } }
) {
  try {
    const { type, id } = params;
    const data = await request.json();
    const updatedItem = await update(type, id, data);
    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}

// DELETE /api/content/:type/:id - Delete entry
export async function DELETE(
  request: Request,
  { params }: { params: { type: string; id: string } }
) {
  try {
    const { type, id } = params;
    await remove(type, id);
    return NextResponse.json({ message: "Content deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 }
    );
  }
}