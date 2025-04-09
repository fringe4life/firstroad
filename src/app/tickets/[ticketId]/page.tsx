import { initialTickets } from "@/data"

type TicketParams = {
    params: Promise<{
        ticketId: string
    }>
}

const Ticket = async ({ params }: TicketParams) => {
    const param = await params

    const ticket = initialTickets.find(ticket => ticket.id === param.ticketId)
    return <h3 className="italic text-lg animate-bounce p-4">{ ticket?.title || 'not found' }</h3>
}

export default Ticket