import Link from "next/link";
import Heading from "@/components/heading";
import { ticketsPath } from "@/path";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-y-8">
      <Heading title="Home Page" description="Your home place to start" />
      <div className="flex flex-1 flex-col items-center">
        <Link href={ticketsPath()} className="underline">
          Tickets
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
