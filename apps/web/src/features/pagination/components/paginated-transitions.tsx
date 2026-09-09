import { Suspend } from "@/components/suspend";
import type { Page } from "../types";

const PaginatedTransitions = <T extends Page>({
  children,
  metadata,
  fallback,
}: {
  children: React.ReactNode;
  metadata: T;
  fallback: React.ReactNode;
}) => (
  <Suspend
    enter={{
      backwards: "enter-left",
      default: "auto",
      forwards: "enter-right",
    }}
    exit={{
      backwards: "exit-right",
      default: "auto",
      forwards: "exit-left",
    }}
    fallback={fallback}
    key={`models-page-${metadata.page}`}
  >
    {children}
  </Suspend>
);

export { PaginatedTransitions };
