"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useGetPromptById } from "@/hooks/use-query-prompt";

import { useEffect } from "react";

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
import Loading from "@/components/Loading";

const schema = z.object({
  title: z.string().min(1, { message: "Required" }),
  content: z.string().min(1, { message: "Required" }),
  hashtags: z.string(),
});

const EditPost = ({ params }: { params: { postId: string } }) => {
  const router = useRouter();

  const {
    isLoading,
    data,
    isError,
    error: fetchError,
    isFetching,
  } = useGetPromptById(params.postId);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: data ? data?.title : "",
      content: data ? data?.content : "",
      hashtags: data ? data?.hashtags.map((tag) => tag.title).join(",") : "",
    },
  });

  useEffect(() => {
    if (data) {
      form.setValue("title", data?.title);
      form.setValue("content", data?.content);
      form.setValue(
        "hashtags",
        data?.hashtags.map((tag) => tag.title.slice(1)).join(",")
      );
    }
  }, [form, data]);

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
        url: `/api/post/${data?.id}`,
      });

      const response = await fetch(url, {
        method: "PATCH",
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

      router.back();
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading || isFetching) {
    return <Loading />;
  }

  return (
    <div className="container mt-4 ">
      <div className="w-full md:w-1/2">
        <span className="text-3xl md:text-5xl  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300">
          編輯貼文
        </span>
        <p className="text-lg md:text-xl font-semibold mt-3">
          編輯及分享令人驚艷的提示，讓您的想像力在任何AI驅動的平台上自由發揮
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
                  onClick={() => {
                    router.back();
                  }}
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

export default EditPost;
