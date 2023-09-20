"use client";

import { Prompt, User, Hashtag } from "@prisma/client";
import AccountAvatar from "./accountAvatar";
import { Copy, Edit, Ghost, Trash } from "lucide-react";
import { ActionTooltip } from "./action-tooltip";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

type PromptWithUserTags = Prompt & {
  user: User;
  hashtags: Hashtag[];
};

const PromptItemEdit = ({ prompt }: { prompt: PromptWithUserTags }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const {
    id: postId,
    user: { name, email, image, id },
    isdeleted,
    title,
    content,
    hashtags,
  } = prompt;

  const deleteClick = async () => {
    try {
      const response = await fetch(`/api/post/${postId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("delete post failed");
      const data = await response.json();
      console.log(data);
      router.refresh();
    } catch (error) {
      console.log("delete post error", error);
      throw new Error("delete post error");
    }
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(content);
    toast({
      description: "內容已複製",
    });
  };

  if (isdeleted) return null;

  return (
    <div className="border shadow-md p-2 h-fit">
      <div className="flex gap-3 ">
        <AccountAvatar {...{ src: image, username: name, alt: name }} />
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
            <li className="text-zinc-400 text-xs px-2 mt-3" key={hash.title}>
              {hash.title}
            </li>
          ))}
        </ul>
      </div>
      {session?.user.id === id && (
        <div className="flex gap-2 mt-2 justify-end">
          <ActionTooltip label="編輯">
            <Edit
              onClick={() => router.push(`/post/${postId}`)}
              className="h-4 w-4"
            />
          </ActionTooltip>
          <ActionTooltip label="刪除">
            <Trash onClick={deleteClick} className="h-4 w-4" />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export default PromptItemEdit;
