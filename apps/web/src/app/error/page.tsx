import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import { homePath } from "@/path";

const ErrorPage = () => (
  <main className="flex min-h-dvh items-center justify-center px-4">
    <CardCompact
      className="w-full max-w-md"
      content={
        <div className="space-y-4">
          <p>Please try again in a moment, or return to the home page.</p>
          <Link
            className="inline-flex items-center font-medium text-sm underline"
            href={homePath()}
          >
            Go back home
          </Link>
        </div>
      }
      description="We hit an unexpected error while processing your request."
      title="Something went wrong"
    />
  </main>
);

export default ErrorPage;
