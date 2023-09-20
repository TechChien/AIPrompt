import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { title, content, hashtags } = await req.json();
    if (!params.postId)
      return new NextResponse("Missing postId", { status: 404 });

    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const prompt = await db.prompt.update({
      where: {
        id: params.postId,
        userId: session?.user.id,
      },
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
      },
    });

    return NextResponse.json(prompt);
  } catch (error) {
    console.log(["PATCH_POST_ID_ERROR"], error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!params.postId)
      return new NextResponse("Missing postId", { status: 404 });

    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    await db.prompt.update({
      where: {
        id: params.postId,
        userId: session?.user.id,
      },
      data: {
        isdeleted: true,
      },
    });
    return NextResponse.json("ok");
  } catch (error) {
    console.log(["DELETE_POST_ID_ERROR"], error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    if (!params.postId)
      return new NextResponse("Missing postId", { status: 404 });

    const prompt = await db.prompt.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        hashtags: {
          select: {
            title: true,
          },
        },
      },
    });
    return NextResponse.json(prompt);
  } catch (error) {
    console.log("[GET_PROMPT_BY_ID_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
