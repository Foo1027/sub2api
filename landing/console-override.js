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

  var labelMap = {
    'admin-core': '控制中心',
    'admin-channel': '渠道与资源',
    'admin-risk': '风控与网络',
    'admin-growth': '增长工具',
    'admin-finance': '订单与统计',
    'admin-system': '系统配置',
    'account': '我的账户'
  }

  function isConsoleRoute(path) {
    return exactRoutes.has(path) || path.indexOf('/admin') === 0
  }

  function syncShellClass() {
    var path = window.location.pathname
    if (!isConsoleRoute(path)) return false
    document.documentElement.classList.add('console-shell')
    document.body.classList.add('console-override-active')
    Array.prototype.slice
      .call(document.documentElement.classList)
      .forEach(function (cls) {
        if (cls.indexOf('route-') === 0) document.documentElement.classList.remove(cls)
      })
    var routeClass =
      'route-' +
      path
        .replace(/^\/+|\/+$/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    if (routeClass !== 'route-') {
      document.documentElement.classList.add(routeClass)
    }
    return true
  }

  function findSidebarNav() {
    return document.querySelector('.sidebar .sidebar-nav')
  }

  function getGroupForItem(item) {
    var href = item.getAttribute('href') || item.getAttribute('to') || ''
    var source = href || ''
    var group = ''
    var matchers = source.indexOf('/admin') === 0 ? adminGroupMatchers : userGroupMatchers

    matchers.forEach(function (entry) {
      if (source.indexOf(entry[0]) === 0) group = entry[1]
    })

    return group
  }

  function tagSidebarLinks(nav) {
    var items = nav.querySelectorAll('a.sidebar-link, button.sidebar-link')
    items.forEach(function (item) {
      var group = getGroupForItem(item)
      if (group) item.setAttribute('data-nav-group', group)
    })
  }

  function ensureSidebarHeadings(nav) {
    if (nav.getAttribute('data-console-grouped') === 'true') return

    var children = Array.prototype.slice.call(nav.children)
    var seen = {}

    children.forEach(function (child) {
      var group =
        child.getAttribute('data-nav-group') ||
        child.querySelector('[data-nav-group]')?.getAttribute('data-nav-group')

      if (!group || seen[group]) return
      seen[group] = true

      var heading = document.createElement('div')
      heading.className = 'console-nav-heading sidebar-section-title'
      heading.textContent = labelMap[group] || ''
      nav.insertBefore(heading, child)
    })

    nav.setAttribute('data-console-grouped', 'true')
  }

  function swapLogoByTheme() {
    var logo = document.querySelector('.sidebar .sidebar-logo img')
    if (!logo) return false
    var isDark = document.documentElement.classList.contains('dark')
    var nextSrc = isDark
      ? '/landing-assets/foo_ai_logo_white.svg'
      : '/landing-assets/foo_ai_logo_black.svg'

    if (logo.getAttribute('src') !== nextSrc) {
      logo.setAttribute('src', nextSrc)
    }
    return true
  }

  function applySidebarEnhancements() {
    var nav = findSidebarNav()
    if (!nav) return false
    tagSidebarLinks(nav)
    ensureSidebarHeadings(nav)
    swapLogoByTheme()
    return true
  }

  function run() {
    if (!syncShellClass()) return
    applySidebarEnhancements()
  }

  run()
  window.addEventListener('popstate', run)
  window.addEventListener('hashchange', run)
  document.addEventListener('DOMContentLoaded', run)

  var retries = 0
  var timer = setInterval(function () {
    retries += 1
    run()
    if (applySidebarEnhancements() || retries >= 20) {
      clearInterval(timer)
    }
  }, 500)

  var themeObserver = new MutationObserver(function () {
    swapLogoByTheme()
  })

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})()
