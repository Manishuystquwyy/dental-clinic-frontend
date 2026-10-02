import { cp, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

// Keep PDF fonts, character maps and image decoders on our own host.
const source = new URL('../node_modules/pdfjs-dist/', import.meta.url)
const destination = new URL('../public/pdfjs/', import.meta.url)
await mkdir(destination, { recursive: true })
for (const directory of ['cmaps', 'standard_fonts', 'wasm', 'iccs']) {
  await cp(fileURLToPath(new URL(directory, source)), fileURLToPath(new URL(directory, destination)), { recursive: true })
}
