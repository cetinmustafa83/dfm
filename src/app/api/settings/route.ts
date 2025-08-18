import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/crud";

// GET /api/settings - Fetch global settings
export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update global settings
export async function PUT(request: Request) {
  try {
    const settings = await request.json();
    const updatedSettings = await updateSettings(settings);
    return NextResponse.json(updatedSettings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}