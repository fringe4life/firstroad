const ticketsPath = () => "/tickets";

const homePath = () => "/";

function ticketPath(tickeId: string): string {
  return `${ticketsPath()}/${tickeId}`;
}

export { homePath,ticketPath, ticketsPath };
