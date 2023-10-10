"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Fragment, Suspense, useEffect } from "react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import PromptContainer from "@/components/prompt-container";
import Loading from "@/components/Loading";
import { useSearch } from "@/hooks/use-query-prompt";
import { useSearchState, SearchType } from "@/hooks/use-search-store";

const schema = z.object({
  search: z.string().min(1, { message: "Required" }),
});

const SearchBar = () => {
  const { setType } = useSearchState();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      search: "",
    },
  });

  useEffect(() => {
    if (form) {
      if (form.getValues("search") === "") {
        setType(SearchType.None);
      }
    }
  }, [form]);

  const {
    isLoading,
    isError,
    data,
    error: queryError,
    refetch,
    isFetching,
    status,
    fetchStatus,
  } = useSearch(form);

  const onSubmit = (values: z.infer<typeof schema>) => {
    try {
      refetch();
      setType(SearchType.Prompt);
    } catch (error) {
      console.log(error);
    }
  };

  const onSearchChange = () => {
    if (form.getValues("search") === "") {
      setType(SearchType.None);
    }
  };

  return (
    <Fragment>
      <Form {...form}>
        <form
          className="w-2/3 md:w-1/2 mx-auto mt-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="focus-visible:ring-0 focus-visible:ring-offset-0 shadow-md"
                    placeholder="搜尋標題、內容或點擊標註"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      onSearchChange();
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <p className="text-xs text-zinc-300">press &#9166; to submit</p>
        </form>
      </Form>
      {isFetching && <Loading />}
      {!isFetching && (
        <Suspense fallback={<Loading />}>
          <PromptContainer />
        </Suspense>
      )}
    </Fragment>
  );
};

export default SearchBar;
