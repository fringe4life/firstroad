"use client";

const TicketDeadlineClient = ({ deadline }: { deadline: Date | string }) => {
  const deadlineDate =
    typeof deadline === "string" ? new Date(deadline) : deadline;
  const label = Number.isNaN(deadlineDate.getTime())
    ? "Unknown date"
    : deadlineDate.toLocaleDateString();

  return <span>{label}</span>;
};

export { TicketDeadlineClient };
