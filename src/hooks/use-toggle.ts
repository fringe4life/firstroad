"use client";

import { useState } from "react";

export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = () => setValue(!value);
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
