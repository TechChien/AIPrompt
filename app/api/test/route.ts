import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const user = await db.user.findFirst();
    return NextResponse.json({
      success: "good",
    });
  } catch (error) {
    console.log("[TEST_GET_USER_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
