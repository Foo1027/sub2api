(() => {
  const STORAGE_KEY = "aifoo-auth-theme";
  const root = document.documentElement;
  const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)") : null;

  function resolveTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    return media && media.matches ? "light" : "dark";
  }

  function applyTheme(theme) {
    const isLight = theme === "light";
    root.classList.toggle("auth-light", isLight);
    root.classList.toggle("dark", !isLight);
    localStorage.setItem("theme", isLight ? "light" : "dark");
  }

  function ensureButton() {
    let button = document.querySelector(".auth-theme-toggle");
    if (button) {
      return button;
    }
    button = document.createElement("button");
    button.type = "button";
    button.className = "auth-theme-toggle";
    button.setAttribute("aria-label", "切换显示模式");
    button.innerHTML = `
      <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="12" cy="12" r="4.2"/>
        <path d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6" stroke-linecap="round"/>
      </svg>
    `;
    button.addEventListener("click", () => {
      const nextTheme = root.classList.contains("auth-light") ? "dark" : "light";
      localStorage.setItem(STORAGE_KEY, nextTheme);
      applyTheme(nextTheme);
    });
    document.body.appendChild(button);
    return button;
  }

  function boot() {
    applyTheme(resolveTheme());
    ensureButton();
  }

  if (media && media.addEventListener) {
    media.addEventListener("change", () => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(resolveTheme());
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
