import { Buffer as BufferPolyfill } from 'buffer'

declare global {
  var Buffer: typeof BufferPolyfill | undefined
}

if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = BufferPolyfill
}

export {}
