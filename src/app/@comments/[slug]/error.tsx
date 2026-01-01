"use client";
import { Placeholder } from "@/components/placeholder";
import { Button } from "@/components/ui/button";
import type { ErrorProps } from "@/types";

const CommentsError = ({ reset }: ErrorProps) => (
  <Placeholder
    button={
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    }
    label="Comments not found"
  />
);

export default CommentsError;
