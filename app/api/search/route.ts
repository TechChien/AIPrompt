import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get("searchTerm");

    if (!searchTerm)
      return new NextResponse("Missing search term", { status: 404 });

    const prompts = await db.prompt.aggregateRaw({
      pipeline: [
        {
          $search: {
            index: "searchPrompt",
            text: {
              query: searchTerm,
              path: {
                wildcard: "*",
              },
            },
          },
        },
        {
          $match: {
            isdeleted: false,
          },
        },
        {
          $lookup: {
            from: "Hashtag",
            localField: "hashtagIds",
            foreignField: "_id",
            as: "hashtag",
          },
        },
        {
          $lookup: {
            from: "User",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
      ],
    });

    return NextResponse.json(prompts);
  } catch (error) {
    console.log("[SEARCH_GET_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
