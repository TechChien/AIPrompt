"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import qs from "query-string";

import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const schema = z.object({
  title: z.string().min(1, { message: "Required" }),
  content: z.string().min(1, { message: "Required" }),
  hashtags: z.string(),
});

const CreatePost = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      content: "",
      hashtags: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset: formRest,
  } = form;

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const { hashtags } = values;

      const tags = hashtags.split(",").map((hash) => `#${hash.trim()}`);

      const url = qs.stringifyUrl({
        url: "/api/post",
        query: {
          authorId: session?.user?.id,
        },
      });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          hashtags: tags,
        }),
      });

      if (!response.ok) throw new Error("[request create post error]");

      const d = await response.json();
      console.log(d);

      formRest();
      router.back();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-4 ">
      <div className="w-full md:w-1/2">
        <span className="text-3xl md:text-5xl  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300">
          新增貼文
        </span>
        <p className="text-lg md:text-xl font-semibold mt-3">
          分享令人驚艷的提示，讓您的想像力在任何AI驅動的平台上自由發揮
        </p>
        <div className="flex flex-col shadow-md p-4 mt-4">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-bold text-zinc-500 dark:text-secondary/70">
                      AI 提示主題
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="my-3">
                    <FormLabel className="uppercase  font-bold text-zinc-500 dark:text-secondary/70">
                      AI 提示內容
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hashtags"
                render={({ field }) => (
                  <FormItem className="my-3">
                    <FormLabel className="  font-bold text-zinc-500 dark:text-secondary/70">
                      AI 提示分類(product,web,idea, etc.)
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={isSubmitting}
                        placeholder="多個類別以逗點(,)隔開"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  className="hover:bg-slate-200"
                  disabled={isSubmitting}
                  type="button"
                  onClick={() => router.back()}
                >
                  取消
                </Button>
                <Button
                  variant="ghost"
                  className="hover:bg-slate-200"
                  type="submit"
                  disabled={isSubmitting}
                >
                  送出
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
