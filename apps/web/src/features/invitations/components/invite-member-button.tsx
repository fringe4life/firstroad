"use client";

import { LucidePlus } from "lucide-react";
import { useActionState, useId } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { ResponsiveLabel } from "@/components/responsive-label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToggle } from "@/hooks/use-toggle";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { createInvitation } from "../actions/create-invitation";

interface InviteMemberButtonProps {
  organizationId: string;
}

const InviteMemberButton = ({ organizationId }: InviteMemberButtonProps) => {
  const { isOpen, open, close } = useToggle(false);
  const emailId = useId();
  const roleId = useId();

  const [state, action] = useActionState(
    createInvitation.bind(null, organizationId),
    EMPTY_ACTION_STATE,
  );

  const handleSuccess = () => close();

  return (
    <>
      <ResponsiveLabel
        fullLabel="Invite Member"
        icon={<LucidePlus className="aspect-square w-4" />}
        shortLabel="Invite"
      >
        <Button onClick={open} />
      </ResponsiveLabel>

      <Dialog onOpenChange={close} open={isOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your organisation.
            </DialogDescription>
          </DialogHeader>

          <Form action={action} onSuccessState={handleSuccess} state={state}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor={emailId}>Email</Label>
                <Input
                  defaultValue={state?.payload?.email ?? ""}
                  id={emailId}
                  name="email"
                  placeholder="user@example.com"
                  type="email"
                />
                <FieldError actionState={state} name="email" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={roleId}>Role</Label>
                <Select
                  defaultValue={state?.payload?.role ?? "member"}
                  name="role"
                >
                  <SelectTrigger className="w-full" id={roleId}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError actionState={state} name="role" />
              </div>

              <SubmitButton label="Send Invitation" />
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { InviteMemberButton };
