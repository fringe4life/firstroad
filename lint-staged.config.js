/** @type {import('lint-staged').Configuration} */
export default {
  "*.{js,jsx,ts,tsx,json,jsonc,css,scss,md,mdx}":
    "bun x ultracite fix --unsafe true",
  "**/*.{ts,tsx}": () => "bun run type",
};
