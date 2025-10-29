import { LucideLogOut } from "lucide-react";
import Form from "next/form";
import { signOut } from "../actions/signout";

const SignOutForm = () => (
  <Form action={signOut}>
    <button type="submit">
      <LucideLogOut className="mr-2 aspect-square h-4" />
      Sign Out
    </button>
  </Form>
);

export default SignOutForm;
