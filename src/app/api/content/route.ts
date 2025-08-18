import { NextResponse } from "next/server";
import { getAll, getById, create, update, remove } from "@/lib/crud";

// GET /api/content/:type - Fetch all content of a type
export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = params;
    const items = await getAll(type);
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

// POST /api/content/:type - Create new entry
export async function POST(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = params;
    const data = await request.json();
    const newItem = await create(type, data);
    return NextResponse.json(newItem);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create content" },
      { status: 500 }
    );
  }
}