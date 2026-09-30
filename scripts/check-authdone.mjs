// Checks every state of /auth/done straight from lib/authdone.ts — no build,
// no server, no dependencies:  node scripts/check-authdone.mjs
//
// Written 2026-09-30, the day the bare address was found saying "You're signed
// in" to anybody who pasted it. The first assertion below is that bug; run
// against the version before commit abda206 it fails, which is how this check
// was shown to see anything at all. Also covered: the button carries only the
// allow-listed parameters, nothing from the query is reflected raw, every
// response is no-store, and the one inline script still matches its CSP hash
// (change SCRIPT and forget the header, and the button silently dies).
// Optional args: another copy of authdone.ts to check, then a folder to write
// the rendered empty/ok/cancelled/failed pages into (for screenshots).
// Needs Node >= 22.18 / 23.6 (it imports the .ts directly, types stripped).
import { pathToFileURL } from 'node:url'
import { writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const src = process.argv[2]
  ? pathToFileURL(process.argv[2]).href
  : new URL('../lib/authdone.ts', import.meta.url).href
const mod = await import(src)
const B = 'https://loudflow.xyz/auth/done'
const get = async (q) => {
  const r = mod.authDoneResponse(new Request(B + q))
  return { r, h: await r.text() }
}
const h1 = (h) => (h.match(/<h1>([\s\S]*?)<\/h1>/) || [])[1]
const href = (h) => (h.match(/id="open" href="([^"]*)"/) || [])[1] ?? null
const pose = (h) => (h.match(/data-pose="([^"]*)"/) || [])[1]
let n = 0
const ok = (c, m) => { assert.ok(c, m); n++ }

const cases = {
  empty: '',
  emptyCode: '?code=',
  stateOnly: '?state=abc',
  hugeCode: '?code=' + 'a'.repeat(3000),
  ok: '?code=abc-123',
  cancelled: '?error=access_denied&error_description=The+user+denied+the+request',
  failed: '?error=server_error&error_code=unexpected_failure&error_description=Unable+to+exchange+external+code',
  xss: '?error=x%22%3E%3Cscript%3Ealert(1)%3C/script%3E&error_description=%3Cimg%20src=x%20onerror=alert(1)%3E',
  smuggle: '?code=abc&redirect=https://evil.example&token=t',
}
const out = {}
for (const [k, q] of Object.entries(cases)) out[k] = await get(q)

for (const k of ['empty', 'emptyCode', 'stateOnly', 'hugeCode']) {
  const h = out[k].h
  ok(!/signed/i.test(h1(h)), `${k}: must not claim a sign-in, got ${h1(h)}`)
  ok(h1(h).includes('Nothing to do'), `${k}: neutral title`)
  ok(href(h) === null, `${k}: no button`)
  ok(pose(h) === 'listening', `${k}: calm Lou`)
  ok(h.includes('/img/lou-listening.svg'), `${k}: listening drawing`)
}
ok(h1(out.ok.h).includes('signed'), 'ok: signed in')
ok(href(out.ok.h) === 'loudflow://auth?code=abc-123', 'ok: handoff carries the code')
ok(pose(out.ok.h) === 'happy', 'ok: happy')
ok(h1(out.cancelled.h).includes('cancelled'), 'cancelled title')
ok(!out.cancelled.h.includes('class="why"'), 'cancelled: no machine words')
ok(href(out.cancelled.h).startsWith('loudflow://auth?error=access_denied'), 'cancelled: answer goes back')
ok(h1(out.failed.h).includes('work'), 'failed title')
ok(out.failed.h.includes('Unable to exchange external code (server_error)'), 'failed: reason shown')
ok(pose(out.failed.h) === 'puzzled', 'failed: puzzled')
ok(!/<script>alert|<img src=x/i.test(out.xss.h), 'xss: nothing reflected raw')
ok(!out.smuggle.h.includes('evil.example') && !href(out.smuggle.h).includes('token'), 'smuggle: only allow-listed params forwarded')
for (const [k, { r }] of Object.entries(out)) {
  ok(r.headers.get('cache-control').includes('no-store'), `${k}: no-store`)
  ok(r.headers.get('content-security-policy').includes(`'sha256-${mod.SCRIPT_SHA256}'`), `${k}: csp hash`)
}
// the one inline script must still be the hashed one
for (const [k, { h }] of Object.entries(out)) {
  const inl = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1])
  ok(inl.length === 1, `${k}: exactly one inline script`)
  const { createHash } = await import('node:crypto')
  ok(createHash('sha256').update(inl[0], 'utf8').digest('base64') === mod.SCRIPT_SHA256, `${k}: inline script matches hash`)
}
if (process.argv[3]) {
  for (const k of ['empty', 'ok', 'cancelled', 'failed']) writeFileSync(`${process.argv[3]}/${k}.html`, out[k].h)
}
console.log(`CHECK PASS — ${n} assertions, ${Object.keys(cases).length} visits`)
