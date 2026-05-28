(function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (regs) {
      regs.forEach(function (r) { r.unregister(); });
    });
  }
  function pathFrom(url) {
    try { return url ? new URL(url, location.href).pathname : location.pathname; }
    catch (_) { return location.pathname; }
  }
  var AUTH_RE = /^\/(login|register|forgot-password|reset-password|email-verify)$/;
  var CONSOLE_RE = /^\/(dashboard|keys|usage|channel-status|purchase|orders|subscriptions|redeem|affiliate|profile|available-channels|admin(?:\/.*)?)$/;
function sync(path) {
    var root = document.documentElement;
    root.classList.toggle('auth-shell-pending', AUTH_RE.test(path));
    root.classList.toggle('console-shell-pending', CONSOLE_RE.test(path));
  }
  var push = history.pushState, replace = history.replaceState;
  history.pushState = function (s, t, u) { sync(pathFrom(u)); return push.apply(this, arguments); };
  history.replaceState = function (s, t, u) { sync(pathFrom(u)); return replace.apply(this, arguments); };
  window.addEventListener('popstate', function () { sync(location.pathname); });
  window.addEventListener('hashchange', function () { sync(location.pathname); });
  sync(location.pathname);
})();
