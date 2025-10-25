"use client";

import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import type { MaybeServerSession } from "@/features/auth/types";
import { scopeParser } from "@/features/ticket/search-params";

type TicketScopeToggleProps = {
  session: MaybeServerSession;
};

/**
 * Desktop scope toggle using ButtonGroup for "All Tickets" vs "My Tickets"
 * Only visible on sm+ screens (hidden on mobile)
 */
const TicketScopeToggle = ({ session }: TicketScopeToggleProps) => {
  const [scope, setScope] = useQueryState("scope", scopeParser);

  const handleScopeChange = (newScope: "all" | "mine") => {
    if (newScope === "mine" && !session?.user) {
      setScope("all");
      toast.info("Please sign in to view your tickets");
      return;
    }
    setScope(newScope);
  };

  return (
    <ButtonGroup className="hidden w-full sm:flex">
      <Button
        className="flex-1"
        onClick={() => handleScopeChange("all")}
        size="sm"
        variant={scope === "all" ? "default" : "outline"}
      >
        All Tickets
      </Button>
      <Button
        className="flex-1"
        disabled={!session?.user}
        onClick={() => handleScopeChange("mine")}
        size="sm"
        title={session?.user ? "" : "Sign in to view your tickets"}
        variant={scope === "mine" ? "default" : "outline"}
      >
        My Tickets
      </Button>
    </ButtonGroup>
  );
};

export default TicketScopeToggle;
