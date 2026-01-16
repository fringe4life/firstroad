import { Suspend } from "@/components/suspend";

const PaginatedTransitions = <T extends { page: number }>({
  children,
  metadata,
  fallback,
}: {
  children: React.ReactNode;
  metadata: T;
  fallback: React.ReactNode;
}) => {
  return (
    <Suspend
      enter={{
        forwards: "enter-right",
        backwards: "enter-left",
        default: "auto",
      }}
      exit={{
        forwards: "exit-left",
        backwards: "exit-right",
        default: "auto",
      }}
      fallback={fallback}
      key={`models-page-${metadata.page}`}
    >
      {children}
    </Suspend>
  );
};

export { PaginatedTransitions };
