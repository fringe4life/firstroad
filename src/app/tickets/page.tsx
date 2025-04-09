import Link from "next/link";
import { initialTickets } from "@/data";
import { ticketPath } from "@/path";

const TicketsPage = () => {
    
    const tickets = initialTickets.map(ticket => (
        <article key={ ticket.id}>
            <h4>{ticket.title}</h4>
            <p>{ticket.status}</p>
            <Link className="underline cursor-pointer " href={ticketPath(ticket.id)}>Go to ticket</Link>
        </article>
    ))
    return (
    <main>
            <h2 className="text-3xl">Tickets Page</h2>
            <Link href={'/'} >Home</Link>
            <section>
                {tickets}
            </section>
    </main>
  );
}

export default TicketsPage