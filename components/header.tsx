"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import h from "@/assets/images/logo.svg";
import { signIn, signOut, useSession } from "next-auth/react";
import AccountAvatar from "@/components/accountAvatar";
import { useRouter } from "next/navigation";

const Header = () => {
  const { data: session, status } = useSession();

  const router = useRouter();

  return (
    <>
      <nav className={"container sticky top-0 max-h-[8rem] p-2 flex"}>
        <div className="flex gap-3 items-center">
          <span onClick={() => router.push("/")} className="inline-block">
            <Image src={h} alt="h" width={48} height={48} />
          </span>
          <span className="hidden sm:block text-2xl font-semibold">
            AIPrompt
          </span>
        </div>
        <div className="ml-auto flex gap-0 sm:gap-3">
          {status === "unauthenticated" ? (
            <>
              <Button
                variant="ghost"
                className="text-xl font-semibold"
                onClick={() => signIn()}
              >
                登入
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-xl font-semibold"
                onClick={() => router.push("/post/createPost")}
              >
                貼文
              </Button>
              <Button
                variant="ghost"
                className="text-xl font-semibold"
                onClick={() => signOut()}
              >
                登出
              </Button>
              <AccountAvatar
                src={session?.user?.image as string}
                alt="image"
                username={session?.user?.name as string}
              />
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
