(() => {
  "use strict";
  const defaults = {
    theme: "dark", accent: "#8b7cff", density: "comfortable",
    corners: "rounded", textSize: "normal", reduceMotion: false
  };
  const keys = {
    theme: "uiTheme", accent: "uiAccent", density: "uiDensity",
    corners: "uiCorners", textSize: "uiTextSize", reduceMotion: "uiReduceMotion"
  };
  const $ = id => document.getElementById(id);
  const valid = (value, allowed, fallback) => allowed.includes(value) ? value : fallback;
  function apply(prefs) {
    const body = document.body;
    body.dataset.uiTheme = valid(prefs.theme, ["dark","midnight","light"], defaults.theme);
    body.dataset.uiDensity = valid(prefs.density, ["comfortable","compact","spacious"], defaults.density);
    body.dataset.uiCorners = valid(prefs.corners, ["rounded","soft","sharp"], defaults.corners);
    body.dataset.uiTextSize = valid(prefs.textSize, ["small","normal","large"], defaults.textSize);
    body.dataset.uiReduceMotion = String(Boolean(prefs.reduceMotion));
    const accent = /^#[0-9a-f]{6}$/i.test(prefs.accent) ? prefs.accent : defaults.accent;
    body.style.setProperty("--ui-accent", accent);
    const n = parseInt(accent.slice(1), 16);
    body.style.setProperty("--ui-accent-rgb", `${n >> 16}, ${(n >> 8) & 255}, ${n & 255}`);
  }
  function read() {
    return {
      theme: localStorage.getItem(keys.theme) || defaults.theme,
      accent: localStorage.getItem(keys.accent) || defaults.accent,
      density: localStorage.getItem(keys.density) || defaults.density,
      corners: localStorage.getItem(keys.corners) || defaults.corners,
      textSize: localStorage.getItem(keys.textSize) || defaults.textSize,
      reduceMotion: localStorage.getItem(keys.reduceMotion) === "true"
    };
  }
  function save(prefs) {
    Object.entries(keys).forEach(([name, key]) => localStorage.setItem(key, String(prefs[name])));
    apply(prefs);
    const status = $("ui-preference-status");
    if (status) status.textContent = "Appearance saved on this device.";
  }
  function init() {
    let prefs = read();
    apply(prefs);
    const fields = {
      theme: "ui-theme", accent: "ui-accent", density: "ui-density",
      corners: "ui-corners", textSize: "ui-text-size", reduceMotion: "ui-reduce-motion"
    };
    Object.entries(fields).forEach(([name, id]) => {
      const el = $(id);
      if (!el) return;
      el.type === "checkbox" ? el.checked = prefs[name] : el.value = prefs[name];
      el.addEventListener("input", () => {
        prefs = { ...prefs, [name]: el.type === "checkbox" ? el.checked : el.value };
        save(prefs);
      });
      el.addEventListener("change", () => {
        prefs = { ...prefs, [name]: el.type === "checkbox" ? el.checked : el.value };
        save(prefs);
      });
    });
    const reset = $("ui-reset");
    if (reset) reset.addEventListener("click", () => {
      prefs = { ...defaults };
      save(prefs);
      Object.entries(fields).forEach(([name, id]) => {
        const el = $(id);
        if (el) el.type === "checkbox" ? el.checked = prefs[name] : el.value = prefs[name];
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
