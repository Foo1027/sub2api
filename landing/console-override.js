(function () {
  var exactRoutes = new Set([
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
    var path = window.location.pathname
    if (!exactRoutes.has(path) && !path.startsWith('/admin')) return
    document.documentElement.classList.add('console-shell')
    document.body.classList.add('console-override-active')
  }

  syncConsoleShell()
  window.addEventListener('popstate', syncConsoleShell)
  window.addEventListener('hashchange', syncConsoleShell)
})()
