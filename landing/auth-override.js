(() => {
  const AUTH_ROUTES = new Map([
    ["/login", { kicker: "PACKY STYLE / LOGIN", title: "欢迎回来", note: "登录后继续进入你的 API 工作台。" }],
    ["/register", { kicker: "PACKY STYLE / REGISTER", title: "创建账户", note: "保留原本注册逻辑，只替换成更轻盈的玻璃卡片视觉。" }],
    ["/forgot-password", { kicker: "PACKY STYLE / RECOVERY", title: "找回密码", note: "通过邮箱重置密码，界面和登录页保持同一风格。" }],
    ["/reset-password", { kicker: "PACKY STYLE / RESET", title: "重设密码", note: "继续完成密码重置流程。" }],
    ["/email-verify", { kicker: "PACKY STYLE / VERIFY", title: "验证邮箱", note: "验证完成后继续注册流程。" }],
  ]);

  function getRouteMeta() {
    return AUTH_ROUTES.get(window.location.pathname);
  }

  function ensureDecoration(outer) {
    let decoration = outer.querySelector(".aifoo-auth-decoration");
    if (decoration) {
      return decoration;
    }

    decoration = document.createElement("div");
    decoration.className = "aifoo-auth-decoration";
    decoration.innerHTML = `
      <div class="aifoo-auth-blur aifoo-auth-blur-1"></div>
      <div class="aifoo-auth-blur aifoo-auth-blur-2"></div>
      <div class="aifoo-auth-blur aifoo-auth-blur-3"></div>
      <div class="aifoo-auth-grid"></div>
    `;
    outer.prepend(decoration);
    return decoration;
  }

  function ensureBadge(card, meta) {
    if (!meta) {
      return;
    }

    let badge = card.querySelector(".aifoo-auth-floating-badge");
    if (!badge) {
      badge = document.createElement("div");
      badge.className = "aifoo-auth-floating-badge";
      card.prepend(badge);
    }

    badge.innerHTML = `
      <span class="aifoo-auth-floating-kicker">${meta.kicker}</span>
      <strong>${meta.title}</strong>
      <p>${meta.note}</p>
    `;
  }

  function applyAuthSkin() {
    const meta = getRouteMeta();
    if (!meta) {
      return;
    }

    document.body.classList.add("auth-landing-page", "auth-packy-page");

    const outer = document.querySelector(".relative.flex.min-h-screen.items-center.justify-center.overflow-hidden.p-4");
    const wrapper = document.querySelector(".relative.z-10.w-full.max-w-md");
    if (!outer || !wrapper) {
      return;
    }

    outer.classList.add("aifoo-auth-layout");
    wrapper.classList.add("aifoo-auth-panel");

    ensureDecoration(outer);

    const brand = wrapper.querySelector(":scope > .mb-8.text-center");
    const card = wrapper.querySelector(":scope > .card-glass.rounded-2xl.p-8.shadow-glass");
    const footer = wrapper.querySelector(":scope > .mt-6.text-center.text-sm");
    const copyright = wrapper.querySelector(":scope > .mt-8.text-center.text-xs");

    if (brand) {
      brand.classList.add("aifoo-auth-brand");
    }
    if (card) {
      card.classList.add("aifoo-auth-card");
      ensureBadge(card, meta);
    }
    if (footer) {
      footer.classList.add("aifoo-auth-footer");
    }
    if (copyright) {
      copyright.classList.add("aifoo-auth-copyright");
    }
  }

  const observer = new MutationObserver(() => {
    applyAuthSkin();
  });

  function boot() {
    applyAuthSkin();
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
