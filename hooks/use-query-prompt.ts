import { Prompt, Hashtag } from "@prisma/client";
import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import qs from "query-string";
import { UseFormReturn } from "react-hook-form";

type PromptWithTags = Prompt & {
  hashtags: Pick<Hashtag, "title">[];
};

const fetchPromptById = (id: string): Promise<PromptWithTags> => {
  return new Promise((resolve, reject) => {
    fetch(`/api/post/${id}`)
      .then((res) => {
        res.json().then((data) => resolve(data));
      })
      .catch((err) => reject(err));
  });
};

const fetchSearch = async (form: UseFormReturn<{ search: string }>) => {
  const search = form.getValues("search");

  const url = qs.stringifyUrl({
    url: "/api/search",
    query: {
      searchTerm: search,
    },
  });
  const res = await fetch(url);

  return res.json();
};

const fetchTags = async (tagId: string) => {
  const url = qs.stringifyUrl({
    url: `/api/search/${tagId}`,
  });
  const res = await fetch(url);
  return res.json();
};

export const useTag = (tagId: string) => {
  return useQuery(["tag", tagId], () => fetchTags(tagId), {
    cacheTime: 2 * 60 * 1000,
  });
};

// pause
export const useSearch = (form: UseFormReturn<{ search: string }>) => {
  return useQuery(["search"], () => fetchSearch(form), {
    cacheTime: 1 * 60 * 1000,
    enabled: false,
  });
};

export const useGetPromptById = (id: string) => {
  const qureyClient = useQueryClient();

  return useQuery(["query-prompt", id], () => fetchPromptById(id), {
    initialData: () => {
      const prompt = qureyClient.getQueryData<PromptWithTags>(
        ["query-prompt"],
        {
          type: "all",
        }
      )!;

      if (prompt) return prompt;

      return undefined;
    },
  });
};

type PromptQueryProps = {
  queryKey: string;
  apiUrl: string;
  paramKey?: string;
  paramValue?: string;
};

export const usePromptQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: PromptQueryProps) => {
  const fetchPrompts = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          ...(paramKey &&
            paramValue && {
              [paramKey]: paramValue,
            }),
        },
      },
      { skipNull: true }
    );

    const res = await fetch(url);
    return res.json();
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchPrompts,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    // refetchInterval: 5000,
  });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  };
};
