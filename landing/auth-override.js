(() => {
  const AUTH_ROUTES = new Set([
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/email-verify",
  ]);

  function isAuthRoute() {
    return AUTH_ROUTES.has(window.location.pathname);
  }

  function createHero() {
    const hero = document.createElement("section");
    hero.className = "aifoo-auth-hero";
    hero.innerHTML = `
      <div class="aifoo-auth-hero-inner">
        <div class="aifoo-auth-kicker">SUB2API / FOO+</div>
        <h1>AIFoo</h1>
        <p class="aifoo-auth-tagline">把订阅入口转换成稳定、顺滑、可运营的 API 工作台。</p>
        <div class="aifoo-auth-points">
          <div class="aifoo-auth-point">
            <span class="aifoo-auth-point-icon">01</span>
            <div>
              <strong>统一登录入口</strong>
              <p>保留原有认证逻辑，未登录页面整体切换成你的首页视觉语言。</p>
            </div>
          </div>
          <div class="aifoo-auth-point">
            <span class="aifoo-auth-point-icon">02</span>
            <div>
              <strong>按量计费体验</strong>
              <p>从登录、注册到找回密码，都沿用 AIFoo 的橙色卡片和玻璃质感。</p>
            </div>
          </div>
          <div class="aifoo-auth-point">
            <span class="aifoo-auth-point-icon">03</span>
            <div>
              <strong>系统主题跟随</strong>
              <p>深浅色跟随系统切换，同时保留登录页自身的交互与表单校验。</p>
            </div>
          </div>
        </div>
        <div class="aifoo-auth-hero-models" aria-hidden="true">
          <span>Claude</span>
          <span>GPT</span>
          <span>Gemini</span>
          <span>Hermes</span>
        </div>
      </div>
    `;
    return hero;
  }

  function applyAuthSkin() {
    if (!isAuthRoute()) {
      return;
    }

    document.body.classList.add("auth-landing-page");

    const outer = document.querySelector(".relative.flex.min-h-screen.items-center.justify-center.overflow-hidden.p-4");
    const wrapper = document.querySelector(".relative.z-10.w-full.max-w-md");

    if (!outer || !wrapper) {
      return;
    }

    outer.classList.add("aifoo-auth-layout");
    wrapper.classList.add("aifoo-auth-panel");

    const brand = wrapper.querySelector(":scope > .mb-8.text-center");
    const card = wrapper.querySelector(":scope > .card-glass.rounded-2xl.p-8.shadow-glass");
    const footer = wrapper.querySelector(":scope > .mt-6.text-center.text-sm");
    const copyright = wrapper.querySelector(":scope > .mt-8.text-center.text-xs");

    if (brand) {
      brand.classList.add("aifoo-auth-brand");
    }
    if (card) {
      card.classList.add("aifoo-auth-card");
    }
    if (footer) {
      footer.classList.add("aifoo-auth-footer");
    }
    if (copyright) {
      copyright.classList.add("aifoo-auth-copyright");
    }

    let hero = outer.querySelector(".aifoo-auth-hero");
    if (!hero) {
      hero = createHero();
      outer.insertBefore(hero, wrapper);
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
