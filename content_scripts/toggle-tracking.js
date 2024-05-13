(async () => {
  const browser = globalThis.browser ?? globalThis.chrome

  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  window.prisme = window.prisme ?? {}
  if (window.prisme.webExtHasRun) {
    return;
  }
  window.prisme.webExtHasRun = true;
  const hostname = globalThis.location.hostname

  const prismeUrls = {}

  async function disableTracking() {
    const scripts = document.querySelectorAll('script')
    for (const script of scripts) {
      prismeUrls[script] = script.dataset.prismeUrl
      script.dataset.prismeUrl = "http://prisme-webext.localhost/void"
    }
    await browser.storage.sync.set({ [hostname]: true })
  }

  async function enableTracking() {
    const scripts = document.querySelectorAll('script')
    for (const script of scripts) {
      if (prismeUrls[script] === undefined) {
        delete script.dataset.prismeUrl
      } else {
        script.dataset.prismeUrl = prismeUrls[script]
      }
    }
    await browser.storage.sync.remove([hostname])
  }

  async function getTrackingDisabled() {
    const obj = await browser.storage.sync.get([hostname])
    return obj[hostname] ?? false
  }

  async function toggleTracking() {
    if (await getTrackingDisabled()) {
      enableTracking()
    } else {
      disableTracking()
    }
  }

  /**
   * Listen for messages from the background script.
   */
  browser.runtime.onMessage.addListener(() => {
    toggleTracking()
  });

  /**
   * Disable tracking if tracking is disabled in storage.
   */
  if (await getTrackingDisabled()) {
    disableTracking()
  }
})();
