"use client";

import Loading from "@/components/Loading";
import { useTag } from "@/hooks/use-query-prompt";
import PromptItem from "@/components/prompt-item";

type TagsPageProps = {
  params: {
    tagId: string;
  };
};

const TagsPage = ({ params }: TagsPageProps) => {
  const { data: prompts, isFetching } = useTag(params.tagId);

  if (isFetching) return <Loading />;

  const header = prompts[0]?.hashtags?.find(
    (h: any) => h.id === params.tagId
  ).title;

  return (
    <div className="container mt-4">
      <span className="text-3xl md:text-5xl  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300">
        {header}
      </span>
      <div className="grid md:grid-cols-3 gap-2 mt-5">
        {prompts?.map((prompt: any) => (
          <PromptItem key={prompt.id} prompt={prompt} />
        ))}
      </div>
    </div>
  );
};

export default TagsPage;
