const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const file = require('node:path').resolve(process.argv[2])
const { main } = require(file)
const read = fs.readFile
const stat = fs.stat
fs.readFile = async (path, ...options) => path === '/media/startos/volumes/main/config.yaml' ? '{}' : read(path, ...options)
fs.stat = async (path, ...options) => path === '/media/startos/volumes/main/config.yaml' ? { isFile: () => true } : stat(path, ...options)
const effects = {
  isInContext: false,
  getHostInfo() { throw new Error('legacy address schema must not be read during startup') },
  onLeaveContext() {},
}
;(async () => {
  const result = await main({ effects })
  const entries = result.entries
  assert.ok(entries.some(e => e.id === 'dashboard'))
  assert.ok(entries.some(e => e.id === 'gateway'))
  // Health checks are evaluated later by StartOS, never needed to define/start
  // the gateway. No fixtures start a real daemon or change package state.
  const source = await read(file, 'utf8')
  assert.ok(source.includes('http://127.0.0.1:${dashboardPort}/api/status'))
  assert.ok(source.includes('assert response.status == 200'))
  assert.ok(source.includes("user: 'hermes'"))
  console.log('Built startup canary passes without host address lookup')
})().catch(e => { console.error(e); process.exitCode = 1 }).finally(() => { fs.readFile = read; fs.stat = stat })
