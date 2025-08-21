import { LoaderCircle } from "lucide-react";

const Spinner = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <LoaderCircle className="animate-spin size-10" />
    </div>
  );
};

export default Spinner;
