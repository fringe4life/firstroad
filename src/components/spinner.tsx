import { LoaderCircle } from "lucide-react";

const Spinner = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <LoaderCircle className="size-10 animate-spin" />
    </div>
  );
};

export default Spinner;
