(async () => {
  const browser = globalThis.browser ?? globalThis.chrome

  const toggleTrackingBtn = document.querySelector('button#toggle-tracking')

  const toggleTrackingBtnText = {
    [true]: 'Enable tracking',
    [false]: 'Disable tracking'
  }

  async function getTabHostname () {
    const queryOptions = { active: true, currentWindow: true }
    const tabs = await browser.tabs.query(queryOptions)
    return new URL(tabs[0].url).hostname
  }

  async function getTrackingDisabled () {
    const hostname = await getTabHostname()
    const obj = await browser.storage.sync.get([hostname])
    return obj[hostname] ?? false
  }

  let trackingDisabled

  getTrackingDisabled().then((trackingDisabled) => {
    toggleTrackingBtn.innerHTML = toggleTrackingBtnText[trackingDisabled]
  })

  toggleTrackingBtn.addEventListener('click', async () => {
    // Request permissions for all website.
    const permissions = { origins: ['<all_urls>'] }
    await browser.permissions.request(permissions)

    trackingDisabled = await getTrackingDisabled()

    browser.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs) => browser.tabs.sendMessage(tabs[0].id, { command: 'toggle-tracking' }))
      .catch(console.error)
    toggleTrackingBtn.innerHTML = toggleTrackingBtnText[!trackingDisabled]
  })
})()
