"use client";

import { Prompt, User, Hashtag } from "@prisma/client";
import AccountAvatar from "./accountAvatar";
import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type PromptWithUserTags = Prompt & {
  user: User;
  hashtags: Hashtag[];
};

type PropItemProps = PromptWithUserTags & {};

const PromptItem = ({ prompt }: { prompt: PropItemProps }) => {
  const { toast } = useToast();

  const router = useRouter();
  const {
    user: { name, email, image, id },
    isdeleted,
    title,
    content,
    hashtags,
  } = prompt;

  console.log(name, id);

  const handleLiClick = (tagId: string) => {
    router.push(`/post/tag/${tagId}`);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(content);
    toast({
      description: "內容已複製",
    });
  };

  if (isdeleted) return null;

  return (
    <div className="border shadow-md p-2 h-fit row-start-auto row-end-auto">
      <div className="flex gap-3 ">
        <span
          className="cursor-pointer"
          onClick={() => router.push(`/profile/${id}`)}
        >
          <AccountAvatar {...{ src: image, username: name, alt: name }} />
        </span>
        <span className="flex flex-col gap-1">
          <span className="font-semibold text-lg">{title}</span>
          <span className="text-xs text-zinc-400">{email}</span>
        </span>
        <span onClick={() => handleCopyClick()} className="ml-auto">
          <Copy className="h-4 w-4  text-zinc-500  hover:bg-zinc-300 cursor-pointer" />
        </span>
      </div>
      <p className="text-zinc-600 px-2 mt-3 text-sm">{content}</p>
      <div>
        <ul className="flex gap-2">
          {hashtags.map((hash) => (
            <li
              onClick={() => handleLiClick(hash.id)}
              className="text-zinc-400 text-xs px-2 mt-3 cursor-pointer"
              key={hash.id}
            >
              {hash.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PromptItem;
