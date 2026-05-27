(() => {
  const ROUTE_PATTERNS = {
    "/login": /path:"\/login"[\s\S]*?__vite__mapDeps\(\[([^\]]+)\]\)/,
    "/register": /path:"\/register"[\s\S]*?__vite__mapDeps\(\[([^\]]+)\]\)/,
    "/forgot-password":
      /path:"\/forgot-password"[\s\S]*?__vite__mapDeps\(\[([^\]]+)\]\)/,
    "/reset-password":
      /path:"\/reset-password"[\s\S]*?__vite__mapDeps\(\[([^\]]+)\]\)/,
    "/email-verify":
      /path:"\/email-verify"[\s\S]*?__vite__mapDeps\(\[([^\]]+)\]\)/,
  };
  const DEP_MAP_PATTERN = /m\.f\|\|\(m\.f=\|\|m\.f=\[([^\]]+)\]\)\)\)=>/;

  function parseQuotedList(source) {
    return Array.from(source.matchAll(/"([^"]+)"/g), (match) => match[1]);
  }

  function appendPreload(href) {
    if (!href || document.querySelector(`link[href="${href}"]`)) {
      return;
    }

    const link = document.createElement("link");
    link.crossOrigin = "anonymous";
    link.href = href.startsWith("/") ? href : `/${href}`;

    if (href.endsWith(".css")) {
      link.rel = "preload";
      link.as = "style";
    } else if (href.endsWith(".js")) {
      link.rel = "modulepreload";
    } else {
      return;
    }

    document.head.appendChild(link);
  }

  async function preloadAuthChunks() {
    const entryScript = document.querySelector(
      'script[type="module"][src*="/assets/index-"]',
    );

    if (!entryScript || !entryScript.src) {
      return;
    }

    try {
      const response = await fetch(entryScript.src, { credentials: "same-origin" });
      const source = await response.text();

      const depMapMatch = source.match(DEP_MAP_PATTERN);
      const routePattern =
        ROUTE_PATTERNS[window.location.pathname] || ROUTE_PATTERNS["/login"];
      const routeMatch = source.match(routePattern);

      if (!depMapMatch || !routeMatch) {
        return;
      }

      const deps = parseQuotedList(depMapMatch[1]);
      const routeIndexes = routeMatch[1]
        .split(",")
        .map((value) => Number.parseInt(value.trim(), 10))
        .filter((value) => Number.isInteger(value) && value >= 0 && value < deps.length);

      const localeHint = document.documentElement.lang?.toLowerCase().startsWith("zh")
        ? deps.find((href) => /assets\/zh-[^/]+\.js$/.test(href))
        : deps.find((href) => /assets\/en-[^/]+\.js$/.test(href));

      if (localeHint) {
        appendPreload(localeHint);
      }

      appendPreload("landing-assets/foo_ai_logo_white.svg");
      appendPreload("landing-assets/foo_ai_logo_black.svg");

      for (const index of routeIndexes) {
        appendPreload(deps[index]);
      }
    } catch (error) {
      console.warn("auth preload skipped", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", preloadAuthChunks, { once: true });
  } else {
    preloadAuthChunks();
  }
})();
