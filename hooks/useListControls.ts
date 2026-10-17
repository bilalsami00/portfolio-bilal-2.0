import { useMemo, useState } from "react";

type ListControlsOptions<T, S extends string> = {
  matches: (item: T, query: string) => boolean;
  sorters: Record<S, (a: T, b: T) => number>;
  defaultSort: S;
  defaultPageSize?: number;
};

/** Client-side search, sort, and pagination for dashboard lists. */
const useListControls = <T, S extends string>(
  items: T[],
  {
    matches,
    sorters,
    defaultSort,
    defaultPageSize = 10,
  }: ListControlsOptions<T, S>
) => {
  const [query, setQueryState] = useState("");
  const [sort, setSortState] = useState<S>(defaultSort);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);
  const [page, setPage] = useState(1);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = needle
      ? items.filter((item) => matches(item, needle))
      : items;
    return [...filtered].sort(sorters[sort]);
  }, [items, query, sort, matches, sorters]);

  const pageCount = Math.max(1, Math.ceil(results.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageItems = results.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return {
    query,
    setQuery: (value: string) => {
      setQueryState(value);
      setPage(1);
    },
    sort,
    setSort: (value: S) => {
      setSortState(value);
      setPage(1);
    },
    pageSize,
    setPageSize: (value: number) => {
      setPageSizeState(value);
      setPage(1);
    },
    page: currentPage,
    setPage,
    pageCount,
    pageItems,
    results,
  };
};

export default useListControls;
