// Test ncc's built interface callback and its real SDK-generated bind payload.
const assert = require('node:assert/strict')
const file = require('node:path').resolve(process.argv[2])
const Module = require('node:module')
const built = require('node:fs').readFileSync(file, 'utf8')
const definition = 'const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {'
assert.equal(built.split(definition).length, 2)
const canary = new Module(file, module)
canary.filename = file
canary.paths = module.paths
// Expose the existing lexical callback in memory only. It is intentionally
// not a production export; the package init invokes it through setupInit.
canary._compile(built.replace(definition, 'const setInterfaces = global.__bindCanary = sdk.setupInterfaces(async ({ effects }) => {'), file)
const setInterfaces = global.__bindCanary
delete global.__bindCanary
const rejected = 'Invalid params: Deserialization Error: invalid type: sequence, expected string or map@bind'

async function exercise(mode) {
  const calls = [], exported = [], cleaned = []
  const effects = {
    async bind(options) {
      assert.equal(this, effects, 'preserve the original Effects receiver')
      calls.push(structuredClone(options))
      if (mode === 'old' || mode === 'second-error') {
        if (Array.isArray(options.addSsl.alpn)) throw new Error(rejected)
        assert.deepEqual(options.addSsl.alpn, { specified: ['http/1.1'] })
        if (mode === 'second-error') throw new Error('second call failed')
      } else if (mode === 'timeout') throw new Error('Timed out@bind')
      else if (mode === 'other') throw new Error('Invalid params: another field@bind')
    },
    async exportServiceInterface(options) { exported.push(options) },
    async clearBindings(options) { cleaned.push(options) },
    async clearServiceInterfaces(options) { cleaned.push(options) },
  }
  let failure
  try { await setInterfaces(effects) } catch (error) { failure = error }
  if (!calls.length && failure) throw failure
  assert.ok(calls.every(p => p.id === 'ui-multi' && p.internalPort === 9119))
  assert.deepEqual(calls[0].addSsl.alpn, ['http/1.1'])
  if (mode === 'new' || mode === 'old') {
    assert.equal(failure, undefined)
    assert.equal(calls.length, mode === 'old' ? 2 : 1)
    assert.equal(exported.length, 1)
    assert.equal(exported[0].id, 'ui')
    assert.equal(exported[0].addressInfo.scheme, 'http')
    assert.equal(exported[0].addressInfo.sslScheme, 'https')
    assert.ok(cleaned[0].except.every(p => p.id === 'ui-multi' && p.internalPort === 9119))
    assert.deepEqual(cleaned[1], { except: ['ui'] })
    if (mode === 'old') {
      assert.deepEqual({ ...calls[1], addSsl: calls[0].addSsl }, calls[0])
      assert.deepEqual({ ...calls[1].addSsl, alpn: calls[0].addSsl.alpn }, calls[0].addSsl)
    }
  } else {
    assert.ok(failure)
    assert.equal(calls.length, mode === 'second-error' ? 2 : 1)
    assert.equal(exported.length, 0)
    assert.equal(cleaned.length, 0)
  }
}
;(async () => {
  for (const mode of ['new', 'old', 'timeout', 'other', 'second-error']) await exercise(mode)
  console.log('5 built SDK binding compatibility canaries passed')
})().catch(error => { console.error(error); process.exitCode = 1 })
