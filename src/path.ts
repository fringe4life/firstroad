const ticketsPath = () => "/tickets";

function ticketPath(tickeId: string): string {
  return `${ticketsPath()}/${tickeId}`;
}

export { ticketPath, ticketsPath };
