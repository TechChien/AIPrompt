import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const PROMPT_BATCH = 3;

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const authorId = searchParams.get("authorId");
    const { title, content, hashtags } = await req.json();

    if (!authorId)
      return new NextResponse("Missing Author Id", { status: 404 });

    if (!title) return new NextResponse("Missing Title", { status: 404 });

    if (!content) return new NextResponse("Missing Content", { status: 404 });

    const prompt = await db.prompt.create({
      data: {
        title,
        content,
        hashtags: {
          connectOrCreate: hashtags.map((tag: string) => {
            return {
              where: { title: tag },
              create: { title: tag },
            };
          }),
        },
        user: {
          connectOrCreate: {
            create: { id: authorId },
            where: {
              id: authorId,
            },
          },
        },
      },
    });

    return NextResponse.json(prompt);
  } catch (error) {
    console.log("[CREATE_POST_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const take = url.searchParams.get("take");
    const cursor = url.searchParams.get("cursor");
    const userId = url.searchParams.get("userId");

    // console.log("[userId]", userId);

    const prompts = await db.prompt.findMany({
      take: take ? parseInt(take as string) : PROMPT_BATCH,
      ...(cursor && {
        skip: 1,
        cursor: {
          id: cursor as string,
        },
      }),
      ...(userId && {
        where: {
          userId: userId,
          isdeleted: false,
        },
      }),
      ...(!userId && {
        where: {
          isdeleted: false,
        },
      }),
      include: {
        user: true,
        hashtags: true,
      },
    });

    let nextCursor = null;

    if (prompts.length === PROMPT_BATCH) {
      nextCursor = prompts[PROMPT_BATCH - 1].id;
    }

    return NextResponse.json({
      prompts,
      nextCursor,
    });
  } catch (error) {
    console.log("[GET_POSTS_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
