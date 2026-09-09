import { cn } from "cnfast";
import { defineConfig } from "cva";

// biome-ignore lint/performance/noBarrelFile: recommended way to do this
export { cn } from "cnfast";
export type { VariantProps } from "cva";

export const { cva } = defineConfig({
  hooks: {
    onComplete: (className) => cn(className),
  },
});
