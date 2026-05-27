(function () {
  var routes = new Set([
    '/dashboard',
    '/keys',
    '/usage',
    '/channel-status',
    '/purchase',
    '/orders',
    '/subscriptions',
    '/redeem',
    '/affiliate',
    '/profile',
    '/available-channels'
  ])

  function syncConsoleShell() {
    if (!routes.has(window.location.pathname)) return
    document.documentElement.classList.add('console-shell')
    document.body.classList.add('console-override-active')
  }

  syncConsoleShell()
  window.addEventListener('popstate', syncConsoleShell)
  window.addEventListener('hashchange', syncConsoleShell)
})()
