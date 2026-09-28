/* Mounts the sign-in stage on loudflow.xyz/auth/done — the same living half
 * the app's sign-in window shows (app repo: app/src/hub/stage/, lou/). The
 * server writes Lou's pose into data-pose; without script the drawn Lou in
 * the element stays, so the page is whole either way. */
(function () {
  var h = document.getElementById('stage')
  if (!h || !window.LFStage || typeof window.LFStage.mount !== 'function') return
  var pose = h.getAttribute('data-pose') || 'listening'
  var still = h.querySelector('img')
  try {
    window.LFStage.mount(h, { pose: pose })
    if (still) still.parentNode.removeChild(still)
  } catch (e) { /* the drawn Lou stays */ }
})()
