/* LouRig — Lou, LoudFlow's mascot, as a live vector rig.
 *
 * Lou is the sitting, teal-spotted ink dog of `ui/login-redo/mascot/lou.py`.
 * Every coordinate below comes from that file (HEAD, EAR, TAIL, the body
 * lines, the spots, the eye patch, the collar, the props of its six poses);
 * this file only takes him apart and makes him move.
 *
 * HOW IT MOVES — the method Duolingo uses for Duo (Rive), rebuilt in plain JS:
 *   1. RIG. Separate SVG groups with pivots: root (hop, squash/stretch around
 *      the base), body (breathing), head (neck pivot), ear (deformed every
 *      frame: rotation + a floppy bend that grows toward the tip), tail (an
 *      FK chain with a travelling wave), eye (blink/look), brow, mouth
 *      (morph), front leg (paw lift), and the props.
 *   2. SPRINGS, not keyframes. Every pose value is a damped spring chasing a
 *      target, so a new state always starts from wherever the rig is, with
 *      its current velocity. Nothing is ever cut.
 *   3. STATE MACHINE. A state is a table of targets plus an entrance
 *      (anticipation: a dip, a take, a crouch before the hop) and a few
 *      periodic behaviours (paw taps, sighs, proud nods, hops).
 *   4. ADDITIVE LAYERS on top of any pose: breathing, random blinks
 *      (sometimes double), eye glances, micro head drift, ear flicks.
 *   5. SECONDARY MOTION. The ear bend is driven by the head's angular
 *      velocity and the hop's vertical velocity, so it lags and overshoots;
 *      the tail wave carries a phase delay down the chain (follow-through);
 *      the envelope and the "?" sway after the head.
 *   Lou never speaks. His "visemes" are his ear: setListening(level) lifts
 *   it in the rhythm of what is read aloud.
 *
 * THE INK LINE. The static drawings wobble through an feTurbulence
 * displacement filter. On a moving rig that makes the texture swim (the noise
 * field stays put while the parts move through it) and costs a software
 * filter pass on every frame. So the wobble is BAKED into the geometry: every
 * path is resampled and displaced once by the same kind of 2-octave noise
 * field, sampled at the part's rest position (deterministic seed), then
 * refitted as a smooth curve. Parts then move rigidly and crisply. Deforming
 * parts (ear, tail, mouth, brow) carry their wobble in rest space, so it rides
 * along with the deformation instead of crawling. `line: 'boil'` (3 baked
 * variants swapped at 10 fps) and `line: 'filter'` (the original filter on
 * the moving figure) exist only so the choice can be re-checked.
 *
 * CONTRACT (drops into app/src/hub/signin.html):
 *   globalThis.LouRig.mount(hostEl, { state }) -> { setState, setListening, destroy }
 *   CSP-safe: no inline script, no style attribute (el.style.setProperty only),
 *   no network, no eval. prefers-reduced-motion: the target pose, drawn once.
 *   Pauses while document.hidden. destroy() removes every listener, the
 *   ResizeObserver and the rAF; there are no timers (all scheduling runs on
 *   the rig's own clock inside the frame).
 *   globalThis.__louStats = { avgFrameMs, maxFrameMs, frames } — JS time per
 *   rig per frame, rolling over the last 240 frames.
 */
