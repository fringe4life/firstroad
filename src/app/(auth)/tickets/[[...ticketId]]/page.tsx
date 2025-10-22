import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Activity, Suspense, ViewTransition } from "react";
import Spinner from "src/components/spinner";
import { hasAuth } from "src/lib/auth-helpers";
import Breadcrumbs from "@/components/breadcrumbs";
import { CardCompact } from "@/components/card-compact";
import Heading from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import TicketItem from "@/features/ticket/components/ticket-item";
import TicketList from "@/features/ticket/components/ticket-list";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";
import { getTicketById } from "@/features/ticket/queries/get-ticket";
import { homePath, ticketPath } from "@/path";
import { parseTicketRoute } from "@/utils/parse-ticket-route";

type TicketIdParam = {
  ticketId: Awaited<ReturnType<typeof parseTicketRoute>>["ticketId"];
};

export const generateMetadata = async ({
  params,
}: PageProps<"/tickets/[[...ticketId]]">): Promise<Metadata> => {
  const { isListView, isEditView, ticketId } = await parseTicketRoute(params);

  // List view metadata
  if (isListView) {
    return {
      title: "My Tickets",
      description:
        "Manage your tickets, create new ones, and track your progress. View all tickets you've created and collaborated on.",
    };
  }

  // Get ticket for detail/edit metadata
  const ticket = await hasAuth((session) =>
    getTicketById(session, ticketId ?? ""),
  );

  if (!ticket) {
    return {
      title: "Ticket Not Found",
      description: "The requested ticket could not be found.",
    };
  }

  // Edit view metadata
  if (isEditView) {
    return {
      title: `Edit ${ticket.title}`,
      description: `Edit ticket: ${ticket.title}`,
    };
  }

  // Detail view metadata
  return {
    title: ticket.title,
    description:
      ticket.description || "View ticket details and collaborate with others.",
  };
};

const TicketDetail = async ({ ticketId }: TicketIdParam) => {
  if (!ticketId) {
    return null;
  }

  const ticket = await hasAuth((session) => getTicketById(session, ticketId));

  if (!ticket) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { title: "Tickets", href: homePath },
          { title: ticket.title },
        ]}
      />
      <Separator />
      <div className="flex justify-center">
        <TicketItem isDetail={true} ticket={ticket} />
      </div>
    </>
  );
};

const TicketEdit = async ({ ticketId }: TicketIdParam) => {
  if (!ticketId) {
    return null;
  }

  const ticket = await hasAuth((session) => getTicketById(session, ticketId));

  if (!ticket?.isOwner) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { title: "Tickets", href: homePath },
          { title: ticket.title, href: ticketPath(ticket.id) },
          { title: "Edit" },
        ]}
      />
      <Separator />
      <div className="flex flex-1 flex-col items-center justify-center">
        <CardCompact
          className="w-full max-w-120 self-center"
          content={
            <TicketUpsertForm
              ticket={ticket}
              upsertTicketAction={upsertTicket}
            />
          }
          description="Edit an existing ticket"
          title="Edit Ticket"
        />
      </div>
    </>
  );
};

// biome-ignore lint/suspicious/useAwait: required for "use cache"
const TicketCreationForm = async () => {
  "use cache";
  cacheLife("days");
  return (
    <>
      <Heading description="All your tickets at one place" title="My Tickets" />
      <CardCompact
        className="w-full max-w-105 self-center"
        content={<TicketUpsertForm upsertTicketAction={upsertTicket} />}
        description="A new ticket will be created"
        title="Create Ticket"
      />
    </>
  );
};

const TicketListView = ({
  searchParams,
}: {
  searchParams: PageProps<"/tickets/[[...ticketId]]">["searchParams"];
}) => (
  <>
    <TicketCreationForm />
    <TicketList searchParams={searchParams} />
  </>
);

const TicketsPage = async ({
  params,
  searchParams,
}: PageProps<"/tickets/[[...ticketId]]">) => {
  await connection();

  // Parse the route to determine active view (cached to avoid duplicate await)
  const { isListView, isDetailView, isEditView, ticketId } =
    await parseTicketRoute(params);

  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <ViewTransition
        default={undefined}
        enter="slide-up"
        exit="slide-down"
        name={`${ticketId ?? ""}`}
      >
        {/* List view - visible when no ticketId */}
        <Suspense fallback={<Spinner />}>
          <Activity mode={isListView ? "visible" : "hidden"}>
            <TicketListView searchParams={searchParams} />
          </Activity>
        </Suspense>

        {/* Detail view - pre-renders in background, visible when ticketId without edit */}

        <Suspense fallback={<Spinner />}>
          <Activity mode={isDetailView ? "visible" : "hidden"}>
            <TicketDetail ticketId={ticketId} />
          </Activity>
        </Suspense>

        {/* Edit view - pre-renders in background, visible when ticketId/edit */}
        <Suspense fallback={<Spinner />}>
          <Activity mode={isEditView ? "visible" : "hidden"}>
            <TicketEdit ticketId={ticketId} />
          </Activity>
        </Suspense>
      </ViewTransition>
    </div>
  );
};

export default TicketsPage;
