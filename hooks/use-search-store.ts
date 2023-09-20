import { create } from "zustand";

export enum SearchType {
  None = 0,
  Prompt,
  Tag,
}

interface SearchStore {
  type: SearchType | null;
  setType: (type: SearchType) => void;
}

export const useSearchState = create<SearchStore>((set) => ({
  type: SearchType.None,
  setType: (type: SearchType) => set({ type }),
}));
