// my-framework/global.d.ts
declare global {
  interface DirectiveRegistry {
    "use cache": never;
    "use cache: private": never;
    "use cache: remote": never;
  }
}

export {};
