import Link from "next/link";
import { ticketsPath } from "@/path";

const  HomePage = () => {
  return (
    <>
      <h2 className="text-6xl">Home Page</h2>
      <Link href={ticketsPath()} >Tickets</Link>
    </>
  );
}

export default HomePage