(function () {
  'use strict'

  const NS = 'http://www.w3.org/2000/svg'
  const VB = [330, 262, 570, 474] // x y w h — fixed for every state, so props never re-frame him
  const BASE_SW = 4.6 // the drawing's line, in drawing units
  const MIN_SW_PX = 1.75 // below this the ink stops reading as ink (176 px host)
  const STATES = ['listening', 'waiting', 'letter', 'puzzled', 'offline', 'happy']
  const D2R = Math.PI / 180

  /* ------------------------------------------------------------ geometry --
   * All from mascot/lou.py (world units), a few props compacted so they fit a
   * frame that does not change between states. */
  const G = {
    head: 'M640,420 C640,385 612,368 586,374 C566,379 556,394 549,407 L508,413 C490,415 481,430 487,443 C493,456 511,460 531,458 C551,460 561,470 581,474 C615,478 640,455 640,420 Z',
    nose: 'M500,423 C500,427.4 495.5,431 490,431 C484.5,431 480,427.4 480,423 C480,418.6 484.5,415 490,415 C495.5,415 500,418.6 500,423 Z',
    eyePatch: 'M556,398 C572,388 592,396 592,414 C592,432 570,436 558,428 C548,420 548,406 556,398 Z',
    ear: 'M612,388 C640,378 662,398 664,430 C668,472 656,508 638,516 C622,520 614,500 614,478 C612,450 606,420 612,388 Z',
    happyEye: 'M562,414 Q572,402 582,414',
    chest: 'M592,476 C570,516 566,560 580,602',
    legOut: 'M580,602 L578,700',
    legIn: 'M608,604 L606,700',
    paw: 'M568,706 C568,692 612,692 614,706 Z',
    back: 'M640,448 C690,474 742,530 762,600 C778,650 774,690 752,704 L700,706',
    haunch: 'M744,612 C704,610 682,650 692,690',
    hindPaw: 'M618,706 C622,690 686,690 700,706 Z',
    spot1: 'M690,520 C716,506 744,526 740,556 C736,584 706,588 692,570 C680,556 678,532 690,520 Z',
    spot2: 'M722,640 C744,630 764,650 758,672 C752,690 726,690 718,676 C710,662 712,648 722,640 Z',
    collar: 'M596,478 C610,470 628,462 644,452',
    tail: 'M766,684 C808,676 832,640 826,604 C824,590 832,580 844,580',
    wagLines: 'M852,600 L872,590 M858,626 L880,624 M852,650 L872,660',
    // drawn right-to-left so a dash reveals it from Lou's side outward
    floor: 'M886,712 C740,714 560,711 338,716',
    // props ------------------------------------------------------------
    // waiting: a browser window, compacted from lou.py (286..454 → 338..466)
    brOutline: 'M347,392 L457,392 Q466,392 466,401 L466,471 Q466,480 457,480 L347,480 Q338,480 338,471 L338,401 Q338,392 347,392 Z',
    brBar: 'M338,410 L466,410',
    brBarFill: 'M336,389 L462,388 L464,406 L338,408 Z',
    brWash: 'M352,440 C374,430 424,433 432,448 C437,462 392,469 362,465 C348,462 344,447 352,440 Z',
    // letter: the envelope, in head space — lou.py's, lowered so its top edge
    // is the mouth line: the jaws close on it, the nose stays clear above
    envFill: 'M458,454 L528,446 L534,490 L464,498 Z',
    envLine: 'M454,450 L524,442 L530,486 L460,494 Z',
    envFlap: 'M454,450 L492,474 L524,442',
    // puzzled: the "?" doodle
    qCurve: 'M516,318 C516,292 552,286 560,306 C568,326 540,330 540,352',
    // offline: the cable (starts off-frame right), the plug, two spark arcs
    cable: 'M916,712 C860,724 740,640 660,650 C590,660 560,600 610,570 C660,540 720,600 690,640 C660,690 560,660 520,700 C490,730 430,720 404,706',
    plug: 'M381,692 L397,692 Q402,692 402,697 L402,711 Q402,716 397,716 L381,716 Q376,716 376,711 L376,697 Q376,692 381,692 Z',
    prongs: 'M376,698 L362,698 M376,710 L362,710',
    spark1: 'M376,650 C372,638 384,630 392,638',
    spark2: 'M400,630 C400,618 412,614 416,624',
    // listening: sound arcs arriving from the page side
    arc0: 'M409,438 C416,446 416,458 409,466',
    arc1: 'M421,426 C434,441 434,463 421,478',
    arc2: 'M433,414 C452,436 452,468 433,490'
  }
  const MOUTH = {
    neutral: [503, 450, 514, 457, 527, 458, 536, 455],
    happy: [500, 448, 512, 470, 534, 470, 542, 452],
    sad: [504, 452, 514, 448, 526, 448, 534, 454]
  }
  const BROW = {
    arch: [560, 392, 568, 388, 578, 388, 585, 392],
    sad: [557, 395, 565, 399, 575, 399, 584, 397]
  }
  const SPARKLES = [[450, 350, 18, 0], [514, 302, 12, 0.31], [678, 316, 15, 0.62], [728, 386, 10, 0.83]]
  const STAR = 'M0,-1 Q0.18,-0.18 1,0 Q0.18,0.18 0,1 Q-0.18,0.18 -1,0 Q-0.18,-0.18 0,-1 Z'

  /* -------------------------------------------------------- prng + noise -- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0
      let t = Math.imul(a ^ (a >>> 15), 1 | a)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }
  function valueNoise(seed) {
    const r = mulberry32(seed)
    const perm = new Uint8Array(512)
    const val = new Float32Array(256)
    for (let i = 0; i < 256; i++) { perm[i] = i; val[i] = r() * 2 - 1 }
    for (let i = 255; i > 0; i--) { const j = (r() * (i + 1)) | 0; const t = perm[i]; perm[i] = perm[j]; perm[j] = t }
    for (let i = 0; i < 256; i++) perm[i + 256] = perm[i]
    return function (x, y) {
      const xi = Math.floor(x); const yi = Math.floor(y)
      const fx = x - xi; const fy = y - yi
      const sx = fx * fx * (3 - 2 * fx); const sy = fy * fy * (3 - 2 * fy)
      const X0 = xi & 255; const X1 = (xi + 1) & 255; const Y0 = yi & 255; const Y1 = (yi + 1) & 255
      const a = val[perm[perm[X0] + Y0]]; const b = val[perm[perm[X1] + Y0]]
      const c = val[perm[perm[X0] + Y1]]; const d = val[perm[perm[X1] + Y1]]
      return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
    }
  }
  // A displacement field like feTurbulence fractalNoise + feDisplacementMap:
  // two independent 2-octave noises, one per axis.
  function field(seed, freq, amp) {
    const nx = valueNoise(seed); const ny = valueNoise(seed + 977)
    return function (x, y, out) {
      const u = x * freq; const v = y * freq
      out[0] = (nx(u, v) * 0.68 + nx(u * 2.03 + 31.7, v * 2.03 - 12.3) * 0.32) * amp
      out[1] = (ny(u, v) * 0.68 + ny(u * 2.03 - 7.9, v * 2.03 + 23.1) * 0.32) * amp
    }
  }

  /* ----------------------------------------------------------- path utils -- */
  function parse(d) {
    const tok = d.match(/[MLCQZ]|-?\d*\.?\d+/g)
    const subs = []
    let cur = null; let cmd = null; let i = 0; let px = 0; let py = 0; let sx = 0; let sy = 0
    const num = () => parseFloat(tok[i++])
    while (i < tok.length) {
      const t = tok[i]
      if (t === 'M' || t === 'L' || t === 'C' || t === 'Q' || t === 'Z') { cmd = t; i++ }
      if (cmd === 'M') { px = num(); py = num(); sx = px; sy = py; cur = { x0: px, y0: py, segs: [], closed: false }; subs.push(cur); cmd = 'L' } else if (cmd === 'L') { const x = num(); const y = num(); cur.segs.push([0, px, py, x, y]); px = x; py = y } else if (cmd === 'C') { const a = num(); const b = num(); const c = num(); const e = num(); const x = num(); const y = num(); cur.segs.push([2, px, py, a, b, c, e, x, y]); px = x; py = y } else if (cmd === 'Q') { const a = num(); const b = num(); const x = num(); const y = num(); cur.segs.push([1, px, py, a, b, x, y]); px = x; py = y } else if (cmd === 'Z') {
        if (Math.abs(px - sx) > 0.01 || Math.abs(py - sy) > 0.01) cur.segs.push([0, px, py, sx, sy])
        cur.closed = true; px = sx; py = sy; cmd = null
      } else i++ // stray number after Z — skip
    }
    return subs
  }
  function segAt(s, t, out) {
    const m = 1 - t
    if (s[0] === 0) { out[0] = s[1] + (s[3] - s[1]) * t; out[1] = s[2] + (s[4] - s[2]) * t } else if (s[0] === 1) {
      const a = m * m; const b = 2 * m * t; const c = t * t
      out[0] = a * s[1] + b * s[3] + c * s[5]; out[1] = a * s[2] + b * s[4] + c * s[6]
    } else {
      const a = m * m * m; const b = 3 * m * m * t; const c = 3 * m * t * t; const e = t * t * t
      out[0] = a * s[1] + b * s[3] + c * s[5] + e * s[7]; out[1] = a * s[2] + b * s[4] + c * s[6] + e * s[8]
    }
  }
  const tmpA = [0, 0]; const tmpB = [0, 0]
  function segLen(s) {
    let L = 0; segAt(s, 0, tmpA)
    for (let k = 1; k <= 24; k++) { segAt(s, k / 24, tmpB); L += Math.hypot(tmpB[0] - tmpA[0], tmpB[1] - tmpA[1]); tmpA[0] = tmpB[0]; tmpA[1] = tmpB[1] }
    return L
  }
  function tangentAngle(s, atEnd) {
    const e = 0.02
    if (atEnd) { segAt(s, 1 - e, tmpA); segAt(s, 1, tmpB) } else { segAt(s, 0, tmpA); segAt(s, e, tmpB) }
    return Math.atan2(tmpB[1] - tmpA[1], tmpB[0] - tmpA[0])
  }
  function angDiff(a, b) { let d = Math.abs(a - b) % (2 * Math.PI); if (d > Math.PI) d = 2 * Math.PI - d; return d }

  // Resample one subpath evenly. Returns { pts:Float64Array, n, closed, plan }
  // where plan is the list of smooth runs between sharp corners.
  function sampleSub(sub, spacing) {
    const pts = [sub.x0, sub.y0]; const corner = [false]
    const segs = sub.segs
    for (let k = 0; k < segs.length; k++) {
      const s = segs[k]
      const n = Math.max(1, Math.round(segLen(s) / spacing))
      for (let j = 1; j <= n; j++) { segAt(s, j / n, tmpA); pts.push(tmpA[0], tmpA[1]); corner.push(false) }
      if (k < segs.length - 1 && angDiff(tangentAngle(s, true), tangentAngle(segs[k + 1], false)) > 0.6) corner[corner.length - 1] = true
    }
    let n = corner.length
    if (sub.closed) {
      if (angDiff(tangentAngle(segs[segs.length - 1], true), tangentAngle(segs[0], false)) > 0.6) corner[0] = true
      pts.length -= 2; corner.pop(); n-- // the closing point repeats the first
    }
    return { pts: Float64Array.from(pts), n, closed: sub.closed, plan: makePlan(corner, n, sub.closed) }
  }
  function makePlan(corner, n, closed) {
    const cs = []
    for (let i = 0; i < n; i++) if (corner[i]) cs.push(i)
    if (closed && cs.length === 0) return { loop: true, runs: [] }
    const runs = []
    if (!closed) {
      let a = 0
      for (const c of cs) { if (c > a && c < n - 1) { runs.push(range(a, c, n)); a = c } }
      runs.push(range(a, n - 1, n))
    } else {
      for (let k = 0; k < cs.length; k++) {
        const a = cs[k]; const b = cs[(k + 1) % cs.length]
        runs.push(range(a, b === a ? a + n : (b > a ? b : b + n), n))
      }
    }
    return { loop: false, runs }
  }
  function range(a, b, n) { const r = new Int16Array(b - a + 1); for (let i = a; i <= b; i++) r[i - a] = i % n; return r }

  function f1(v) { return Math.round(v * 10) / 10 }
  // Catmull-Rom through the points, emitted as cubic Béziers.
  function smoothD(P, n, plan, closed) {
    let d = ''
    if (plan.loop) {
      d = 'M' + f1(P[0]) + ',' + f1(P[1])
      for (let i = 0; i < n; i++) {
        const i0 = (i - 1 + n) % n; const i2 = (i + 1) % n; const i3 = (i + 2) % n
        d += cubic(P, i0, i, i2, i3)
      }
      return d + 'Z'
    }
    const runs = plan.runs
    for (let r = 0; r < runs.length; r++) {
      const R = runs[r]; const m = R.length
      if (r === 0) d = 'M' + f1(P[R[0] * 2]) + ',' + f1(P[R[0] * 2 + 1])
      for (let i = 0; i < m - 1; i++) {
        d += cubic(P, R[i > 0 ? i - 1 : 0], R[i], R[i + 1], R[i + 2 < m ? i + 2 : m - 1])
      }
    }
    return closed ? d + 'Z' : d
  }
  function cubic(P, a, b, c, e) {
    const bx = P[b * 2]; const by = P[b * 2 + 1]; const cx = P[c * 2]; const cy = P[c * 2 + 1]
    const c1x = bx + (cx - P[a * 2]) / 6; const c1y = by + (cy - P[a * 2 + 1]) / 6
    const c2x = cx - (P[e * 2] - bx) / 6; const c2y = cy - (P[e * 2 + 1] - by) / 6
    return 'C' + f1(c1x) + ',' + f1(c1y) + ' ' + f1(c2x) + ',' + f1(c2y) + ' ' + f1(cx) + ',' + f1(cy)
  }

  // An "ink": a path resampled once, with its baked wobble. Static inks keep
  // their d strings; dynamic ones keep rest points to deform every frame.
  function makeInk(d, fieldFn, spacing, offX, offY) {
    const subs = parse(d).map(s => sampleSub(s, spacing || 6))
    const out = [0, 0]
    for (const s of subs) {
      s.rest = new Float64Array(s.pts.length)
      for (let i = 0; i < s.n; i++) {
        const x = s.pts[i * 2] + (offX || 0); const y = s.pts[i * 2 + 1] + (offY || 0)
        if (fieldFn) fieldFn(s.pts[i * 2], s.pts[i * 2 + 1], out); else { out[0] = 0; out[1] = 0 }
        s.rest[i * 2] = x + out[0]; s.rest[i * 2 + 1] = y + out[1]
      }
      s.work = new Float64Array(s.pts.length)
    }
    return subs
  }
  function inkD(subs, useWork) {
    let d = ''
    for (const s of subs) d += smoothD(useWork ? s.work : s.rest, s.n, s.plan, s.closed)
    return d
  }

  /* ------------------------------------------------ baked geometry (cache) --
   * Deterministic, so it is built once per page and shared by every mount. */
  const LINE_FREQ = 0.03; const LINE_AMP = 2.4 // lou.py: feTurbulence 0.03, scale 4.5
  const SPOT_FREQ = 0.045; const SPOT_AMP = 4.4 // lou.py: 0.045, scale 8
  const STATIC_LINES = ['head', 'chest', 'legOut', 'legIn', 'paw', 'back', 'haunch', 'hindPaw', 'happyEye', 'wagLines', 'floor',
    'brOutline', 'brBar', 'envLine', 'envFlap', 'qCurve', 'cable', 'plug', 'prongs', 'spark1', 'spark2', 'arc0', 'arc1', 'arc2']
  const STATIC_SPOTS = ['eyePatch', 'spot1', 'spot2', 'collar', 'brBarFill', 'brWash', 'envFill']
  const CACHE = {}
  function geometry(variant) {
    if (CACHE[variant]) return CACHE[variant]
    const seed = 7 + variant * 131
    const lf = field(seed, LINE_FREQ, LINE_AMP)
    const sf = field(seed + 3, SPOT_FREQ, SPOT_AMP)
    const nf = field(seed + 5, 0.08, 0.9)
    const g = { d: {} }
    for (const k of STATIC_LINES) g.d[k] = inkD(makeInk(G[k], lf, k === 'wagLines' || k.startsWith('arc') || k.startsWith('spark') ? 5 : 9))
    for (const k of STATIC_SPOTS) g.d[k] = inkD(makeInk(G[k], sf, 9))
    g.d.nose = inkD(makeInk(G.nose, nf, 3))
    g.ear = makeInk(G.ear, lf, 7)
    g.earFill = makeInk(G.ear, sf, 7, 7, -4)
    // tail: rest samples (un-jittered, for the FK chain) + a per-point normal wobble
    const ts = parse(G.tail).map(s => sampleSub(s, 9))[0]
    const tj = new Float64Array(ts.n); const o = [0, 0]
    for (let i = 0; i < ts.n; i++) { lf(ts.pts[i * 2], ts.pts[i * 2 + 1], o); tj[i] = (o[0] + o[1]) * 0.7 }
    g.tail = { pts: ts.pts, n: ts.n, jit: tj }
    // morph strokes: per-sample wobble, fixed along the stroke
    g.mouthJit = morphJitter(MOUTH.neutral, lf)
    g.browJit = morphJitter(BROW.arch, lf)
    CACHE[variant] = g
    return g
  }
  const MORPH_N = 8
  function morphJitter(c, lf) {
    const j = new Float64Array(MORPH_N * 2); const s = [0, c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7]]; const o = [0, 0]
    for (let i = 0; i < MORPH_N; i++) { segAt(s, i / (MORPH_N - 1), tmpA); lf(tmpA[0], tmpA[1], o); j[i * 2] = o[0] * 0.5; j[i * 2 + 1] = o[1] * 0.5 }
    return j
  }
  const OPEN_PLAN = { loop: false, runs: [range(0, MORPH_N - 1, MORPH_N)] }

  /* ------------------------------------------------------------- channels --
   * [name, stiffness k, damping ratio ζ]. ζ < 1 overshoots (floppy things),
   * ζ ≈ 0.6–0.9 is the "Duo" settle: fast, one soft overshoot, done. */
  const SPEC = [
    ['ROOT_X', 200, 0.8], ['ROOT_Y', 220, 0.7], ['ROOT_ROT', 150, 0.2], ['SQ', 360, 0.4],
    ['HEAD_ROT', 95, 0.6], ['HEAD_X', 120, 0.7], ['HEAD_Y', 130, 0.58],
    ['TILT', 85, 0.55], ['NOD', 170, 0.5], ['LEAN', 60, 0.62],
    ['EAR', 150, 0.46], ['EAR_BEND', 115, 0.28],
    ['TAIL_BASE', 55, 0.7], ['TAIL_CURL', 45, 0.85], ['TAIL_BEND', 140, 0.32], ['WAG_AMP', 22, 1], ['WAG_FREQ', 14, 1],
    ['BREATH_AMP', 16, 1], ['BREATH_RATE', 8, 1], ['DRIFT', 10, 1],
    ['EYE_OPEN', 240, 0.9], ['EYE_HAPPY', 170, 0.7], ['LOOK_X', 650, 0.85], ['LOOK_Y', 650, 0.85],
    ['GLANCE_X', 900, 0.9], ['GLANCE_Y', 900, 0.9],
    ['BROW_Y', 240, 0.5], ['BROW_ROT', 180, 0.55], ['BROW_SAD', 110, 0.85],
    ['M_HAPPY', 150, 0.62], ['M_SAD', 110, 0.85], ['M_SHOW', 200, 1],
    ['PAW', 520, 0.6], ['SNIFF', 900, 0.5],
    ['P_BROWSER', 160, 0.5], ['P_ENV', 190, 0.45], ['P_Q', 150, 0.45], ['P_CABLE', 20, 1], ['P_SPARK', 80, 0.8], ['P_WAGL', 70, 1], ['P_ARCS', 60, 1],
    ['ENV_SWAY', 80, 0.22], ['Q_SWAY', 60, 0.3],
    ['FLOOR_L', 30, 1],
    ['LEVEL', 650, 0.55], ['ATTN', 16, 1], ['ARC0', 380, 0.9], ['ARC1', 190, 0.9], ['ARC2', 100, 0.9]
  ]
  const C = {}
  SPEC.forEach((s, i) => { C[s[0]] = i })
  const NCH = SPEC.length

  const BASE = {
    ROOT_X: 0, ROOT_Y: 0, ROOT_ROT: 0, SQ: 1,
    HEAD_ROT: -9, HEAD_X: 0, HEAD_Y: 0, TILT: 0, NOD: 0, LEAN: -0.4,
    EAR: -22, EAR_BEND: 0,
    TAIL_BASE: 0, TAIL_CURL: 1, TAIL_BEND: 0, WAG_AMP: 2.5, WAG_FREQ: 0.45,
    BREATH_AMP: 1, BREATH_RATE: 1 / 3.5, DRIFT: 1,
    EYE_OPEN: 1, EYE_HAPPY: 0, LOOK_X: -1.3, LOOK_Y: 0.3, GLANCE_X: 0, GLANCE_Y: 0,
    BROW_Y: -1, BROW_ROT: 0, BROW_SAD: 0,
    M_HAPPY: 0, M_SAD: 0, M_SHOW: 1, PAW: 0, SNIFF: 0,
    P_BROWSER: 0, P_ENV: 0, P_Q: 0, P_CABLE: 0, P_SPARK: 0, P_WAGL: 0, P_ARCS: 1,
    ENV_SWAY: 0, Q_SWAY: 0, FLOOR_L: 470,
    LEVEL: 0, ATTN: 0, ARC0: 0, ARC1: 0, ARC2: 0
  }
  const POSES = {
    listening: {},
    waiting: { LEAN: -0.5, HEAD_ROT: -5, EAR: -28, WAG_AMP: 5, WAG_FREQ: 0.8, LOOK_X: -2.3, LOOK_Y: 0.9, BROW_Y: -2.5, P_BROWSER: 1, P_ARCS: 0, FLOOR_L: 340 },
    letter: { LEAN: 0.9, HEAD_ROT: -3, HEAD_Y: -3, EAR: -18, WAG_AMP: 9, WAG_FREQ: 1.7, LOOK_X: -0.6, LOOK_Y: -0.4, BROW_Y: -2, M_SHOW: 0, P_ENV: 1, P_ARCS: 0 },
    puzzled: { LEAN: 1, HEAD_ROT: -17, EAR: -12, WAG_AMP: 0, LOOK_X: -0.4, LOOK_Y: -1.9, BROW_Y: -4.5, BROW_ROT: -14, M_SAD: 0.3, P_Q: 1, P_ARCS: 0, DRIFT: 0.6 },
    offline: { LEAN: -1.6, HEAD_ROT: -15, HEAD_X: 3, HEAD_Y: 9, EAR: 3, EAR_BEND: 6, TAIL_BASE: 22, TAIL_CURL: 0.62, WAG_AMP: 0, EYE_OPEN: 0.6, LOOK_X: -0.8, LOOK_Y: 1.8, BROW_Y: 2.5, BROW_SAD: 1, M_SAD: 1, P_CABLE: 1, P_ARCS: 0, FLOOR_L: 350, BREATH_AMP: 1.3, BREATH_RATE: 1 / 4.4, DRIFT: 0.45 },
    happy: { LEAN: 1.2, HEAD_ROT: -4, HEAD_Y: -4, EAR: -34, TAIL_BASE: -8, WAG_AMP: 15, WAG_FREQ: 4.2, EYE_HAPPY: 1, BROW_Y: -3, M_HAPPY: 1, P_SPARK: 1, P_WAGL: 1, P_ARCS: 0, BREATH_AMP: 1.2, BREATH_RATE: 1 / 1.9, DRIFT: 1.3 }
  }
  // How much the ear answers setListening() in each state
  const LISTEN_GAIN = { listening: 1, waiting: 0.6, letter: 0.35, puzzled: 0.45, offline: 0.15, happy: 0.3 }

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v }
  function r4(v) { return Math.round(v * 10000) / 10000 }
  function r2(v) { return Math.round(v * 100) / 100 }

  let mountCount = 0

  /* ================================================================ mount == */
  function mount(host, opts) {
    opts = opts || {}
    const id = 'lou' + (++mountCount)
    const lineMode = opts.line === 'boil' || opts.line === 'filter' ? opts.line : 'baked'
    const manual = opts.clock === 'manual'
    const rnd = mulberry32(opts.seed != null ? opts.seed : 20260928)
    const geo = [geometry(0)]
    if (lineMode === 'boil') { geo.push(geometry(1), geometry(2)) }
    let gv = 0 // current geometry variant

    // ----------------------------------------------------------- DOM build
    const root = document.createElement('div')
    root.className = 'lou-rig'
    const svg = el('svg', { viewBox: VB.join(' '), class: 'lou-rig__svg', 'aria-hidden': 'true', focusable: 'false' }, root)
    const statics = [] // [element, key] for boil variant swaps
    function el(tag, attrs, parent) {
      const e = document.createElementNS(NS, tag)
      for (const k in attrs) e.setAttribute(k, attrs[k])
      if (parent) parent.appendChild(e)
      return e
    }
    function ink(parent, key, cls, extra) {
      const a = Object.assign({ d: geo[0].d[key], class: cls }, extra || {})
      const e = el('path', a, parent)
      statics.push([e, key])
      return e
    }
    const cache = new Map()
    function set(e, name, val) {
      let c = cache.get(e)
      if (!c) { c = {}; cache.set(e, c) }
      if (c[name] !== val) { c[name] = val; e.setAttribute(name, val) }
    }
    function show(e, on) { set(e, 'display', on ? 'inline' : 'none') }

    let filterAttr = null
    if (lineMode === 'filter') {
      const defs = el('defs', {}, svg)
      const f = el('filter', { id: id + '-w', x: '-5%', y: '-5%', width: '110%', height: '110%' }, defs)
      el('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.03', numOctaves: '2', seed: '7' }, f)
      el('feDisplacementMap', { in: 'SourceGraphic', scale: '4.5' }, f)
      filterAttr = 'url(#' + id + '-w)'
    }
    const world = el('g', filterAttr ? { filter: filterAttr } : {}, svg)

    // floor + back props (world space)
    const floor = ink(world, 'floor', 'lou-i lou-i--floor', { pathLength: '1' })
    const gArcs = el('g', {}, world)
    const arcs = [ink(gArcs, 'arc0', 'lou-i lou-i--thin'), ink(gArcs, 'arc1', 'lou-i lou-i--thin'), ink(gArcs, 'arc2', 'lou-i lou-i--thin')]
    const gBrowser = el('g', {}, world)
    ink(gBrowser, 'brBarFill', 'lou-t')
    ink(gBrowser, 'brWash', 'lou-tl')
    ink(gBrowser, 'brOutline', 'lou-i')
    ink(gBrowser, 'brBar', 'lou-i lou-i--thin')
    for (const cx of [349, 358, 367]) el('circle', { cx, cy: 401.5, r: 2.6, class: 'lou-k' }, gBrowser)
    const loadDots = [382, 402, 422].map(cx => el('circle', { cx, cy: 448, r: 5.4, class: 'lou-k' }, gBrowser))

    // Lou ------------------------------------------------------------------
    const gRoot = el('g', {}, world)
    const gBody = el('g', {}, gRoot)
    ink(gBody, 'spot1', 'lou-t'); ink(gBody, 'spot2', 'lou-t')
    ink(gBody, 'collar', 'lou-collar')
    const gTail = el('g', {}, gBody)
    const tailPath = el('path', { class: 'lou-i' }, gTail)
    const gWag = el('g', {}, gTail)
    ink(gWag, 'wagLines', 'lou-i lou-i--thin')
    ink(gBody, 'back', 'lou-i'); ink(gBody, 'haunch', 'lou-i'); ink(gBody, 'hindPaw', 'lou-i'); ink(gBody, 'chest', 'lou-i')
    const gLeg = el('g', {}, gBody)
    ink(gLeg, 'legOut', 'lou-i'); ink(gLeg, 'legIn', 'lou-i'); ink(gLeg, 'paw', 'lou-i')

    const gHead = el('g', {}, gRoot)
    ink(gHead, 'eyePatch', 'lou-t')
    const earFill = el('path', { class: 'lou-t' }, gHead)
    ink(gHead, 'head', 'lou-i')
    const gNose = el('g', {}, gHead)
    ink(gNose, 'nose', 'lou-k')
    const gEye = el('g', {}, gHead)
    el('ellipse', { cx: 573, cy: 410, rx: 5.2, ry: 5.2, class: 'lou-k' }, gEye)
    const happyEye = ink(gHead, 'happyEye', 'lou-i lou-i--eye')
    const gBrow = el('g', {}, gHead)
    const browPath = el('path', { class: 'lou-i' }, gBrow)
    const mouthPath = el('path', { class: 'lou-i' }, gHead)
    const earLine = el('path', { class: 'lou-i' }, gHead)
    const gEnv = el('g', {}, gHead)
    ink(gEnv, 'envFill', 'lou-tl')
    ink(gEnv, 'envLine', 'lou-i')
    ink(gEnv, 'envFlap', 'lou-i lou-i--thin')

    // front props (world space)
    const gCable = el('g', {}, world)
    const cable = ink(gCable, 'cable', 'lou-i lou-i--cable', { pathLength: '1' })
    const gPlug = el('g', {}, gCable)
    ink(gPlug, 'plug', 'lou-i lou-i--cable')
    ink(gPlug, 'prongs', 'lou-i lou-i--cable')
    const gSparks = el('g', {}, gCable)
    ink(gSparks, 'spark1', 'lou-i lou-i--thin'); ink(gSparks, 'spark2', 'lou-i lou-i--thin')
    const gQ = el('g', {}, world)
    const qCurve = ink(gQ, 'qCurve', 'lou-i lou-i--bold', { pathLength: '1' })
    const qDot = el('circle', { cx: 540, cy: 374, r: 4.6, class: 'lou-k' }, gQ)
    const gSpark = el('g', {}, world)
    const sparkEls = SPARKLES.map(() => el('path', { d: STAR, class: 'lou-k' }, gSpark))

    host.appendChild(root)

    // ------------------------------------------------------------ state
    const X = new Float64Array(NCH); const V = new Float64Array(NCH); const TG = new Float64Array(NCH)
    const K = new Float64Array(NCH); const ZC = new Float64Array(NCH)
    SPEC.forEach((s, i) => { K[i] = s[1]; ZC[i] = 2 * s[2] * Math.sqrt(s[1]) })

    let state = STATES.indexOf(opts.state) >= 0 ? opts.state : 'listening'
    let t = 0 // rig clock, seconds
    let wagPhase = 0; let breathPhase = 0
    let hopY = 0; let hopV = 0; let air = false
    let blinkAt = -1; let blinkDouble = false; let nextBlink = 1.2 + rnd() * 2
    let nextFlick = 3 + rnd() * 4; let nextGlance = 1.5 + rnd() * 2; let nextBeat = 1.5
    let quietFor = 0; let beatN = 0
    let listenTarget = 0; let lastVoice = -9
    let events = [] // {at, fn}
    const reducedMQ = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null
    let reduced = !!opts.reducedMotion || !!(reducedMQ && reducedMQ.matches)
    let raf = 0; let last = 0; let destroyed = false; let lastBoil = 0

    // Props leave faster than they arrive: an entrance is shown, an exit is cleared.
    const EXIT_K = { P_BROWSER: 260, P_ENV: 300, P_Q: 260, P_CABLE: 90, P_SPARK: 140, P_WAGL: 140 }
    function applyPose(name) {
      const p = POSES[name]
      for (const k in BASE) TG[C[k]] = (k in p) ? p[k] : BASE[k]
      TG[C.LEVEL] = listenTarget
      for (const k in EXIT_K) {
        const i = C[k]; const out = TG[i] === 0
        K[i] = out ? EXIT_K[k] : SPEC[i][1]
        ZC[i] = 2 * (out ? 1 : SPEC[i][2]) * Math.sqrt(K[i])
      }
    }
    function snap() { for (let i = 0; i < NCH; i++) { X[i] = TG[i]; V[i] = 0 } hopY = 0; hopV = 0; air = false }
    function at(dt, fn) { events.push({ at: t + dt, fn }) }
    function tg(name, v) { TG[C[name]] = v }
    function kick(name, v) { V[C[name]] += v }
    function blink(double) { blinkAt = t; blinkDouble = !!double }
    function jump(h) { air = true; hopV = -Math.sqrt(2 * 3200 * h) }
    function hop(h, crouch) {
      tg('SQ', 1 - crouch); tg('NOD', 3)
      at(0.12, () => { tg('SQ', 1); tg('NOD', 0); jump(h); tg('PAW', 0.55) })
    }

    function enter(name, first) {
      const prevRot = TG[C.HEAD_ROT]
      state = name
      events = []
      applyPose(name)
      beatN = 0
      nextBeat = t + 1.6 + rnd() * 0.8
      if (first) return
      // every change: a blink to cover it, a small dip, and anticipation —
      // the head first moves AGAINST the direction it is about to go.
      blink(false)
      kick('SQ', -0.9)
      const dRot = TG[C.HEAD_ROT] - prevRot
      if (Math.abs(dRot) > 2) kick('HEAD_ROT', -Math.sign(dRot) * Math.min(Math.abs(dRot), 16) * 4.5)
      tg('TILT', 0); tg('NOD', 0); tg('GLANCE_X', 0); tg('GLANCE_Y', 0)
      if (name === 'waiting') {
        kick('EAR', -220); kick('EAR_BEND', 120)
        tg('P_BROWSER', 0); at(0.05, () => tg('P_BROWSER', 1))
      } else if (name === 'letter') {
        tg('P_ENV', 0); tg('NOD', 5); tg('TILT', -10)
        at(0.18, () => { tg('P_ENV', 1); tg('NOD', 0); tg('TILT', 0); kick('EAR', -120) })
      } else if (name === 'puzzled') {
        tg('P_Q', 0); tg('TILT', 5)
        at(0.14, () => { tg('TILT', 0) })
        at(0.22, () => { tg('P_Q', 1); kick('BROW_Y', -40) })
      } else if (name === 'offline') {
        tg('SQ', 0.95)
        at(0.55, () => tg('SQ', 1))
        at(0.75, () => { kick('ROOT_ROT', 34); kick('EAR_BEND', -90) })
        at(1.25, () => { kick('ROOT_ROT', -22) })
      } else if (name === 'happy') {
        tg('P_SPARK', 0)
        hop(40, 0.14)
        at(0.12, () => tg('P_SPARK', 1))
      } else if (name === 'listening') {
        kick('EAR', -160)
      }
    }

    // Periodic behaviours: one "beat" every few seconds, per state.
    function beat() {
      beatN++
      const s = state
      if (s === 'waiting') {
        if (beatN % 2) { tg('TILT', -9); tg('GLANCE_Y', -0.6); at(0.8, () => { tg('TILT', 0); tg('GLANCE_Y', 0) }) } else {
          tg('PAW', 1); at(0.13, () => tg('PAW', 0)); at(0.27, () => tg('PAW', 1)); at(0.4, () => tg('PAW', 0))
        }
        nextBeat = t + 2.6 + rnd() * 1.4
      } else if (s === 'letter') {
        tg('NOD', -5); at(0.22, () => tg('NOD', 0)); kick('WAG_AMP', 30)
        nextBeat = t + 2.4 + rnd() * 1.2
      } else if (s === 'puzzled') {
        kick('EAR', beatN % 2 ? -170 : 120); kick('BROW_Y', -35)
        nextBeat = t + 3 + rnd() * 1.2
      } else if (s === 'offline') {
        if (beatN % 2) { // a sigh: in, then out and a little lower
          tg('SQ', 1.03); tg('NOD', -2)
          at(0.8, () => { tg('SQ', 0.975); tg('NOD', 4) })
          at(1.7, () => { tg('SQ', 1); tg('NOD', 0) })
        } else { kick('ROOT_ROT', 26); at(0.45, () => kick('ROOT_ROT', -18)) } // tug at the cable
        nextBeat = t + 3.4 + rnd() * 1.6
      } else if (s === 'happy') {
        if (!air) hop(beatN % 3 === 2 ? 22 : 13, 0.08)
        nextBeat = t + 1.7 + rnd() * 0.8
      } else if (s === 'listening') {
        if (quietFor > 1.5) { tg('TILT', rnd() < 0.5 ? -5 : 3); at(1.1 + rnd() * 0.6, () => tg('TILT', 0)) } else { tg('SNIFF', 1); at(0.09, () => tg('SNIFF', 0)); at(0.2, () => tg('SNIFF', 1)); at(0.29, () => tg('SNIFF', 0)) }
        nextBeat = t + 3 + rnd() * 2.5
      }
    }

    function stepSprings(dt) {
      const n = Math.max(1, Math.ceil(dt * 120)); const h = dt / n
      for (let s = 0; s < n; s++) {
        for (let i = 0; i < NCH; i++) {
          const a = -K[i] * (X[i] - TG[i]) - ZC[i] * V[i]
          V[i] += a * h; X[i] += V[i] * h
        }
      }
    }

    function blinkCurve(u) { // 0 open .. 1 shut
      if (u < 0) return 0
      if (u < 0.06) { const k = u / 0.06; return k * k }
      if (u < 0.1) return 1
      if (u < 0.21) { const k = 1 - (u - 0.1) / 0.11; return k * k * (3 - 2 * k) }
      return 0
    }

    function update(dt) {
      t += dt
      // scheduled events (entrances, beats)
      if (events.length) {
        const due = []
        events = events.filter(e => { if (e.at <= t) { due.push(e); return false } return true })
        due.sort((a, b) => a.at - b.at).forEach(e => e.fn())
      }
      if (t >= nextBeat) beat()
      // listening level
      TG[C.LEVEL] = listenTarget
      TG[C.ARC0] = listenTarget; TG[C.ARC1] = listenTarget; TG[C.ARC2] = listenTarget
      quietFor = listenTarget < 0.08 ? quietFor + dt : 0
      if (listenTarget > 0.06) lastVoice = t
      TG[C.ATTN] = t - lastVoice < 0.75 ? 1 : 0 // attention: held through the gaps between syllables
      // blinks
      if (t >= nextBlink && blinkAt < 0) { blink(rnd() < 0.18); nextBlink = t + 2 + rnd() * 4 }
      if (blinkAt >= 0 && t - blinkAt > 0.21) {
        if (blinkDouble) { blinkAt = t + 0.04; blinkDouble = false } else blinkAt = -1
      }
      // ear flicks — the additive layer that makes him look awake
      if (t >= nextFlick) {
        const g = state === 'offline' ? 0.3 : 1
        kick('EAR', -250 * g); kick('EAR_BEND', 170 * g)
        nextFlick = t + 3.5 + rnd() * 5.5
      }
      // glances (eyes lead; only while nothing is being said)
      if (t >= nextGlance) {
        if (state !== 'happy' && listenTarget < 0.1) {
          const gx = (rnd() - 0.5) * 2.6; const gy = (rnd() - 0.5) * 1.6
          tg('GLANCE_X', gx); tg('GLANCE_Y', gy)
          at(0.5 + rnd() * 0.9, () => { tg('GLANCE_X', 0); tg('GLANCE_Y', 0) })
        }
        nextGlance = t + 1.8 + rnd() * 2.7
      }
      if (state === 'puzzled') { tg('TILT', -3.2 * Math.sin(t * 2 * Math.PI / 2.6)); tg('Q_SWAY', 6 * Math.sin(t * 2 * Math.PI / 2.6 + 1.1)) }
      // secondary motion inputs (read last frame's velocities)
      const headVel = V[C.HEAD_ROT] + V[C.TILT]
      const bend = -0.075 * headVel - 0.035 * V[C.EAR] - 0.032 * hopV - 0.03 * V[C.NOD] - 9 * V[C.LEVEL] * 0.01
      TG[C.EAR_BEND] = (POSES[state].EAR_BEND || 0) + Math.max(-30, Math.min(30, bend))
      TG[C.ENV_SWAY] = Math.max(-16, Math.min(16, -0.07 * headVel - 0.025 * hopV))
      TG[C.TAIL_BEND] = Math.max(-25, Math.min(25, 0.03 * hopV + 0.25 * V[C.ROOT_ROT]))
      stepSprings(dt)
      // the hop is ballistic, not a spring: it must fall like a body falls
      if (air) {
        hopV += 3200 * dt; hopY += hopV * dt
        if (hopY >= 0) {
          hopY = 0; air = false
          kick('SQ', -Math.min(2.6, hopV * 0.0044)); tg('PAW', 0)
          hopV = 0
        }
      }
      wagPhase += 2 * Math.PI * X[C.WAG_FREQ] * dt
      breathPhase += 2 * Math.PI * X[C.BREATH_RATE] * dt
      if (wagPhase > 1e4) wagPhase -= 2 * Math.PI * 1000
      if (breathPhase > 1e4) breathPhase -= 2 * Math.PI * 1000
    }

    // --------------------------------------------------------------- render
    function trs(e, tx, ty, cx, cy, deg, sx, sy) {
      const r = deg * D2R; const c = Math.cos(r); const s = Math.sin(r)
      const a = c * sx; const b = s * sx; const cc = -s * sy; const d = c * sy
      const ex = tx + cx - (a * cx + cc * cy); const fy = ty + cy - (b * cx + d * cy)
      set(e, 'transform', 'matrix(' + r4(a) + ' ' + r4(b) + ' ' + r4(cc) + ' ' + r4(d) + ' ' + r2(ex) + ' ' + r2(fy) + ')')
    }

    let earKey = ''
    function drawEar(angDeg, bendDeg) {
      const key = r2(angDeg) + '|' + r2(bendDeg) + '|' + gv
      if (key === earKey) return
      earKey = key
      const g = geo[gv]
      deformEar(g.ear, angDeg, bendDeg); deformEar(g.earFill, angDeg, bendDeg)
      set(earLine, 'd', inkD(g.ear, true))
      set(earFill, 'd', inkD(g.earFill, true))
    }
    function deformEar(subs, angDeg, bendDeg) {
      for (const s of subs) {
        const P = s.rest; const W = s.work
        for (let i = 0; i < s.n; i++) {
          const dx = P[i * 2] - 614; const dy = P[i * 2 + 1] - 392
          const w = Math.min(1, Math.hypot(dx, dy) / 130)
          const a = (angDeg + bendDeg * Math.pow(w, 1.4)) * D2R
          const c = Math.cos(a); const sn = Math.sin(a)
          W[i * 2] = 614 + dx * c - dy * sn; W[i * 2 + 1] = 392 + dx * sn + dy * c
        }
      }
    }

    const tailW = new Float64Array(64)
    let tailA = null; let tailL = null
    function drawTail(staticMode) {
      const T = geo[gv].tail; const n = T.n
      if (!tailA) {
        tailA = new Float64Array(n - 1); tailL = new Float64Array(n - 1)
        for (let i = 0; i < n - 1; i++) {
          const dx = T.pts[i * 2 + 2] - T.pts[i * 2]; const dy = T.pts[i * 2 + 3] - T.pts[i * 2 + 1]
          tailA[i] = Math.atan2(dy, dx); tailL[i] = Math.hypot(dx, dy)
        }
      }
      const amp = X[C.WAG_AMP] * D2R; const ph = staticMode ? 1.2 : wagPhase
      const base = X[C.TAIL_BASE] * D2R; const curl = X[C.TAIL_CURL]; const bend = X[C.TAIL_BEND] * D2R / (n - 1)
      let x = T.pts[0]; let y = T.pts[1]; let acc = 0
      tailW[0] = x; tailW[1] = y
      const A0 = tailA[0]
      for (let i = 0; i < n - 1; i++) {
        acc += (i === 0 ? amp * Math.sin(ph) : amp * 0.11 * Math.sin(ph - i * 0.36)) + bend
        const th = A0 + base + (tailA[i] - A0) * curl + acc
        x += tailL[i] * Math.cos(th); y += tailL[i] * Math.sin(th)
        const j = T.jit[i + 1]
        tailW[i * 2 + 2] = x - Math.sin(th) * j; tailW[i * 2 + 3] = y + Math.cos(th) * j
      }
      set(tailPath, 'd', smoothD(tailW, n, tailPlan(n), false))
      return [x, y]
    }
    let _tailPlan = null
    function tailPlan(n) { return _tailPlan || (_tailPlan = { loop: false, runs: [range(0, n - 1, n)] }) }

    const mw = new Float64Array(MORPH_N * 2)
    let mouthKey = ''; let browKey = ''
    function drawMorph(pathEl, shapes, weights, jit, keyRef) {
      // shapes[0] is the base; weights for shapes[1..]
      const c = shapes[0].slice()
      for (let k = 1; k < shapes.length; k++) { const w = weights[k - 1]; for (let q = 0; q < 8; q++) c[q] += (shapes[k][q] - shapes[0][q]) * w }
      const key = c.map(r2).join(',') + gv
      if (key === keyRef) return keyRef
      const s = [2, c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7]]
      for (let i = 0; i < MORPH_N; i++) { segAt(s, i / (MORPH_N - 1), tmpA); mw[i * 2] = tmpA[0] + jit[i * 2]; mw[i * 2 + 1] = tmpA[1] + jit[i * 2 + 1] }
      set(pathEl, 'd', smoothD(mw, MORPH_N, OPEN_PLAN, false))
      return key
    }

    function render(staticMode) {
      const g = geo[gv]
      const lg = LISTEN_GAIN[state]
      const lvl = X[C.LEVEL] * lg // syllable rhythm (fast)
      const att = X[C.ATTN] * lg // attention (slow): someone is speaking
      const tt = staticMode ? 0.6 : t
      // breathing: slow in, slower out
      const bp = breathPhase
      const b = staticMode ? 0.3 : (0.5 - 0.5 * Math.cos(bp + 0.35 * Math.sin(bp))) * X[C.BREATH_AMP]
      // root: hop + squash/stretch (volume-preserving) around the base
      const sqAir = 1 + 0.075 * Math.min(1, Math.abs(hopV) / 520)
      const sy = X[C.SQ] * sqAir; const sx = 1 / Math.sqrt(Math.max(0.5, sy))
      trs(gRoot, X[C.ROOT_X], X[C.ROOT_Y] + hopY, 660, 716, X[C.ROOT_ROT], sx, sy)
      // body: breathing + a lean that follows the head a little (overlap); the
      // head rides on the neck point wherever the body takes it
      const dA0 = staticMode ? 0 : X[C.DRIFT]
      const lean = X[C.LEAN] + 0.12 * (X[C.TILT] + X[C.NOD] * 0.3) - 1.1 * att + (staticMode ? 0 : 0.25 * Math.sin(tt * 0.71 + 0.8) * dA0)
      const bsx = 1 - 0.004 * b; const bsy = 1 + 0.013 * b
      trs(gBody, 0, 0, 648, 714, lean, bsx, bsy)
      const lr = lean * D2R; const lc = Math.cos(lr); const ls = Math.sin(lr)
      const neckDX = lc * bsx * -48 - ls * bsy * -262 + 648 - 600
      const neckDY = ls * bsx * -48 + lc * bsy * -262 + 714 - 452
      // head: pose + behaviours + drift + breath + lean toward the voice
      const dA = staticMode ? 0 : X[C.DRIFT]
      const dr = (0.8 * Math.sin(tt * 1.07) + 0.45 * Math.sin(tt * 2.31 + 1.3)) * dA
      const dx = 0.6 * Math.sin(tt * 0.61 + 2) * dA; const dy = 0.9 * Math.sin(tt * 0.83 + 0.5) * dA
      trs(gHead, X[C.HEAD_X] + dx - 2.4 * att + neckDX, X[C.HEAD_Y] + X[C.NOD] + dy + neckDY - 0.8 * lvl, 600, 440,
        X[C.HEAD_ROT] + X[C.TILT] + dr - 2.6 * att + 0.5 * lean, 1, 1)
      // ear: the listening organ
      drawEar(X[C.EAR] - 12 * att - 9 * lvl, X[C.EAR_BEND])
      // nose sniff
      const sn = X[C.SNIFF]
      trs(gNose, -1.2 * sn, -0.6 * sn, 490, 423, 0, 1 + 0.1 * sn, 1 - 0.06 * sn)
      // eye: blink × state openness × happy-closed; look + glance
      const bl = staticMode ? 0 : blinkCurve(blinkAt < 0 ? -1 : t - blinkAt)
      const happy = clamp01(X[C.EYE_HAPPY])
      const open = Math.max(0.05, X[C.EYE_OPEN] * (1 - 0.94 * bl) * (1 - happy))
      const esx = 1 + 0.18 * (1 - open)
      const lx = X[C.LOOK_X] + X[C.GLANCE_X]; const ly = X[C.LOOK_Y] + X[C.GLANCE_Y]
      set(gEye, 'transform', 'matrix(' + r4(esx) + ' 0 0 ' + r4(open) + ' ' + r2(lx + 573 * (1 - esx)) + ' ' + r2(ly + 412 * (1 - open)) + ')')
      show(gEye, open > 0.06)
      set(happyEye, 'opacity', r2(clamp01(happy * 1.6 - 0.4)))
      trs(happyEye, 0, 0, 572, 410, 0, 1, 0.3 + 0.7 * happy)
      show(happyEye, happy > 0.26)
      // brow
      trs(gBrow, 0, X[C.BROW_Y] - 1.6 * att - 0.6 * lvl, 572, 390, X[C.BROW_ROT], 1, 1)
      browKey = drawMorph(browPath, [BROW.arch, BROW.sad], [clamp01(X[C.BROW_SAD])], g.browJit, browKey)
      // mouth
      mouthKey = drawMorph(mouthPath, [MOUTH.neutral, MOUTH.happy, MOUTH.sad], [X[C.M_HAPPY], X[C.M_SAD]], g.mouthJit, mouthKey)
      set(mouthPath, 'opacity', r2(clamp01(X[C.M_SHOW])))
      show(mouthPath, X[C.M_SHOW] > 0.02)
      // front leg / paw lift
      const pw = X[C.PAW]
      trs(gLeg, -3 * pw, -11 * pw, 594, 604, -7 * pw, 1, 1)
      // tail + wag lines
      const tip = drawTail(staticMode)
      const wl = X[C.P_WAGL]
      show(gWag, wl > 0.02)
      if (wl > 0.02) {
        set(gWag, 'transform', 'translate(' + r2(tip[0] - 844) + ' ' + r2(tip[1] - 580) + ')')
        set(gWag, 'opacity', r2(clamp01(wl) * (staticMode ? 1 : 0.25 + 0.75 * Math.abs(Math.sin(wagPhase)))))
      }
      // --- props
      const pb = X[C.P_BROWSER]
      show(gBrowser, pb > 0.01)
      if (pb > 0.01) {
        const bob = staticMode ? 0 : 1.6 * Math.sin(tt * 2 * Math.PI / 2.8)
        const s = (0.45 + 0.55 * pb) * 0.95 // a little smaller, so the nose never touches it
        trs(gBrowser, -3, bob, 402, 436, 0, s, s)
        set(gBrowser, 'opacity', r2(clamp01(pb * 1.8)))
        for (let i = 0; i < 3; i++) {
          let u = ((staticMode ? 0.3 : tt * 1.25) - i * 0.16) % 1; if (u < 0) u += 1
          const h = u < 0.42 ? Math.sin(Math.PI * u / 0.42) : 0
          set(loadDots[i], 'transform', 'translate(0 ' + r2(-7 * h * h) + ')')
        }
      }
      const pe = X[C.P_ENV]
      show(gEnv, pe > 0.01)
      if (pe > 0.01) {
        if (TG[C.P_ENV] === 0) { // exit: he lets go — it drops and tumbles away
          const q = 1 - clamp01(pe)
          trs(gEnv, -6 * q, 70 * q * q, 526, 452, X[C.ENV_SWAY] - 28 * q, 1, 1)
        } else {
          const s = 0.35 + 0.65 * pe
          trs(gEnv, 0, 0, 526, 452, X[C.ENV_SWAY], s, s)
        }
        set(gEnv, 'opacity', r2(TG[C.P_ENV] === 0 ? clamp01((pe - 0.12) * 2.6) : clamp01(pe * 2)))
      }
      const pq = X[C.P_Q]
      show(gQ, pq > 0.01)
      if (pq > 0.01) {
        const bob = staticMode ? 0 : -4.5 * Math.sin(tt * 2 * Math.PI / 2.6 - 0.7)
        const out = TG[C.P_Q] === 0 // exit: it floats up and goes, like a thought
        const s = out ? 1 + 0.25 * (1 - clamp01(pq)) : 0.55 + 0.45 * pq
        trs(gQ, 0, bob - (out ? 26 * (1 - clamp01(pq)) : 0), 540, 372, X[C.Q_SWAY], s, s)
        set(qCurve, 'stroke-dashoffset', out ? '0' : r4(1 - clamp01((pq - 0.06) * 1.3)))
        set(gQ, 'opacity', r2(out ? clamp01((pq - 0.15) * 2.2) : clamp01(pq * 4)))
        set(qCurve, 'stroke-dasharray', '1 1')
        const dp = out ? 1 : clamp01((pq - 0.72) / 0.28)
        set(qDot, 'opacity', r2(dp))
        trs(qDot, 0, 0, 540, 374, 0, 0.4 + 0.6 * dp, 0.4 + 0.6 * dp)
      }
      const pc = X[C.P_CABLE]
      show(gCable, pc > 0.005)
      if (pc > 0.005) {
        set(cable, 'stroke-dasharray', '1 1')
        set(cable, 'stroke-dashoffset', r4(1 - clamp01(pc)))
        const pp = clamp01((pc - 0.55) / 0.35)
        set(gPlug, 'opacity', r2(pp))
        const u = staticMode ? 0.4 : (tt / 2.4) % 1
        const sp = u < 0.2 ? u / 0.2 : u < 0.7 ? 1 : 1 - (u - 0.7) / 0.3
        set(gSparks, 'opacity', r2(pp * sp))
      }
      const ps = X[C.P_SPARK]
      show(gSpark, ps > 0.01)
      if (ps > 0.01) {
        for (let i = 0; i < SPARKLES.length; i++) {
          const S = SPARKLES[i]
          let env
          if (staticMode) env = [0.9, 0.65, 1, 0.55][i]
          else { const u = (tt / 1.7 + S[3]) % 1; env = u < 0.55 ? Math.sin(Math.PI * u / 0.55) : 0 }
          const pp = clamp01(ps); const r = S[2] * pp * pp * (3 - 2 * pp) * env
          set(sparkEls[i], 'transform', 'translate(' + r2(S[0]) + ' ' + r2(S[1]) + ') rotate(' + r2(staticMode ? 0 : 25 * ((tt / 1.7 + S[3]) % 1)) + ') scale(' + r2(Math.max(0.01, r)) + ')')
        }
      }
      const pa = X[C.P_ARCS]
      const arcOn = pa > 0.01 && (X[C.ARC0] > 0.01 || X[C.ARC2] > 0.01)
      show(gArcs, arcOn)
      if (arcOn) {
        const A = [X[C.ARC0], X[C.ARC1], X[C.ARC2]]
        for (let i = 0; i < 3; i++) {
          set(arcs[i], 'opacity', r2(pa * clamp01(A[i] * 1.5)))
          trs(arcs[i], 3 * (1 - clamp01(A[i])), 0, 470, 452, 0, 1, 1)
        }
      }
      // floor: revealed from Lou's side as far as the props need
      const fl = (886 - X[C.FLOOR_L]) / (886 - 338)
      set(floor, 'stroke-dasharray', r4(fl) + ' 2')
    }

    // --------------------------------------------------------------- loop
    const stats = globalThis.__louStats || (globalThis.__louStats = { avgFrameMs: 0, maxFrameMs: 0, frames: 0 })
    if (!stats._ring) Object.defineProperty(stats, '_ring', { value: new Float64Array(240), enumerable: false, writable: false })
    if (stats._i == null) Object.defineProperty(stats, '_i', { value: 0, enumerable: false, writable: true })
    function record(ms) {
      const R = stats._ring
      R[stats._i % 240] = ms; stats._i++
      const n = Math.min(stats._i, 240); let s = 0; let m = 0
      for (let i = 0; i < n; i++) { s += R[i]; if (R[i] > m) m = R[i] }
      stats.avgFrameMs = Math.round((s / n) * 1000) / 1000
      stats.maxFrameMs = Math.round(m * 1000) / 1000
      stats.frames = stats._i
    }

    function frame(dt) {
      const t0 = performance.now()
      update(dt)
      if (lineMode === 'boil' && t - lastBoil >= 0.1) { lastBoil = t; gv = (gv + 1) % geo.length; for (const [e, k] of statics) set(e, 'd', geo[gv].d[k]) }
      render(false)
      record(performance.now() - t0)
    }
    function loop(now) {
      raf = 0
      if (destroyed || reduced) return
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
      last = now
      frame(dt)
      schedule()
    }
    function schedule() {
      if (!raf && !destroyed && !reduced && !manual && !document.hidden) raf = requestAnimationFrame(loop)
    }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; last = 0 }

    function drawStatic() {
      applyPose(state)
      TG[C.LEVEL] = 0
      snap()
      render(true)
    }

    function onVis() { if (document.hidden) stop(); else schedule() }
    function onMQ() {
      const r = !!opts.reducedMotion || reducedMQ.matches
      if (r === reduced) return
      reduced = r
      if (reduced) { stop(); drawStatic() } else { last = 0; schedule() }
    }
    document.addEventListener('visibilitychange', onVis)
    if (reducedMQ) reducedMQ.addEventListener('change', onMQ)

    // line width: never thinner than MIN_SW_PX on screen, else the drawing's own
    let ro = null
    function sizeInk() {
      const w = svg.getBoundingClientRect().width
      if (!w) return
      const pxPerUnit = w / VB[2]
      const sw = Math.max(BASE_SW, MIN_SW_PX / pxPerUnit)
      root.style.setProperty('--lou-sw', r2(sw) + 'px')
    }
    if (typeof ResizeObserver === 'function') { ro = new ResizeObserver(sizeInk); ro.observe(root) }
    sizeInk()

    // first pose: already there, no pop-in
    applyPose(state)
    enter(state, true)
    snap()
    if (reduced) drawStatic(); else { render(false); schedule() }

    const api = {
      setState(name) {
        if (destroyed || STATES.indexOf(name) < 0 || name === state) return
        if (reduced) { state = name; drawStatic(); return }
        enter(name, false)
      },
      setListening(level) {
        if (destroyed) return
        const v = Number(level)
        listenTarget = v > 0 ? (v > 1 ? 1 : v) : 0
      },
      destroy() {
        if (destroyed) return
        destroyed = true
        stop()
        document.removeEventListener('visibilitychange', onVis)
        if (reducedMQ) reducedMQ.removeEventListener('change', onMQ)
        if (ro) ro.disconnect()
        events = []
        cache.clear()
        if (root.parentNode) root.parentNode.removeChild(root)
      },
      get state() { return state }
    }
    if (manual) {
      // test hook: advance the rig's own clock by exactly `ms` (deterministic film)
      api.__step = function (ms) { if (!destroyed && !reduced) frame(ms / 1000) }
    }
    return api
  }

  globalThis.LouRig = { mount, states: STATES.slice() }
})()
