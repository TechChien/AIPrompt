"use client";
import Loading from "@/components/Loading";
import PromptItemEdit from "@/components/prompt-item-edit";
import { Suspense, Fragment, useEffect } from "react";
import { usePromptQuery } from "@/hooks/use-query-prompt";
import { Button } from "@/components/ui/button";

type UserIdPageProps = {
  params: {
    userId: string;
  };
};

const UserIdPage = ({ params }: UserIdPageProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = usePromptQuery({
    queryKey: `user:${params.userId}`,
    apiUrl: "/api/post",
    paramKey: "userId",
    paramValue: params.userId,
  });

  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [refetch]);

  return (
    <div className="container">
      <div className="container mt-4 ">
        <div className="w-full md:w-1/2 mb-5">
          <span className="text-3xl md:text-5xl  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300">
            我的個人檔案
          </span>
          <p className="text-lg md:text-xl font-semibold mt-3">
            歡迎來到您的個性化檔案頁面
            <br />
            編輯您優秀的提示，用您的想像力啟發其他人的力量。
          </p>
        </div>
        <Suspense fallback={<Loading />}>
          <div className="grid md:grid-cols-3 gap-2">
            {data?.pages.map((group, index) => (
              <Fragment key={index}>
                {group.prompts.map((prompt: any) => (
                  <PromptItemEdit key={prompt.id} prompt={prompt} />
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
        </Suspense>
      </div>
    </div>
  );
};

export default UserIdPage;
