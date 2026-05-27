(function () {
  var exactRoutes = new Set([
    '/dashboard',
    '/keys',
    '/usage',
    '/monitor',
    '/pricing',
    '/docs',
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
    ['/dashboard', 'user-overview'],
    ['/keys', 'user-api'],
    ['/usage', 'user-api'],
    ['/monitor', 'user-api'],
    ['/pricing', 'user-api'],
    ['/custom/', 'user-api'],
    ['/subscriptions', 'user-billing'],
    ['/purchase', 'user-billing'],
    ['/orders', 'user-billing'],
    ['/redeem', 'user-billing'],
    ['/affiliate', 'user-billing'],
    ['/docs', 'user-other'],
    ['/profile', 'user-other']
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
    'user-api': 'API',
    'user-billing': '账单',
    'user-other': '其他'
  }

  var buttonLabelMatchers = [
    ['渠道管理', 'admin-channel'],
    ['channel', 'admin-channel'],
    ['邀请返利', 'admin-growth'],
    ['affiliate', 'admin-growth'],
    ['订单管理', 'admin-finance'],
    ['order', 'admin-finance']
  ]

  function isConsoleRoute(path) {
    return exactRoutes.has(path) || path.indexOf('/admin') === 0
  }

  function clearShellClass() {
    document.documentElement.classList.remove('console-shell-pending')
    document.documentElement.classList.remove('console-shell')
    document.body.classList.remove('console-override-active')
    Array.prototype.slice
      .call(document.documentElement.classList)
      .forEach(function (cls) {
        if (cls.indexOf('route-') === 0) document.documentElement.classList.remove(cls)
      })
  }

  function syncShellClass() {
    var path = window.location.pathname
    if (!isConsoleRoute(path)) {
      clearShellClass()
      return false
    }
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

    if (!group) {
      var text = (item.textContent || item.getAttribute('title') || '').trim().toLowerCase()
      buttonLabelMatchers.forEach(function (entry) {
        if (!group && text.indexOf(String(entry[0]).toLowerCase()) !== -1) {
          group = entry[1]
        }
      })
    }

    return group
  }

  function tagSidebarLinks(nav) {
    var items = nav.querySelectorAll('a.sidebar-link, button.sidebar-link')
    items.forEach(function (item) {
      var group = getGroupForItem(item)
      if (group) item.setAttribute('data-nav-group', group)
    })
  }

  function cleanupInjectedSidebarHeadings(nav) {
    nav.querySelectorAll('[data-console-heading="true"]').forEach(function (node) {
      node.remove()
    })
  }

  function createHeading(label) {
    var heading = document.createElement('div')
    heading.className = 'console-nav-heading sidebar-section-title'
    heading.setAttribute('data-console-heading', 'true')

    var text = document.createElement('span')
    text.className = 'sidebar-section-title-text'
    text.textContent = label

    heading.appendChild(text)
    return heading
  }

  function ensureSectionHeadings(section) {
    var items = Array.prototype.slice.call(section.querySelectorAll(':scope > .sidebar-link, :scope > button.sidebar-link'))
    if (!items.length) return

    var seen = {}

    items.forEach(function (item) {
      var group = item.getAttribute('data-nav-group') || getGroupForItem(item)
      if (!group || seen[group]) return
      seen[group] = true
      if (group === 'user-overview') return
      section.insertBefore(createHeading(labelMap[group] || ''), item)
    })
  }

  function hideNativeAccountHeading(nav) {
    var titles = nav.querySelectorAll('.sidebar-section-title')
    titles.forEach(function (title) {
      if (title.getAttribute('data-console-heading') === 'true') return
      var text = (title.textContent || '').replace(/\s+/g, ' ').trim()
      if (text === '我的账户') {
        title.setAttribute('data-console-hidden-heading', 'true')
      } else {
        title.removeAttribute('data-console-hidden-heading')
      }
    })
  }

  function ensureSidebarHeadings(nav) {
    cleanupInjectedSidebarHeadings(nav)
    hideNativeAccountHeading(nav)

    var sections = Array.prototype.slice.call(nav.querySelectorAll(':scope > .sidebar-section'))
    if (!sections.length) return

    if (sections.length === 1) {
      ensureSectionHeadings(sections[0])
      return
    }

    ensureSectionHeadings(sections[0])
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
    document.documentElement.classList.remove('console-shell-pending')
    return true
  }

  function run() {
    if (!syncShellClass()) return
    applySidebarEnhancements()
  }

  var scheduled = false
  function scheduleRun() {
    if (scheduled) return
    scheduled = true
    window.requestAnimationFrame(function () {
      scheduled = false
      run()
    })
  }

  function patchHistoryMethod(methodName) {
    var original = window.history[methodName]
    if (typeof original !== 'function') return
    window.history[methodName] = function () {
      var result = original.apply(this, arguments)
      scheduleRun()
      return result
    }
  }

  run()
  patchHistoryMethod('pushState')
  patchHistoryMethod('replaceState')
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

  var sidebarObserver = new MutationObserver(function (mutations) {
    var shouldRefresh = mutations.some(function (mutation) {
      if (mutation.type !== 'childList') return false
      var changedNodes = Array.prototype.slice
        .call(mutation.addedNodes)
        .concat(Array.prototype.slice.call(mutation.removedNodes))

      return changedNodes.some(function (node) {
        if (!node || node.nodeType !== 1) return false
        if (node.getAttribute && node.getAttribute('data-console-heading') === 'true') return false
        if (node.closest && node.closest('[data-console-heading="true"]')) return false
        return !!(
          (node.matches && node.matches('.sidebar, .sidebar-nav, .sidebar-section, .sidebar-link')) ||
          (node.querySelector &&
            node.querySelector('.sidebar, .sidebar-nav, .sidebar-section, .sidebar-link'))
        )
      })
      
      return false
    })

    if (shouldRefresh) {
      scheduleRun()
    }
  })

  sidebarObserver.observe(document.body, {
    childList: true,
    subtree: true
  })
})()
