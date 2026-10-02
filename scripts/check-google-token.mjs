// Checks app/api/google-token/route.ts offline — fake Google, no secret needed:
//   node scripts/check-google-token.mjs
// It must print CHECK PASS. Written 2026-09-30 with the function.
import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'
const mod = await import(process.argv[2] ? pathToFileURL(process.argv[2]).href : new URL('../app/api/google-token/route.ts', import.meta.url).href)
const V = 'v'.repeat(86)
const post = (b) => mod.POST(new Request('https://loudflow.ai/api/google-token', { method: 'POST', body: typeof b === 'string' ? b : JSON.stringify(b) }))
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++ }
delete process.env.GOOGLE_CLIENT_SECRET
let r = await post({ code: '4/0Abcdefghijk', code_verifier: V })
ok(r.status === 503 && (await r.json()).error === 'not_configured', 'no secret -> 503')
process.env.GOOGLE_CLIENT_SECRET = 'TEST-SECRET'
const sent = []
globalThis.fetch = async (url, init) => { sent.push({ url, body: new URLSearchParams(init.body) }); const c = sent.at(-1).body.get('code'); if (c === 'BADBADBADBAD') return new Response(JSON.stringify({ error: 'invalid_grant', error_description: 'Bad Request' }), { status: 400 }); return new Response(JSON.stringify({ id_token: 'ID', access_token: 'AT', refresh_token: 'NO', expires_in: 3599 }), { status: 200 }) }
r = await post({ code: '4/0Abcdefghijk', code_verifier: V }); const j = await r.json()
ok(r.status === 200 && j.id_token === 'ID' && j.access_token === 'AT' && !('refresh_token' in j), 'happy path returns only id+access token')
ok(r.headers.get('cache-control').includes('no-store'), 'no-store')
const b = sent[0].body
ok(sent[0].url === 'https://oauth2.googleapis.com/token', 'google token endpoint')
ok(b.get('redirect_uri') === 'https://loudflow.ai/auth/done' && b.get('code_verifier') === V && b.get('client_secret') === 'TEST-SECRET' && b.get('grant_type') === 'authorization_code', 'exchange body')
r = await post({ code: 'BADBADBADBAD', code_verifier: V }); ok(r.status === 400 && (await r.json()).error === 'invalid_grant', 'google refusal passes as a fixed word')
for (const bad of [{ code: 'x', code_verifier: V }, { code: '4/0Abcdefghijk', code_verifier: 'short' }, { code: '4/0Abc def ghijk', code_verifier: V }, 'not json', 'x'.repeat(5000)]) { const before = sent.length; r = await post(bad); ok(r.status === 400 || r.status === 413, `bad input refused: ${String(JSON.stringify(bad)).slice(0, 30)}`); ok(sent.length === before, 'bad input never reaches Google') }
r = mod.GET(); ok(r.status === 405, 'GET 405')
console.log(`CHECK PASS — ${n} assertions`)
