import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { tagId: string } }
) {
  try {
    const url = new URL(req.url);

    if (!params.tagId)
      return new NextResponse("Missing tagId", { status: 404 });

    const prompts = await db.prompt.findMany({
      where: {
        hashtags: {
          some: {
            id: params.tagId,
          },
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        isdeleted: true,
        hashtags: {
          select: {
            id: true,
            title: true,
          },
        },
        user: true,
      },
      // include: {
      //   hashtags: {
      //     select: {
      //       id: true,
      //       title: true,
      //     },
      //   },
      //   user: true,
      // },
    });
    return NextResponse.json(prompts);
  } catch (error) {
    console.log("[SEARCH_GET_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
