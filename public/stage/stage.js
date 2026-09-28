/* Die Stimme — LoudFlow sign-in art panel.
 *
 * SHIPPED 2026-09-28 from ui/login-redo/motion/die-stimme/ (the workflow's
 * winner, 20.5 of 30). One change for the app: Lou is the live rig
 * (lou/lou-rig.js) when it is loaded, so the sign-in can change his POSE per
 * step — Lauro: "beim Login ist ja immer das rechte Bild gleich … der Hund
 * könnte andere Positionen haben". `mount()` returns { destroy, setPose }.
 * Without the rig the drawn Lou below stands in, exactly as before.
 *
 * Suminagashi, driven by a voice that reads a line of text. In the old
 * Japanese craft, drops of ink and clear water are laid on still water; every
 * new drop pushes all the older rings outward, area-preserving, and a breath
 * of air marbles them. The marbled endpapers of old books come from the idea.
 *
 * Here the page reads itself aloud. A line of EB Garamond sits in the lower
 * third; as each word is spoken it is marked in warm amber, and at that same
 * moment its syllables land in the water as drops (stressed = teal,
 * unstressed = pale, the one emphasised word = deep teal and italic). A spoken
 * word cools to teal and fades upward — it has gone into the water. Every
 * pause lays a drop of faintly tinted water, so phrases stay visible as ring
 * groups; every phrase ends with a fine dark ripple. Young ink is amber while
 * the voice sounds and cools to teal as it travels. Lou sits at the edge of
 * the water and listens: the sound reaches him as three small arcs, and his
 * ear lifts at the end of every phrase. "Die Seite spricht, der Hund hört zu."
 *
 * Contract: globalThis.LFStage.mount(host, opts) -> { destroy() }.
 *   opts.reducedMotion  force the still (default: prefers-reduced-motion)
 *   opts.lines          the text the voice reads (default: German lines below;
 *                       *word* marks the emphasised word)
 *   opts.seed, opts.stillAt
 * CSP-safe: no inline style attributes (only el.style.setProperty), no eval,
 * no network, no workers. WebGL2; without it the panel stays quiet paper with
 * Lou and the line. Renders at most 30 fps. Exposes globalThis.__stageStats =
 * { avgFrameMs } — rolling mean JS time of the frames that render.
 * The host must be positioned (signin's .sg-art is); if it is static, mount
 * makes it relative and destroy() puts the old value back.
 */
