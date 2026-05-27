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

  var userGroupMatchers = [
    ['/keys', 'account'],
    ['/usage', 'account'],
    ['/monitor', 'account'],
    ['/subscriptions', 'account'],
    ['/purchase', 'account'],
    ['/orders', 'account'],
    ['/redeem', 'account'],
    ['/affiliate', 'account'],
    ['/profile', 'account'],
    ['/custom/', 'account']
  ]

  var adminGroupMatchers = [
    ['/admin/dashboard', 'admin-core'],
    ['/admin/ops', 'admin-core'],
    ['/admin/users', 'admin-core'],
    ['/admin/groups', 'admin-core'],
    ['/admin/channels', 'admin-channel'],
    ['/admin/subscriptions', 'admin-channel'],
    ['/admin/accounts', 'admin-channel'],
    ['/admin/announcements', 'admin-channel'],
    ['/admin/proxies', 'admin-risk'],
    ['/admin/risk-control', 'admin-risk'],
    ['/admin/redeem', 'admin-growth'],
    ['/admin/promo-codes', 'admin-growth'],
    ['/admin/affiliates', 'admin-growth'],
    ['/admin/orders', 'admin-finance'],
    ['/admin/usage', 'admin-finance'],
    ['/admin/settings', 'admin-system']
  ]

  function isConsoleRoute(path) {
    return exactRoutes.has(path) || path.indexOf('/admin') === 0
  }

  function syncShellClass() {
    var path = window.location.pathname
    if (!isConsoleRoute(path)) return
    document.documentElement.classList.add('console-shell')
    document.body.classList.add('console-override-active')
  }

  function findSidebarNav() {
    return document.querySelector('.sidebar .sidebar-nav')
  }

  function tagSidebarLinks() {
    var nav = findSidebarNav()
    if (!nav) return

    var items = nav.querySelectorAll('a.sidebar-link, button.sidebar-link')
    items.forEach(function (item) {
      var href = item.getAttribute('href') || item.getAttribute('to') || ''
      var group = ''
      var source = href || (item.textContent || '')
      var matchers = source.indexOf('/admin') === 0 ? adminGroupMatchers : userGroupMatchers

      matchers.forEach(function (entry) {
        if (source.indexOf(entry[0]) === 0) group = entry[1]
      })

      if (group) item.setAttribute('data-nav-group', group)
    })
  }

  function ensureSidebarHeadings() {
    var nav = findSidebarNav()
    if (!nav) return

    nav.querySelectorAll('.console-nav-heading').forEach(function (el) {
      el.remove()
    })

    var labels = {
      'admin-core': '控制中心',
      'admin-channel': '渠道与资源',
      'admin-risk': '风控与网络',
      'admin-growth': '增长工具',
      'admin-finance': '订单与统计',
      'admin-system': '系统配置',
      'account': '我的账户'
    }

    var seen = {}
    Array.prototype.slice.call(nav.children).forEach(function (child) {
      var group =
        child.getAttribute('data-nav-group') ||
        child.querySelector('[data-nav-group]')?.getAttribute('data-nav-group')

      if (!group || seen[group]) return
      seen[group] = true

      var heading = document.createElement('div')
      heading.className = 'console-nav-heading sidebar-section-title'
      heading.textContent = labels[group] || ''
      nav.insertBefore(heading, child)
    })
  }

  function swapLogoByTheme() {
    var logo = document.querySelector('.sidebar .sidebar-logo img')
    if (!logo) return
    var isDark = document.documentElement.classList.contains('dark')
    var nextSrc = isDark
      ? '/landing-assets/foo_ai_logo_white.svg'
      : '/landing-assets/foo_ai_logo_black.svg'

    if (logo.getAttribute('src') !== nextSrc) {
      logo.setAttribute('src', nextSrc)
    }
  }

  function syncSidebarBrand() {
    swapLogoByTheme()
    tagSidebarLinks()
    ensureSidebarHeadings()
  }

  function run() {
    syncShellClass()
    syncSidebarBrand()
  }

  run()
  window.addEventListener('popstate', run)
  window.addEventListener('hashchange', run)

  var observer = new MutationObserver(function () {
    run()
  })

  if (document.documentElement) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'src']
    })
  }
})()
