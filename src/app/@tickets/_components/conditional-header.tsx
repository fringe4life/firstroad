import { getSession } from "src/features/auth/queries/get-session";
import Heading from "@/components/heading";

// Conditional header component
export const ConditionalHeader = async () => {
  const session = await getSession();
  if (session?.user) {
    return (
      <Heading description="All your tickets at one place" title="My Tickets" />
    );
  }

  return (
    <Heading
      description="Tickets by everyone at one place"
      title="All Tickets"
    />
  );
};
