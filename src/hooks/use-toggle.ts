"use client";

import { useState } from "react";

export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState<boolean>(() => initialValue);

  const toggle = () => setValue((prevValue) => !prevValue);
  const open = () => setValue(true);
  const close = () => setValue(false);

  return {
    value,
    isOpen: value,
    toggle,
    open,
    close,
  };
};
