import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";

/** Pages Router per-page layout: shared layouts keep state across routes. */
export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};
