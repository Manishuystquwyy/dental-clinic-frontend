import test from 'node:test'
import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map((entry) => {
    const path = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory)
    return entry.isDirectory() ? sourceFiles(path) : /\.[jt]sx?$/.test(entry.name) ? [path] : []
  }))
  return files.flat()
}

test('application uses styled feedback instead of browser alert, confirm, or prompt', async () => {
  for (const file of await sourceFiles(new URL('../src/', import.meta.url))) {
    assert.doesNotMatch(await readFile(file, 'utf8'), /\b(?:alert|confirm|prompt)\s*\(/, file.pathname)
  }
})
