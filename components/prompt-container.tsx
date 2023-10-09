"use client";
import { usePromptQuery } from "@/hooks/use-query-prompt";
import PromptItem from "./prompt-item";
import { Button } from "./ui/button";
import { Fragment, useEffect } from "react";
import { SearchType, useSearchState } from "@/hooks/use-search-store";
import { useQueryClient } from "@tanstack/react-query";

// type SearchQueryData = {
//   content: string;
//   isdeleted: boolean;
//   title: string;
// }[];

const PromptContainer = () => {
  const { type } = useSearchState();
  const queryClient = useQueryClient();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = usePromptQuery({ queryKey: "queryAllPrompt", apiUrl: "/api/post" });

  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [refetch]);

  const searchPrompt = queryClient
    .getQueryData<any>(["search"])
    ?.map((item: any) => {
      const {
        content,
        _id: { $oid: id },
        isdeleted,
        title,
        user: [
          {
            name,
            email,
            image,
            _id: { $oid: userid },
          },
        ],
        hashtag,
      } = item;

      return {
        content,
        id,
        title,
        hashtags: hashtag.map(({ title, _id: { $oid: id } }: any) => ({
          title,
          id,
        })),
        user: { name, email, image, id: userid },
        isdeleted,
      };
    });

  searchPrompt && console.log(searchPrompt);

  return (
    <>
      {type === SearchType.None ? (
        <div>
          <div className="grid md:grid-cols-3 gap-2 mt-4">
            {data?.pages.map((group, index) => (
              <Fragment key={index}>
                {group.prompts.map((prompt: any) => (
                  <PromptItem key={prompt.id} prompt={prompt} />
                ))}
              </Fragment>
            ))}
          </div>
          <div className="flex w-full justify-center mt-4">
            <Button
              disabled={!hasNextPage}
              className="bg-zinc-500 text-white font-semibold hover:bg-zinc-400"
              variant="secondary"
              onClick={() => fetchNextPage()}
            >
              載入更多
            </Button>
          </div>
        </div>
      ) : type === SearchType.Prompt ? (
        searchPrompt && searchPrompt.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-2 mt-4">
            {searchPrompt?.map((prompt: any) => (
              <PromptItem key={prompt.id} prompt={prompt} />
            ))}
          </div>
        ) : (
          <div className="text-xl">無搜尋結果</div>
        )
      ) : null}
    </>
  );
};

export default PromptContainer;
