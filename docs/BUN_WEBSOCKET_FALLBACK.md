# Bun WebSocket Default With Node Fallback

This project targets Bun as the default runtime. For Neon, Bun provides a
built-in `WebSocket` implementation that can be used directly.

If you need a Node.js fallback (for CI or alternate runtimes), use a conditional
import of `ws` and only apply it when `globalThis.WebSocket` is unavailable.

## Example

```ts
import { neonConfig } from "@neondatabase/serverless";

const bunWebSocket = globalThis.WebSocket;

if (bunWebSocket) {
  neonConfig.webSocketConstructor = bunWebSocket;
} else {
  const { default: ws } = await import("ws");
  neonConfig.webSocketConstructor = ws;
}
```

## Notes

- Bun runtime: `globalThis.WebSocket` exists and should be used.
- Node.js runtime: fall back to `ws` only when needed.