(function () {
  'use strict'

  /* ------------------------------------------------------------ tokens -- */
  const PAPER = [0.961, 0.957, 0.941] // #f5f4f0
  const AMBER = [1.0, 0.663, 0.275] // #ffa946

  const PREROLL = 44 // seconds of speech already on the water when we arrive
  const FPS = 30

  const LINES_DE = [
    'Die Seite *spricht*,',
    'der *Hund* hört zu.',
    'Jedes Wort ein *Tropfen*,',
    'jede Pause klares *Wasser*.',
    'Markier einen *Satz*,',
    'und hör ihn in *deiner* Stimme.',
    'Aus Text wird *Klang*.',
  ]
  // The same seven lines in English — the app's other half. A language that
  // is neither gets English, which is what the rest of the window falls back to.
  const LINES_EN = [
    'The page *speaks*,',
    'the *dog* listens.',
    'Every word a *drop*,',
    'every pause clear *water*.',
    'Select a *sentence*,',
    'and hear it in *your* voice.',
    'Text becomes *sound*.',
  ]
  function defaultLines () {
    let lang = ''
    try { lang = (globalThis.LF_STRINGS && LF_STRINGS.language && LF_STRINGS.language()) || document.documentElement.lang || '' } catch (e) { lang = '' }
    return /^de/i.test(String(lang)) ? LINES_DE : LINES_EN
  }

  /* ----------------------------------------------------------- prng ----- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0
      let t = Math.imul(a ^ (a >>> 15), 1 | a)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  function syllables(word) {
    const m = word.toLowerCase().match(/[aeiouyäöü]+/g)
    return Math.max(1, m ? m.length : 1)
  }

  /* ------------------------------------------------------ the voice ---- *
   * Reads the lines in a loop, one phrase per line. First syllable of a word
   * carries the stress; energy declines across a phrase; a comma is a short
   * pause, a full stop a long one with a breath. Deterministic from its seed.
   *
   * Every phrase lands at its own point: the hand moves by >= 0.2 R between
   * phrases (never back onto the last pocket), so the centre never becomes a
   * concentric target.
   *
   * Emits DROPS: { t0, dur, area, kind, amp, ox, oy } (ref px, R_ref = 215)
   *   kind 0 tinted water · 1 pale · 2 teal · 3 deep teal · 4 dark hairline */
  function Voice(seed, startT, lines) {
    const rnd = mulberry32(seed)
    const parsed = lines.map((ln) => ln.split(/\s+/).filter(Boolean).map((w) => {
      const emph = /\*/.test(w)
      const text = w.replace(/\*/g, '')
      return { text, emph, n: syllables(text.replace(/[^\p{L}]/gu, '') || 'a') }
    }))
    const phrases = []
    const drops = []
    let cursor = startT
    let li = 0
    let ang = rnd() * 6.283
    let prevPause = 1

    function makePhrase() {
      const words = parsed[li % parsed.length]
      const lineText = lines[li % lines.length]
      li++
      // where this phrase lands: a step round a small circle about the centre
      ang += 2.1 + rnd() * 0.8
      const rho = 16 + rnd() * 12
      const ox = Math.cos(ang) * rho, oy = Math.sin(ang) * rho * 0.85
      const syl = []
      const ws = []
      let t = cursor
      for (let w = 0; w < words.length; w++) {
        const wd = words[w]
        const wt0 = t
        for (let s = 0; s < wd.n; s++) {
          const dur = 0.13 + rnd() * 0.1
          const stressed = s === 0
          let amp = stressed ? 0.92 + rnd() * 0.12 : 0.52 + rnd() * 0.2
          const isEmph = wd.emph && stressed
          if (isEmph) amp = 1.12
          syl.push({ t0: t, dur, amp, stressed, isEmph })
          t += dur
        }
        ws.push({ text: wd.text, emph: wd.emph, t0: wt0, t1: t })
        t += 0.05 + rnd() * 0.06 // the gap between words
        if (/,$/.test(wd.text) && w < words.length - 1) t += 0.2
      }
      const n = syl.length
      for (let k = 0; k < n; k++) syl[k].amp *= 1.0 - 0.26 * (k / Math.max(1, n - 1))
      const last = words[words.length - 1].text
      const paragraph = /[.!?]$/.test(last)
      const pause = paragraph ? 1.35 + rnd() * 0.25 : 0.42 + rnd() * 0.25
      // the line comes up during the pause before it, after the last word of
      // the line before has been said
      const ph = { start: cursor, showAt: cursor - Math.min(0.4, prevPause * 0.5), end: t, pauseEnd: t + pause, paragraph, syl, words: ws, text: lineText, id: li, ox, oy }
      prevPause = pause
      phrases.push(ph)
      // the drops this phrase lays on the water; each grows in slowly
      // (0.65 s, out-cubic), so a syllable pushes, it never pops
      for (const s of syl) {
        const size = 24 + 16 * s.amp
        drops.push({
          t0: s.t0, dur: 0.65, area: size * size,
          kind: s.isEmph ? 3 : s.stressed ? 2 : 1, amp: s.amp,
          ox: ox + (rnd() - 0.5) * 6, oy: oy + (rnd() - 0.5) * 6,
        })
      }
      // the phrase's end: a fine dark line and the pause's water, laid
      // together and grown together, so the line is a ripple from its first
      // frame and never a dark dot at the focal point
      const wdur = Math.min(1.3, Math.max(0.75, pause * 0.9))
      drops.push({ t0: t + 0.03, dur: wdur, area: 15 * 15, kind: 4, amp: 1, ox, oy })
      drops.push({ t0: t + 0.03, dur: wdur, area: (paragraph ? 820 : 1050) * pause, kind: 0, amp: 0, ox, oy })
      cursor = t + pause
    }

    function ensure(T) {
      while (cursor < T + 3) makePhrase()
      while (phrases.length > 4 && phrases[2].pauseEnd < T - 1) phrases.shift()
      if (drops.length > 400) drops.splice(0, drops.length - 300)
    }

    function bump(u, s) {
      if (u < 0) return 0
      const a = 0.032
      const sus = s.dur * 0.5
      const rise = u < a ? (u / a) * (u / a) * (3 - 2 * (u / a)) : 1
      const fall = u < a + sus ? 1 : Math.exp(-(u - a - sus) / 0.055)
      return rise * fall * s.amp
    }

    const out = { env: 0, breath: 0, phrase: null, px: 0, py: 0 }
    function sample(T) {
      ensure(T)
      let env = 0, breath = 0, cur = null
      for (let p = 0; p < phrases.length; p++) {
        const ph = phrases[p]
        if (ph.showAt <= T) cur = ph
        if (T >= ph.start - 0.05 && T <= ph.end + 0.5) {
          for (let k = 0; k < ph.syl.length; k++) {
            const s = ph.syl[k]
            const u = T - s.t0
            if (u > -0.01 && u < s.dur + 0.4) env += bump(u, s)
          }
        }
        if (ph.paragraph && T > ph.end && T < ph.pauseEnd) {
          const x = (T - ph.end) / (ph.pauseEnd - ph.end)
          breath = Math.max(breath, Math.sin(Math.PI * x))
        }
      }
      env = Math.min(1.15, env)
      out.env = env; out.breath = breath; out.phrase = cur
      return out
    }
    // the most recent phrase whose drops have started: where the bloom is
    function pointAt(T) {
      let best = null
      for (const ph of phrases) if (ph.start <= T + 0.05) best = ph
      return best
    }
    return { sample, ensure, drops, phrases, pointAt }
  }

  /* ------------------------------------------------------------ shader -- */
  function fragSource(N) {
    return `#version 300 es
precision highp float;
uniform vec2 uRes;      // css px
uniform float uDpr;
uniform float uTime;
uniform vec2 uC;        // centre of the water, css px
uniform vec2 uP;        // where the voice lands now (the bloom), css px
uniform float uR;       // reference radius, css px
uniform float uEnv;
uniform float uIntro;   // 0 -> 1 as the ink soaks in
uniform float uGrainT;
uniform int uN;
uniform vec4 uD[${N}];  // centre.xy (css px), r² (px²), unused
uniform vec4 uE[${N}];  // age (s), amp, kind, unused
uniform vec4 uV[2];     // eddies: centre.xy (in uR), strength (rad), width (in uR)
out vec4 o;

const vec3 PAPER = vec3(${PAPER.join(',')});
const vec3 AMBER = vec3(${AMBER.join(',')});
const vec3 A_TEAL = -log(vec3(0.212, 0.580, 0.537)); // #369489
const vec3 A_PALE = -log(vec3(0.518, 0.804, 0.757)); // #84cdc1
const vec3 A_DEEP = -log(vec3(0.012, 0.310, 0.275)); // #034f46
const vec3 A_INK  = -log(vec3(0.086, 0.082, 0.059)); // #16150f
const vec3 A_AMB  = -log(vec3(0.999, 0.663, 0.275)); // #ffa946
// clear water carries a trace of soft teal, so a pause is never a hole
// brighter than the page
const vec3 A_WATER = A_PALE * 0.36;

float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(h21(i), h21(i+vec2(1,0)), u.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), u.x), u.y); }
const mat2 RM = mat2(1.6, 1.2, -1.2, 1.6);
float fbm3(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 3; i++){ s += a*vn(p); p = RM*p; a *= 0.5; } return s; }
vec3 screen(vec3 a, vec3 b){ return 1.0 - (1.0-a)*(1.0-b); }

/* One drop's pigment. Young ink is warm and lit while the voice sounds; it
 * cools to teal over two seconds, thinning a little on the way (like ink
 * spreading) but never clearing to paper, so warm and cool hand over without
 * a white rim and without mud. */
vec3 inkAbs(float kind, float age, float ePx, float g){
  // young water still carries the voice's warmth, so a pause inside a fresh
  // bloom is a pale warm core, not a cold hole; it cools like the ink
  float cool = smoothstep(0.4, 1.8, age);
  if (kind < 0.5) return mix(A_AMB * 0.3, A_WATER, cool);
  // the phrase's closing line: born mint, it darkens only as it travels, so
  // it is a fine dark line out in the field and never a ring round the centre
  if (kind > 3.5) return mix(mix(A_AMB * 0.3, A_WATER, cool), mix(A_INK, A_DEEP, 0.5) * 0.5, smoothstep(0.9, 2.6, age));
  vec3 ab; float dens;
  if (kind < 1.5)      { ab = A_PALE; dens = 0.46; }
  else if (kind < 2.5) { ab = A_TEAL; dens = 0.80; }
  else                 { ab = A_DEEP; dens = 0.74; }
  // amber -> mint -> the ring's own teal. Straight from amber to teal
  // would pass through khaki (their absorptions add up to green-grey);
  // mint absorbs almost no red, so the way through it stays peach, then cool
  vec3 warm = A_AMB * (kind > 2.5 ? 1.3 : kind > 1.5 ? 0.95 : 0.62) * 0.9;
  vec3 a = mix(warm, A_PALE * 0.55, smoothstep(0.35, 1.2, age));
  a = mix(a, ab * dens, smoothstep(1.0, 2.4, age));
  float edge = 1.0 - smoothstep(0.5, 1.7, ePx);
  return a * (0.86 + 0.28*g) + a * edge * 0.5;
}

void main(){
  vec2 fc = vec2(gl_FragCoord.x, uRes.y*uDpr - gl_FragCoord.y) / uDpr;
  float t = uTime;
  float k = uR / 215.0;

  /* ---- paper ---- */
  float tooth = fbm3(fc*0.42) - 0.5;
  vec3 col = PAPER * (1.0 + 0.022*tooth);
  vec2 uv = fc / uRes;
  col *= mix(0.962, 1.0, smoothstep(1.3, 0.35, length((uv - vec2(0.5, 0.45))*vec2(1.0, 0.85))));

  vec2 rel = fc - uC;
  float r0 = length(rel);
  vec3 A = vec3(0.0);
  float cull = 1.0 - smoothstep(1.42*uR, 1.62*uR, r0);
  if (cull > 0.002){
  vec2 x = fc;

  /* ---- the bloom: where the voice lands, the youngest ink spreads with an
   *      irregular, slowly breathing edge — ink, not a clean ellipse ---- */
  vec2 bp = fc - uP;
  float br = length(bp);
  float bs = 0.30 * uR;
  float bl = exp(-br*br / (2.0*bs*bs));
  if (bl > 0.01){
    vec2 dir = bp / max(br, 1e-3);
    float n = vn(dir*1.8 + vec2(t*0.09, -t*0.06)) + 0.5*vn(dir*3.7 + vec2(-t*0.13, 4.0)) + 0.25*vn(dir*7.5 + vec2(2.0, t*0.2));
    x = uP + bp * (1.0 + 0.44*bl*(n - 0.875));
  }

  /* ---- the air over the water: two slow eddies near the rim ---- */
  for (int j = 0; j < 2; j++){
    vec4 ev = uV[j];
    vec2 V = uC + ev.xy * uR;
    vec2 dv = x - V;
    float fall = exp(-dot(dv, dv) / (2.0 * ev.w * ev.w * uR * uR));
    float a = -ev.z * fall;
    float c = cos(a), sn = sin(a);
    x = V + mat2(c, sn, -sn, c) * dv;
  }
  float far = smoothstep(30.0*k, 300.0*k, r0);
  vec2 q = fc / (170.0*k);
  vec2 wv = vec2(fbm3(q + vec2(0.0, t*0.018)), fbm3(q + vec2(5.2, 1.3) - vec2(t*0.015, 0.0))) - 0.5;
  x += wv * k * (3.0 + 26.0*far);

  /* ---- undo the drops, newest first (Jaffer's marbling inverse) ---- */
  int hit = -1; float u = 0.0; float cum = 0.0; float aHit = 1.0;
  for (int i = 0; i < ${N}; i++){
    if (i >= uN) break;
    vec4 d = uD[i];
    vec2 v = x - d.xy;
    float r2 = dot(v, v);
    if (r2 < d.z){ hit = i; u = r2 / d.z; aHit = d.z; break; }
    cum += d.z;
    x = d.xy + v * sqrt(1.0 - d.z / r2);
  }

  if (hit >= 0){
    // S: r² measured from the newest drop — constant along every ring, so it
    // is the ring coordinate: edges, and the outer fade, follow the rings
    float S = cum + u*aHit;
    float rS = sqrt(S);
    float est = 2.0 * sqrt(max(S, 1.0));
    float fS = clamp(fwidth(S), 0.35*est, 2.2*est);
    float eOut = (1.0 - u) * aHit / fS;
    float eIn = u * aHit / fS;
    float gran = vn(fc*0.6) + 0.5*vn(fc*1.4) - 0.75;
    vec4 e = uE[hit];
    vec3 Ah = inkAbs(e.z, e.x, eOut, gran);
    vec3 Ao = vec3(0.0);
    if (hit + 1 < uN){ vec4 eo = uE[hit + 1]; Ao = inkAbs(eo.z, eo.x, 99.0, gran); }
    vec3 Ai = Ah;
    if (hit > 0){ vec4 ei = uE[hit - 1]; Ai = inkAbs(ei.z, ei.x, 0.0, gran); }
    Ah = mix(Ao, Ah, clamp(0.5 + eOut, 0.0, 1.0));
    Ah = mix(Ai, Ah, clamp(0.5 + eIn, 0.0, 1.0));
    Ah *= mix(0.62, 1.0, smoothstep(0.8, 2.6, aHit / fS));
    // the outer fade runs along the rings: a ring thins out as a whole, with
    // a dry-brush break-up that is long along the ring and short across it
    vec2 dir0 = rel / max(r0, 1e-3);
    float lob = vn(dir0*2.2 + 7.0) - 0.5;
    float dry = vn(vec2(rS / (7.0*k), 0.0) + dir0*5.0) - 0.5;
    float rf = rS + lob*70.0*k + dry*26.0*k;
    float fade = 1.0 - smoothstep(0.80*uR, 1.34*uR, rf);
    A = Ah * fade * cull;
  }
  }
  col *= exp(-A * uIntro);

  // the light of the voice itself, only while it sounds
  vec2 gp = fc - uP;
  float glow = exp(-dot(gp, gp) / (2.0*pow(62.0*k, 2.0)));
  col = screen(col, AMBER * glow * uEnv * 0.26 * uIntro);

  /* ---- grain ---- */
  col += (h21(gl_FragCoord.xy + uGrainT*vec2(37.0, 17.0)) - 0.5) * 0.026;
  o = vec4(col, 1.0);
}`
  }

  const VERT = `#version 300 es
in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`

  /* ------------------------------------------------------------- Lou ---- *
   * Lou from ui/login-redo/mascot/lou-listening.svg (the same paths), with
   * his ear, head, tail and eye driven by the voice instead of SMIL, plus
   * three sound arcs in front of his nose. Framed to the drawing. */
  const LOU_VB = [432, 352, 428, 372]
  // lou/lou-rig.js's fixed frame (its VB constant) — kept in step by hand
  const RIG_VB = [330, 262, 570, 474]
  let uid = 0
  function louSvg(id) {
    const S = 'fill="none" stroke="#1b1b1b" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"'
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOU_VB.join(' ')}" class="lfs-lou__svg" aria-hidden="true">
<defs><filter id="lfw${id}" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="4.5"/></filter><filter id="lfv${id}"><feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="8"/></filter></defs>
<g filter="url(#lfw${id})" fill="#fcfcfb">
<path d="M592,476 C570,516 566,560 580,602 L578,706 L752,706 C774,690 778,650 762,600 C742,530 690,474 640,448 Z"/>
<path d="M568,706 C568,692 612,692 614,706 Z"/><path d="M618,706 C622,690 686,690 700,706 Z"/>
<path transform="rotate(-9 600 440)" d="M640,420 C640,385 612,368 586,374 C566,379 556,394 549,407 L508,413 C490,415 481,430 487,443 C493,456 511,460 531,458 C551,460 561,470 581,474 C615,478 640,455 640,420 Z"/>
</g>
<g filter="url(#lfv${id})">
<path d="M690,520 C716,506 744,526 740,556 C736,584 706,588 692,570 C680,556 678,532 690,520 Z" fill="#3d9a8e"/>
<path d="M722,640 C744,630 764,650 758,672 C752,690 726,690 718,676 C710,662 712,648 722,640 Z" fill="#3d9a8e"/>
<path d="M596,478 C610,470 628,462 644,452" fill="none" stroke="#3d9a8e" stroke-width="13" stroke-linecap="round"/>
<g data-p="head" transform="rotate(-9 600 440)">
<path d="M556,398 C572,388 592,396 592,414 C592,432 570,436 558,428 C548,420 548,406 556,398 Z" fill="#3d9a8e"/>
<g transform="translate(7,-4) rotate(-22 614 392)"><g data-p="ear"><path d="M612,388 C640,378 662,398 664,430 C668,472 656,508 638,516 C622,520 614,500 614,478 C612,450 606,420 612,388 Z" fill="#3d9a8e"/></g></g>
</g>
</g>
<g filter="url(#lfw${id})">
<g data-p="tail"><path d="M766,684 C808,676 832,640 826,604 C824,590 832,580 844,580" ${S}/></g>
<path d="M592,476 C570,516 566,560 580,602 L578,700" ${S}/>
<path d="M608,604 L606,700" ${S}/>
<path d="M568,706 C568,692 612,692 614,706 Z" ${S}/>
<path d="M640,448 C690,474 742,530 762,600 C778,650 774,690 752,704 L700,706" ${S}/>
<path d="M744,612 C704,610 682,650 692,690" ${S}/>
<path d="M618,706 C622,690 686,690 700,706 Z" ${S}/>
<g data-p="head" transform="rotate(-9 600 440)">
<path d="M640,420 C640,385 612,368 586,374 C566,379 556,394 549,407 L508,413 C490,415 481,430 487,443 C493,456 511,460 531,458 C551,460 561,470 581,474 C615,478 640,455 640,420 Z" ${S}/>
<ellipse cx="490" cy="423" rx="10" ry="8" fill="#1b1b1b"/>
<ellipse data-p="eye" cx="573" cy="410" rx="5.2" ry="5.2" fill="#1b1b1b"/>
<path d="M560,392 C568,388 578,388 585,392" ${S}/>
<path d="M503,450 C514,457 527,458 536,455" ${S}/>
<g transform="rotate(-22 614 392)"><g data-p="ear"><path d="M612,388 C640,378 662,398 664,430 C668,472 656,508 638,516 C622,520 614,500 614,478 C612,450 606,420 612,388 Z" ${S}/></g></g>
</g>
<path data-p="arc" d="M466,414 C472,422 472,436 466,444" fill="none" stroke="#1b1b1b" stroke-width="4" stroke-linecap="round" opacity="0"/>
<path data-p="arc" d="M453,404 C463,418 463,440 453,454" fill="none" stroke="#1b1b1b" stroke-width="4" stroke-linecap="round" opacity="0"/>
<path data-p="arc" d="M440,394 C453,414 453,444 440,464" fill="none" stroke="#1b1b1b" stroke-width="4" stroke-linecap="round" opacity="0"/>
<path d="M470,716 C560,712 700,714 856,712" fill="none" stroke="#1b1b1b" stroke-width="3.6" stroke-linecap="round" opacity="0.3"/>
</g></svg>`
  }

  /* ------------------------------------------------------------- mount -- */
  function mount(host, opts) {
    opts = opts || {}
    const reduce = !!(opts.reducedMotion != null ? opts.reducedMotion
      : (globalThis.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches))
    const lines = Array.isArray(opts.lines) && opts.lines.length ? opts.lines : defaultLines()
    const id = ++uid

    const oldPos = host.style.getPropertyValue('position')
    const setPos = getComputedStyle(host).position === 'static'
    if (setPos) host.style.setProperty('position', 'relative')

    const root = document.createElement('div')
    root.className = 'lfs-root' + (reduce ? ' lfs-still' : '')
    root.setAttribute('aria-hidden', 'true')
    const canvas = document.createElement('canvas')
    canvas.className = 'lfs-canvas'
    const lineBox = document.createElement('div')
    lineBox.className = 'lfs-line'
    const slots = [document.createElement('p'), document.createElement('p')]
    for (const s of slots) { s.className = 'lfs-phrase'; lineBox.appendChild(s) }
    const louBox = document.createElement('div')
    louBox.className = 'lfs-lou'
    const Rig = opts.rig === false ? null : globalThis.LouRig
    let rig = null
    let L = null
    root.appendChild(canvas); root.appendChild(lineBox); root.appendChild(louBox)
    host.appendChild(root)
    if (Rig && typeof Rig.mount === 'function') {
      try {
        louBox.classList.add('lfs-lou--rig')
        rig = Rig.mount(louBox, { state: opts.pose || 'listening', reducedMotion: reduce })
      } catch (e) {
        console.warn('[die-stimme] Lou rig: ' + (e && e.message))
        rig = null
        louBox.classList.remove('lfs-lou--rig')
      }
    }
    if (!rig) {
      louBox.innerHTML = louSvg(id)
      const q = (p) => Array.from(louBox.querySelectorAll(`[data-p="${p}"]`))
      L = { head: q('head'), ear: q('ear'), tail: q('tail'), eye: q('eye')[0], arcs: q('arc') }
    }
    let pose = opts.pose || 'listening'

    const stats = { avgFrameMs: 0, frames: 0, mode: 'webgl2', drops: 0 }
    globalThis.__stageStats = stats
    const hist = new Float32Array(120); let histI = 0, histN = 0, histSum = 0

    let W = 0, H = 0, dpr = 1
    let gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'low-power' })
    let prog = null, U = null, vao = null, buf = null
    let N = 80
    let dBuf = null, eBuf = null
    let destroyed = false, raf = 0

    function build() {
      const maxVec = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) || 224
      N = Math.max(32, Math.min(80, Math.floor((maxVec - 24) / 2)))
      dBuf = new Float32Array(N * 4); eBuf = new Float32Array(N * 4)
      function sh(type, src) {
        const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s)
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { const e = gl.getShaderInfoLog(s); gl.deleteShader(s); throw new Error('shader: ' + e) }
        return s
      }
      const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, fragSource(N))
      prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs)
      gl.bindAttribLocation(prog, 0, 'aPos'); gl.linkProgram(prog)
      gl.deleteShader(vs); gl.deleteShader(fs)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link: ' + gl.getProgramInfoLog(prog))
      U = {}
      for (const n of ['uRes', 'uDpr', 'uTime', 'uC', 'uP', 'uR', 'uEnv', 'uV', 'uIntro', 'uGrainT', 'uN', 'uD', 'uE']) U[n] = gl.getUniformLocation(prog, n)
      vao = gl.createVertexArray(); gl.bindVertexArray(vao)
      buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    }

    if (gl) {
      try { build() } catch (e) { console.error('[die-stimme] ' + e.message); gl = null }
    }
    // Without WebGL2 the panel stays the host's quiet paper, with Lou and
    // the line still there — no clip-art stand-in.
    if (!gl) { stats.mode = 'paper'; canvas.remove() }

    /* ---------------- simulation ---------------- */
    const voice = Voice(opts.seed || 20260928, -PREROLL, lines)
    let T = 0, env = 0, breath = 0, level = 0, swirlPhase = 1.3
    // arrive just before the first line ("Die Seite spricht,") is read
    for (let t = 0; t < 40; t += 0.5) {
      voice.ensure(t)
      const first = voice.phrases.find((p) => p.start > 1 && (p.id - 1) % lines.length === 0)
      if (first) { T = first.start - 0.9; break }
    }
    let introT = reduce ? 99 : 0
    let pX = 0, pY = 0, pInit = false
    let lift = 0, wag = 0, lastEnd = -99

    function advance(dt) {
      let left = dt
      while (left > 1e-6) {
        const h = Math.min(1 / 120, left)
        T += h; left -= h; introT += h
        const v = voice.sample(T)
        env = v.env; breath = v.breath
        level += (env - level) * (1 - Math.exp(-h / (env > level ? 0.08 : 0.35)))
        swirlPhase += h * (0.085 + 0.12 * breath)
        // the bloom point glides to each new phrase's landing point
        const ph = voice.pointAt(T)
        if (ph) {
          if (!pInit) { pX = ph.ox; pY = ph.oy; pInit = true }
          const a = 1 - Math.exp(-h / 0.28)
          pX += (ph.ox - pX) * a; pY += (ph.oy - pY) * a
        }
        // Lou's ear: lifts at the end of every phrase, then settles
        for (const p of voice.phrases) if (T >= p.end && p.end > lastEnd) lastEnd = p.end
        const since = T - lastEnd
        const target = since >= 0 && since < 1.1 ? 1 : 0
        lift += (target - lift) * (1 - Math.exp(-h / (target > lift ? 0.09 : 0.45)))
        wag += ((breath > 0.05 ? 1 : 0) - wag) * (1 - Math.exp(-h / 0.25))
      }
    }

    // two slow eddies of air near the rim; a breath stirs them
    const vBuf = new Float32Array(8)
    function eddies() {
      const p = swirlPhase
      vBuf[0] = 0.98 * Math.cos(p * 0.6 + 0.7); vBuf[1] = 0.9 * Math.sin(p * 0.6 + 0.7)
      vBuf[2] = 0.62 * Math.sin(p * 1.3 + 0.4); vBuf[3] = 0.55
      vBuf[4] = 1.02 * Math.cos(p * 0.6 + 3.7); vBuf[5] = 0.95 * Math.sin(p * 0.6 + 3.7)
      vBuf[6] = -0.58 * Math.sin(p * 1.1 + 2.1); vBuf[7] = 0.6
      return vBuf
    }

    function easeOutCubic(x) { x = Math.min(1, Math.max(0, x)); return 1 - Math.pow(1 - x, 3) }

    // Composition: the water sits high and right and bleeds off the top and
    // right edges (the window's own edges); the lower third is paper for the
    // line and for Lou.
    function geometry() {
      const R = Math.min(W * 0.41, H * 0.36)
      return [Math.max(W * 0.62, W - 0.85 * R), H * 0.34, R]
    }

    function upload(cx, cy, R) {
      const k = R / 215, k2 = k * k
      const drops = voice.drops
      let n = 0
      for (let i = drops.length - 1; i >= 0 && n < N; i--) {
        const d = drops[i]
        if (d.t0 > T) continue
        const a = d.area * k2 * easeOutCubic((T - d.t0) / d.dur)
        if (a < 0.5) continue
        const j = n * 4
        dBuf[j] = cx + d.ox * k; dBuf[j + 1] = cy + d.oy * k; dBuf[j + 2] = a; dBuf[j + 3] = 0
        eBuf[j] = T - d.t0; eBuf[j + 1] = d.amp; eBuf[j + 2] = d.kind; eBuf[j + 3] = 0
        n++
      }
      stats.drops = n
      return n
    }

    /* ---------------- the line and Lou (DOM) ---------------- */
    let slotI = 0, shownId = -1, wordEls = [], wordState = []
    function showPhrase(ph) {
      const out = slots[slotI], inn = slots[1 - slotI]
      slotI = 1 - slotI
      out.classList.remove('is-shown'); out.classList.add('is-gone')
      inn.classList.remove('is-gone', 'is-shown')
      inn.textContent = ''
      wordEls = []; wordState = []
      ph.words.forEach((w, i) => {
        const s = document.createElement('span')
        s.className = 'lfs-w' + (w.emph ? ' lfs-w--em' : '')
        s.textContent = w.text
        inn.appendChild(s)
        if (i < ph.words.length - 1) inn.appendChild(document.createTextNode(' '))
        wordEls.push(s); wordState.push(0)
      })
      void inn.offsetWidth // commit the start state so the fade-in runs
      inn.classList.add('is-shown')
      shownId = ph.id
    }
    function updateLine() {
      const ph = voice.sample(T).phrase
      if (!ph) return
      if (ph.id !== shownId) showPhrase(ph)
      for (let i = 0; i < wordEls.length; i++) {
        const w = ph.words[i]
        const st = T >= w.t1 + 0.06 ? 2 : T >= w.t0 - 0.03 ? 1 : 0
        if (st !== wordState[i]) {
          wordState[i] = st
          wordEls[i].classList.toggle('is-now', st === 1)
          wordEls[i].classList.toggle('is-said', st === 2)
        }
      }
    }
    const louLast = { ear: '', head: '', tail: '', eye: '', arcs: ['', '', ''] }
    function setAttrs(els, key, val) {
      if (louLast[key] === val) return
      louLast[key] = val
      for (const e of els) e.setAttribute('transform', val)
    }
    function updateLou() {
      if (rig) {
        // His ear rides the voice only while he is listening; in the other
        // poses (waiting, a letter, puzzled, offline, happy) the pose speaks.
        rig.setListening(pose === 'listening' ? Math.min(1, Math.max(lift, level * 0.9)) : 0)
        return
      }
      setAttrs(L.ear, 'ear', `rotate(${(-13 * lift).toFixed(2)} 614 392)`)
      setAttrs(L.head, 'head', `rotate(${(-9 - 3.5 * lift).toFixed(2)} 600 440)`)
      const tw = wag * 9 * Math.sin(T * 13)
      setAttrs(L.tail, 'tail', `rotate(${tw.toFixed(1)} 768 684)`)
      const blink = ((T + 1.3) % 4.4) < 0.13 ? '0.8' : '5.2'
      if (louLast.eye !== blink) { louLast.eye = blink; L.eye.setAttribute('ry', blink) }
      for (let i = 0; i < 3; i++) {
        const a = Math.max(0, Math.min(1, (level - 0.12 - i * 0.2) * 1.8)) * 0.8
        const v = a.toFixed(2)
        if (louLast.arcs[i] !== v) { louLast.arcs[i] = v; L.arcs[i].setAttribute('opacity', v) }
      }
    }

    function render() {
      const [cx, cy, R0] = geometry()
      // the ink is already on the water, faintly, in the very first frame
      const intro = 0.4 + 0.6 * easeOutCubic(introT / 0.8)
      const R = R0 * (0.9 + 0.1 * intro)
      voice.ensure(T)
      updateLine()
      updateLou()
      if (!gl) return
      const n = upload(cx, cy, R)
      const k = R / 215
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.useProgram(prog)
      gl.bindVertexArray(vao)
      gl.uniform2f(U.uRes, W, H)
      gl.uniform1f(U.uDpr, canvas.width / W)
      gl.uniform1f(U.uTime, T)
      gl.uniform2f(U.uC, cx, cy)
      gl.uniform2f(U.uP, cx + pX * k, cy + pY * k)
      gl.uniform1f(U.uR, R)
      gl.uniform1f(U.uEnv, Math.min(1, level))
      gl.uniform4fv(U.uV, eddies())
      gl.uniform1f(U.uIntro, intro)
      gl.uniform1f(U.uGrainT, Math.floor(T * 12) % 97)
      gl.uniform1i(U.uN, n)
      gl.uniform4fv(U.uD, dBuf)
      gl.uniform4fv(U.uE, eBuf)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    function layout() {
      // Bigger than the drawn original (136-210): the rig's poses and face have
      // to read at arm's length on a 14-inch laptop.
      const lw = Math.max(170, Math.min(262, W * 0.3))
      const lh = lw * LOU_VB[3] / LOU_VB[2]
      const lx = W - Math.max(22, W * 0.05) - lw
      const ly = H - Math.max(26, H * 0.05) - lh
      const fs = Math.max(20, Math.min(28, W * 0.04))
      const tx = Math.max(28, W * 0.075)
      const noseX = lx + lw * (440 - LOU_VB[0]) / LOU_VB[2]
      const tw = Math.max(160, noseX - tx - fs * 0.8)
      // the line sits at the height of Lou's nose: the arcs run from it to him
      const tb = H - (ly + lh * 0.40) - fs * 0.35
      const st = root.style
      if (rig) {
        // the rig frames him wider (props need room): same dog, same spot
        const u = lw / LOU_VB[2]
        st.setProperty('--lfs-lou-x', (lx - (LOU_VB[0] - RIG_VB[0]) * u).toFixed(1) + 'px')
        st.setProperty('--lfs-lou-y', (ly - (LOU_VB[1] - RIG_VB[1]) * u).toFixed(1) + 'px')
        st.setProperty('--lfs-lou-w', (RIG_VB[2] * u).toFixed(1) + 'px')
      } else {
        st.setProperty('--lfs-lou-x', lx.toFixed(1) + 'px')
        st.setProperty('--lfs-lou-y', ly.toFixed(1) + 'px')
        st.setProperty('--lfs-lou-w', lw.toFixed(1) + 'px')
      }
      st.setProperty('--lfs-line-x', tx.toFixed(1) + 'px')
      st.setProperty('--lfs-line-b', tb.toFixed(1) + 'px')
      st.setProperty('--lfs-line-w', tw.toFixed(1) + 'px')
      st.setProperty('--lfs-fs', fs.toFixed(1) + 'px')
    }

    function resize() {
      const r = host.getBoundingClientRect()
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height))
      // 1.25 is enough for soft rings and paper grain; fragment cost goes
      // with the square of it
      dpr = Math.min(1.25, globalThis.devicePixelRatio || 1)
      const bw = Math.round(W * dpr), bh = Math.round(H * dpr)
      if (canvas.width !== bw || canvas.height !== bh) { canvas.width = bw; canvas.height = bh }
      layout()
      if (!running) render()
    }

    /* ---------------- clock (<= 30 fps) ---------------- */
    let running = false, last = 0
    const minGap = 1000 / FPS - 4
    function frame(now) {
      raf = 0
      if (destroyed || document.hidden) { running = false; return }
      raf = requestAnimationFrame(frame)
      if (now - last < minGap) return
      const t0 = performance.now()
      const dt = Math.min(0.1, Math.max(0, (now - last) / 1000))
      last = now
      advance(dt)
      render()
      const ms = performance.now() - t0
      histSum += ms - (histN === hist.length ? hist[histI] : 0)
      hist[histI] = ms; histI = (histI + 1) % hist.length; if (histN < hist.length) histN++
      stats.avgFrameMs = +(histSum / histN).toFixed(3); stats.frames++
    }
    function start() {
      if (running || destroyed || reduce || document.hidden) return
      running = true; last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0 }
    function onVis() { if (document.hidden) stop(); else start() }

    const ro = new ResizeObserver(() => resize())
    ro.observe(host)

    // devicePixelRatio changes (window dragged to another monitor) do not
    // resize the host, so the ResizeObserver never hears of them
    let mq = null
    function onDpr() { watchDpr(); resize() }
    function watchDpr() {
      if (mq) mq.removeEventListener('change', onDpr)
      mq = globalThis.matchMedia ? matchMedia(`(resolution: ${globalThis.devicePixelRatio || 1}dppx)`) : null
      if (mq) mq.addEventListener('change', onDpr)
    }
    watchDpr()

    function onLost(e) { e.preventDefault(); stop() }
    function onRestored() {
      try { build(); resize(); render(); start() } catch (err) { console.error('[die-stimme] ' + err.message) }
    }
    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', onRestored)

    if (reduce) {
      // One still: mid-phrase, a word lit, the warm bloom nested in cooling rings.
      advance(opts.stillAt != null ? opts.stillAt : 1.62)
      resize(); render()
    } else {
      resize()
      document.addEventListener('visibilitychange', onVis)
      start()
    }

    return {
      /** Lou's pose for the step on screen (LouRig.states). */
      setPose(name) {
        pose = String(name || 'listening')
        if (rig) { try { rig.setState(pose) } catch (e) { /* unknown pose: stays */ } }
      },
      destroy() {
        destroyed = true; stop()
        if (rig) { try { rig.destroy() } catch (e) { /* gone */ } rig = null }
        ro.disconnect()
        if (mq) mq.removeEventListener('change', onDpr)
        document.removeEventListener('visibilitychange', onVis)
        canvas.removeEventListener('webglcontextlost', onLost)
        canvas.removeEventListener('webglcontextrestored', onRestored)
        if (gl) { try { gl.deleteProgram(prog); gl.deleteBuffer(buf); gl.deleteVertexArray(vao); const x = gl.getExtension('WEBGL_lose_context'); if (x) x.loseContext() } catch (e) { /* gone */ } }
        root.remove()
        if (setPos) { if (oldPos) host.style.setProperty('position', oldPos); else host.style.removeProperty('position') }
        if (globalThis.__stageStats === stats) delete globalThis.__stageStats
      },
    }
  }

  globalThis.LFStage = { mount }
})()
