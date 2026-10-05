/* Fades Browser — cloud console. Mounts into #app. Pair with page.css.
   Set window.FADES_BROWSER_BASE (default "/api/browser") and window.FADES_LOGIN_URL before loading. */
(() => {
const BASE = window.FADES_BROWSER_BASE || "/api/browser";
const LOGIN = window.FADES_LOGIN_URL || "/login";

/* ---------- helpers ---------- */
const h = (t, p, ...k) => {
  const e = document.createElement(t);
  for (const [a, v] of Object.entries(p || {})) {
    if (a === "class") e.className = v;
    else if (a.startsWith("on")) e.addEventListener(a.slice(2), v);
    else if (v === true) e.setAttribute(a, "");
    else if (v !== false && v != null) e.setAttribute(a, v);
  }
  for (const c of k.flat(9)) if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(c));
  return e;
};
const $ = (s, r = document) => r.querySelector(s);
const fmt = (d) => { const t = Date.parse(d); return t ? new Date(t).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : ""; };
const hue = (s = "") => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7);

async function api(path, { method = "GET", body, query } = {}) {
  const qs = query ? "?" + new URLSearchParams(Object.entries(query).filter(([, v]) => v !== "" && v != null)) : "";
  const r = await fetch(`${BASE}/${path}${qs}`, {
    method, credentials: "include",
    headers: body !== undefined ? { "Content-Type": "application/json" } : {},
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let d = {}; try { d = await r.json(); } catch {}
  if (r.status === 401) throw Object.assign(new Error("Sign in required."), { auth: true });
  if (!r.ok || d.success === false) throw new Error(d.error || `Request failed (${r.status})`);
  return d;
}

function toast(msg, bad) {
  const t = h("div", { class: "toast" + (bad ? " bad" : ""), role: "status" }, msg);
  $("#toasts").append(t);
  setTimeout(() => t.remove(), 3800);
}
const guard = (fn) => async (...a) => { try { return await fn(...a); } catch (e) { e.auth ? gate() : toast(e.message, true); } };

function ask(message, { typed, action = "Confirm", danger } = {}) {
  return new Promise((res) => {
    const input = typed ? h("input", { class: "inp", placeholder: `Type ${typed} to continue`, autocomplete: "off" }) : null;
    const ok = h("button", { class: "btn " + (danger ? "danger" : "primary"), disabled: !!typed, value: "ok" }, action);
    if (input) input.addEventListener("input", () => (ok.disabled = input.value !== typed));
    const d = h("dialog", { class: "modal small" },
      h("form", { method: "dialog" }, h("p", { class: "ask" }, message), input,
        h("div", { class: "actions" }, h("button", { class: "btn ghost", value: "no" }, "Cancel"), ok)));
    d.addEventListener("close", () => { res(d.returnValue === "ok"); d.remove(); });
    document.body.append(d); d.showModal(); input?.focus();
  });
}

function download(name, data) {
  const a = h("a", { href: URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })), download: name });
  document.body.append(a); a.click(); a.remove();
}
const pickJSON = () => new Promise((res, rej) => {
  const i = h("input", { type: "file", accept: "application/json,.json" });
  i.onchange = async () => { try { res(JSON.parse(await i.files[0].text())); } catch { rej(new Error("That file isn't valid JSON.")); } };
  i.click();
});

/* ---------- field helpers ---------- */
// t: t text, u url, n number, b bool, a textarea, j json, l list, c color, s select, r record reference
const F = (k, label, t = "t", x = {}) => ({ k, label, t, ...x });
function control(f, v, refs = {}) {
  let el;
  if (f.t === "b") el = h("input", { type: "checkbox", checked: !!v });
  else if (f.t === "a" || f.t === "j") el = h("textarea", { class: "inp", rows: f.t === "j" ? 5 : 3 }, f.t === "j" ? (v == null ? "" : JSON.stringify(v, null, 2)) : v ?? "");
  else if (f.t === "s" || f.t === "r") {
    const o = f.t === "s" ? f.o.map((x) => [x, x]) : [["", "None"], ...(refs[f.ref] || []).map((r) => [r.id, r.name || r.title || r.id])];
    el = h("select", { class: "inp" }, o.map(([val, l]) => h("option", { value: val, selected: val === v }, l)));
  } else el = h("input", { class: "inp", type: { n: "number", c: "color" }[f.t] || "text", step: f.t === "n" ? "any" : null,
    value: f.t === "l" ? (v || []).join(", ") : v ?? (f.t === "c" ? "#d6a85c" : "") });
  return el;
}
function read(f, el) {
  if (f.t === "b") return el.checked;
  const s = el.value.trim();
  if (f.t === "n") return s === "" ? null : Number(s);
  if (f.t === "j") return s ? JSON.parse(s) : null;
  if (f.t === "l") return s ? s.split(",").map((x) => x.trim()).filter(Boolean) : [];
  return s;
}
const fieldRow = (f, el) => h("label", { class: "field" + (f.t === "b" ? " switch" : "") }, h("span", {}, f.label), el);

/* ---------- collections ---------- */
const url = F("url", "Address", "u"), title = F("title", "Title"), favicon = F("favicon", "Icon address", "u"), pos = F("position", "Position", "n");
const C = (id, label, group, path, list, item, col, ops, fields, extra = {}) => ({ id, label, group, path, list, item, col, ops, fields, title: "title", sub: "url", ...extra });
const COLLECTIONS = [
  C("bookmarks", "Bookmarks", "Library", "bookmarks", "bookmarks", "bookmark", "browser_bookmarks", "cud",
    [title, url, F("folderId", "Folder", "r", { ref: "bookmark-folders" }), favicon, pos, F("tags", "Tags (comma separated)", "l")]),
  C("bookmark-folders", "Bookmark folders", "Library", "bookmark-folders", "folders", "folder", "browser_bookmark_folders", "cud",
    [F("name", "Name"), F("parentId", "Parent folder", "r", { ref: "bookmark-folders" }), pos], { title: "name", sub: "parentId" }),
  C("favorites", "Favorites", "Library", "favorites", "favorites", "favorite", "browser_favorites", "cud", [title, url, favicon, pos], { generic: 1 }),
  C("readingList", "Reading list", "Library", "readingList", "readingList", "item", "browser_reading_list", "cud",
    [title, url, F("read", "Already read", "b"), F("notes", "Notes", "a")], { generic: 1 }),
  C("savedPages", "Saved pages", "Library", "savedPages", "savedPages", "savedPage", "browser_saved_pages", "cud",
    [title, url, F("snapshot", "Page content", "a")], { generic: 1 }),
  C("collections", "Collections", "Library", "collections", "collections", "collection", "browser_collections", "cud",
    [F("name", "Name"), F("description", "Description", "a"), F("items", "Items (JSON)", "j")], { title: "name", sub: "description", generic: 1 }),
  C("notes", "Notes", "Library", "notes", "notes", "note", "browser_notes", "cud",
    [title, F("content", "Note", "a"), url, F("pinned", "Pinned", "b")], { sub: "content", generic: 1 }),

  C("history", "History", "Browsing", "history", "history", "entry", "browser_history", "c",
    [url, title, favicon, F("transition", "Transition"), F("visitCount", "Visit count", "n"), F("referrer", "Referrer", "u")], { bulk: 1 }),
  C("search-history", "Search history", "Browsing", "search-history", "history", "entry", "browser_search_history", "c",
    [F("query", "Query"), F("searchEngine", "Search engine")], { title: "query", sub: "searchEngine", bulk: 1 }),
  C("findHistory", "Find in page", "Browsing", "findHistory", "findHistory", "entry", "browser_find_history", "cud", [F("query", "Query")], { title: "query", sub: "", generic: 1 }),
  C("recently-closed", "Recently closed", "Browsing", "recently-closed", "records", "record", "browser_recently_closed", "cd",
    [F("type", "Type", "s", { o: ["tab", "window", "group"] }), title, url, F("tabs", "Tabs (JSON)", "j"), F("windows", "Windows (JSON)", "j")]),
  C("downloads", "Downloads", "Browsing", "downloads", "downloads", "download", "browser_downloads", "cud",
    [F("filename", "File name"), url, F("path", "Saved to"), F("mimeType", "File type"), F("size", "Size (bytes)", "n"),
     F("state", "State", "s", { o: ["completed", "in_progress", "paused", "cancelled", "failed"] }), F("startedAt", "Started"), F("completedAt", "Completed")],
    { title: "filename", sub: "mimeType" }),

  C("tabs", "Tabs", "Workspace", "tabs", "tabs", "tab", "browser_tabs", "cud",
    [url, title, favicon, F("windowId", "Window"), F("groupId", "Group", "r", { ref: "tab-groups" }), pos, F("zoom", "Zoom", "n"),
     F("active", "Active", "b"), F("pinned", "Pinned", "b"), F("muted", "Muted", "b"), F("audible", "Playing audio", "b"), F("loading", "Loading", "b")]),
  C("tab-groups", "Tab groups", "Workspace", "tab-groups", "groups", "group", "browser_tab_groups", "cud",
    [F("name", "Name"), F("color", "Color"), F("collapsed", "Collapsed", "b")], { title: "name", sub: "color" }),
  C("windows", "Windows", "Workspace", "windows", "windows", "window", "browser_windows", "cud",
    [F("windowId", "Window id"), F("type", "Type", "s", { o: ["normal", "private", "popup", "app"] }), F("maximized", "Maximized", "b"),
     F("fullscreen", "Fullscreen", "b"), F("focused", "Focused", "b"), F("bounds", "Bounds (JSON)", "j")], { title: "windowId", sub: "type" }),
  C("pinnedTabs", "Pinned tabs", "Workspace", "pinnedTabs", "pinnedTabs", "pinnedTab", "browser_pinned_tabs", "cud", [title, url, favicon, pos], { generic: 1 }),
  C("sessions", "Sessions", "Workspace", "sessions", "sessions", "session", "browser_sessions", "cd",
    [F("name", "Name"), F("tabs", "Tabs (JSON)", "j"), F("windows", "Windows (JSON)", "j")], { title: "name", sub: "" }),
  C("workspaces", "Workspaces", "Workspace", "workspaces", "workspaces", "workspace", "browser_workspaces", "cud",
    [F("name", "Name"), F("color", "Color"), F("tabs", "Tabs (JSON)", "j")], { title: "name", sub: "color", generic: 1 }),

  C("searchEngines", "Search engines", "Customize", "searchEngines", "searchEngines", "searchEngine", "browser_search_engines", "cud",
    [F("name", "Name"), F("keyword", "Keyword"), F("url", "Search address (use %s for the query)"), F("isDefault", "Default", "b")], { title: "name", generic: 1 }),
  C("shortcuts", "Shortcuts", "Customize", "shortcuts", "shortcuts", "shortcut", "browser_shortcuts", "cud",
    [F("name", "Name"), url, F("icon", "Icon", "u"), pos], { title: "name", generic: 1 }),
  C("extensions", "Extensions", "Customize", "extensions", "extensions", "extension", "browser_extensions", "cud",
    [F("name", "Name"), F("extensionId", "Extension id"), F("version", "Version"), F("description", "Description", "a"), F("enabled", "Enabled", "b"),
     F("updateUrl", "Update address", "u"), F("permissions", "Permissions (JSON array)", "j"), F("settings", "Settings (JSON)", "j")],
    { title: "name", sub: "description", defaults: { enabled: true }, toggle: "enabled" }),
  C("webApps", "Web apps", "Customize", "webApps", "webApps", "webApp", "browser_web_apps", "cud",
    [F("name", "Name"), url, F("icon", "Icon", "u"), F("display", "Display", "s", { o: ["standalone", "minimal-ui", "browser"] })], { title: "name", generic: 1 }),

  C("permissions", "Permissions", "Trust", "permissions", "permissions", "permission", "browser_permissions", "cud",
    [F("origin", "Site"), F("permission", "Permission"), F("state", "State", "s", { o: ["allow", "block", "prompt"] }), F("expiresAt", "Expires")],
    { title: "origin", sub: "permission" }),
  C("site-settings", "Site settings", "Trust", "site-settings", "settings", "setting", "browser_site_settings", "cud",
    [F("origin", "Site"), F("settings", "Settings (JSON)", "j")], { title: "origin", sub: "" }),
  C("autofill", "Autofill", "Trust", "autofill", "autofill", "autofill", "browser_autofill", "cud",
    [F("type", "Type", "s", { o: ["address", "contact", "identity", "custom"] }), F("label", "Label"), F("value", "Value"), F("metadata", "Metadata (JSON)", "j")],
    { title: "label", sub: "type" }),
  C("notifications", "Notifications", "Trust", "notifications", "notifications", "notification", "browser_notifications", "cud",
    [title, F("body", "Message", "a"), F("origin", "Site"), F("read", "Read", "b")], { sub: "body", generic: 1 }),
  C("devices", "Devices", "Trust", "devices", "devices", "device", "browser_devices", "cud",
    [F("name", "Name"), F("platform", "Platform"), F("lastSeenAt", "Last seen")], { title: "name", sub: "platform", generic: 1 }),
  C("security-events", "Security events", "Trust", "security-events", "events", "event", "browser_security_events", "c",
    [F("type", "Event"), F("severity", "Severity", "s", { o: ["info", "warning", "critical"] }), F("origin", "Site"), F("message", "Message", "a"), F("metadata", "Metadata (JSON)", "j")],
    { title: "type", sub: "message" }),
];
const BY_ID = Object.fromEntries(COLLECTIONS.map((c) => [c.id, c]));
const BY_PATH = Object.fromEntries(COLLECTIONS.map((c) => [c.path, c]));
const GROUPS = [...new Set(COLLECTIONS.map((c) => c.group))];
const S = { stats: {}, user: null };

/* ---------- appearance from synced settings ---------- */
function applyAppearance(s = {}) {
  const a = s.appearance || {}, r = document.documentElement;
  r.dataset.theme = a.theme || "system";
  r.dataset.compact = a.compactMode ? "1" : "0";
  if (a.accentColor) r.style.setProperty("--accent", a.accentColor);
  const acc = s.accessibility || {};
  r.dataset.contrast = acc.highContrast ? "high" : "";
  r.dataset.motion = acc.reducedMotion ? "reduce" : "";
  r.style.setProperty("--scale", acc.textScale || 1);
}

/* ---------- shell ---------- */
let main, omni;
function shell() {
  const app = $("#app"); app.className = "shell"; app.replaceChildren();
  omni = h("input", { class: "omni", type: "search", placeholder: "Filter this list, or jump to a section", "aria-label": "Search", autocomplete: "off" });
  main = h("main", { class: "main", id: "main" });
  const nav = h("nav", { class: "tabstrip", "aria-label": "Sections" },
    h("a", { class: "brand", href: "#/" }, h("span", { class: "mark" }, "F"), h("span", {}, "Fades Browser")),
    navLink("#/", "Overview", "overview"),
    GROUPS.map((g) => h("div", { class: "group", "data-g": g }, h("h3", {}, g),
      COLLECTIONS.filter((c) => c.group === g).map((c) => navLink("#/c/" + c.id, c.label, c.id, c.col)))),
    h("div", { class: "group" }, h("h3", {}, "Account"), navLink("#/settings", "Settings", "settings"), navLink("#/data", "Backup & sync", "data")));
  app.append(nav, h("div", { class: "stage" }, h("header", { class: "bar" }, h("div", { class: "omnibox" }, h("span", { class: "lock", "aria-hidden": "true" }), omni)), main),
    h("div", { id: "toasts", "aria-live": "polite" }));
  document.addEventListener("keydown", (e) => { if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); omni.focus(); } });
}
function navLink(href, label, id, col) {
  return h("a", { class: "tab", href, "data-id": id }, h("i", { style: `--h:${hue(id)}` }), h("span", {}, label), col ? h("b", { "data-col": col }, "") : null);
}
function paintNav(id) {
  document.querySelectorAll(".tab").forEach((a) => a.classList.toggle("on", a.dataset.id === id));
  document.querySelectorAll("[data-col]").forEach((b) => { const n = S.stats[b.dataset.col]; b.textContent = n ? n : ""; });
}
function gate() {
  const app = $("#app"); app.className = "gate"; app.replaceChildren(
    h("div", { class: "gate-card" }, h("span", { class: "mark big" }, "F"), h("h1", {}, "Sign in to open your browser data"),
      h("p", {}, "Your bookmarks, history and settings are tied to your Fades account."),
      h("a", { class: "btn primary", href: LOGIN }, "Sign in"), h("button", { class: "btn ghost", onclick: boot }, "I've signed in")), h("div", { id: "toasts" }));
}

/* ---------- views ---------- */
const head = (t, sub, ...actions) => h("div", { class: "pagehead" }, h("div", {}, h("h1", {}, t), sub && h("p", {}, sub)), h("div", { class: "actions" }, actions));
const card = (t, ...k) => h("section", { class: "card" }, t && h("h2", {}, t), k);
const empty = (msg, cta) => h("div", { class: "empty" }, h("p", {}, msg), cta);
function setView(id, ...nodes) { omni.value = ""; omni.oninput = null; main.replaceChildren(...nodes); paintNav(id); main.focus({ preventScroll: true }); window.scrollTo(0, 0); }
async function refreshStats() { try { S.stats = (await api("stats")).stats; paintNav($(".tab.on")?.dataset.id); } catch {} }

async function viewOverview() {
  const [acc, cap, sync, health] = await Promise.all([api("account"), api("capabilities"), api("sync/status"), api("health")]);
  await refreshStats(); S.user = acc.user;
  const u = acc.user, st = sync.status;
  const total = Object.values(S.stats).reduce((a, b) => a + b, 0);
  const syncBtn = (label, fn) => h("button", { class: "btn", onclick: guard(fn) }, label);
  const pill = h("span", { class: "pill " + (st.status === "synced" ? "ok" : "") }, st.status);
  const tiles = COLLECTIONS.map((c) => [c, S.stats[c.col] || 0]).sort((a, b) => b[1] - a[1]);
  setView("overview",
    head(`Welcome back, ${u.displayName || u.username || "there"}`, `${total.toLocaleString()} items stored across ${tiles.filter((t) => t[1]).length} collections.`),
    h("div", { class: "grid two" },
      card("Account", h("dl", { class: "kv" },
        h("dt", {}, "Email"), h("dd", {}, u.email || "—", u.emailVerified ? h("span", { class: "pill ok" }, "verified") : h("span", { class: "pill" }, "unverified")),
        h("dt", {}, "Username"), h("dd", {}, u.username || "—"), h("dt", {}, "Plan"), h("dd", {}, u.plan, u.proSince ? ` since ${fmt(u.proSince)}` : ""),
        h("dt", {}, "Member since"), h("dd", {}, fmt(u.createdAt) || "—"), h("dt", {}, "Service"), h("dd", {}, `${health.service} v${health.version} · ${health.status}`))),
      card("Sync", h("div", { class: "syncrow" }, pill, h("span", {}, `Version ${st.syncVersion}`)),
        h("dl", { class: "kv" }, h("dt", {}, "Last sync"), h("dd", {}, fmt(st.lastSyncAt) || "Never"),
          h("dt", {}, "Last pull"), h("dd", {}, fmt(st.lastPullAt) || "Never"), h("dt", {}, "Last push"), h("dd", {}, fmt(st.lastPushAt) || "Never")),
        h("div", { class: "actions" }, syncBtn("Pull everything", async () => { await pullSync(); viewOverview(); }), h("a", { class: "btn ghost", href: "#/data" }, "More options")))),
    card("Your data", h("div", { class: "tiles" }, tiles.map(([c, n]) =>
      h("a", { class: "tile" + (n ? "" : " zero"), href: "#/c/" + c.id, style: `--h:${hue(c.id)}` }, h("strong", {}, n.toLocaleString()), h("span", {}, c.label))))),
    h("div", { class: "grid two" },
      card("Synced to your account", h("div", { class: "chips" }, Object.entries(cap.browser).map(([k, v]) => h("span", { class: "chip" + (v ? " on" : "") }, k.replace(/([A-Z])/g, " $1").toLowerCase())))),
      card("Stays on this device", h("p", { class: "muted" }, "These never reach the cloud, even when sync is on."),
        h("div", { class: "chips" }, Object.keys(cap.localOnly).map((k) => h("span", { class: "chip local" }, k.replace(/([A-Z])/g, " $1").toLowerCase()))))));
  omni.placeholder = "Jump to a section";
  omni.onkeydown = (e) => { if (e.key === "Enter") { const q = omni.value.toLowerCase(); const m = COLLECTIONS.find((c) => c.label.toLowerCase().includes(q)); if (m) location.hash = "#/c/" + m.id; } };
}

async function viewCollection(c) {
  const d = await api(c.path, { query: { limit: 500 } });
  let rows = d[c.list] || [];
  const body = h("div", { class: "list" });
  const reload = guard(async () => { viewCollection(c); refreshStats(); });
  const paint = () => {
    const q = omni.value.trim().toLowerCase();
    const shown = q ? rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q)) : rows;
    body.replaceChildren(...(shown.length ? shown.map((r) => item(c, r, reload)) :
      [empty(q ? "Nothing matches that filter." : `No ${c.label.toLowerCase()} yet.`, c.ops.includes("c") && !q ? h("button", { class: "btn primary", onclick: () => openForm(c, null, reload) }, "Add one") : null)]));
  };
  const acts = [];
  if (c.bulk) acts.push(h("button", { class: "btn danger ghost", onclick: guard(async () => {
    if (await ask(`Clear all ${c.label.toLowerCase()}? This can't be undone.`, { action: "Clear all", danger: true })) {
      const r = await api(c.path, { method: "DELETE" }); toast(`Cleared ${r.deleted} items.`); reload(); } }) }, "Clear all"));
  if (c.ops.includes("c")) acts.push(h("button", { class: "btn primary", onclick: () => openForm(c, null, reload) }, "Add"));
  setView(c.id, head(c.label, `${rows.length}${rows.length === 500 ? "+" : ""} items`, acts), body);
  omni.placeholder = `Filter ${c.label.toLowerCase()}`; omni.oninput = paint; paint();
}

function item(c, r, reload) {
  const t = r[c.title] || r.name || r.title || r.url || r.id;
  const sub = c.sub ? (Array.isArray(r[c.sub]) ? r[c.sub].join(", ") : r[c.sub]) : "";
  const when = r.visitedAt || r.searchedAt || r.closedAt || r.startedAt || r.timestamp || r.savedAt || r.updatedAt || r.createdAt;
  const chips = c.fields.filter((f) => (f.t === "b" && r[f.k]) || (f.t === "s" && r[f.k] && f.k !== c.title)).map((f) => h("span", { class: "chip" }, f.t === "b" ? f.label.toLowerCase() : r[f.k]));
  const icon = r.favicon ? h("img", { class: "ico", src: r.favicon, alt: "", loading: "lazy", onerror: (e) => e.target.replaceWith(letter(t)) }) : letter(t);
  const link = c.sub === "url" && r.url && /^https?:/.test(r.url);
  const toggle = c.toggle && h("label", { class: "toggle", title: c.toggle }, h("input", { type: "checkbox", checked: !!r[c.toggle],
    onchange: guard(async (e) => { await api(`${c.path}/${r.id}`, { method: "PUT", body: { [c.toggle]: e.target.checked } }); toast("Saved"); }) }), h("span"));
  return h("article", { class: "row" }, icon,
    h("div", { class: "txt" }, h("strong", {}, link ? h("a", { href: r.url, target: "_blank", rel: "noopener noreferrer" }, t) : t),
      sub && h("span", { class: "sub" }, String(sub).slice(0, 140)), h("div", { class: "meta" }, chips, when && h("time", {}, fmt(when)))),
    toggle, c.ops.includes("u") && h("button", { class: "btn ghost sm", onclick: () => openForm(c, r, reload) }, "Edit"),
    c.ops.includes("d") && h("button", { class: "btn ghost sm danger", onclick: guard(async () => {
      if (await ask(`Delete “${String(t).slice(0, 60)}”?`, { action: "Delete", danger: true })) { await api(`${c.path}/${r.id}`, { method: "DELETE" }); toast("Deleted"); reload(); } }) }, "Delete"));
}
const letter = (t) => h("span", { class: "ico letter", style: `--h:${hue(String(t))}` }, (String(t).replace(/^\W+/, "")[0] || "·").toUpperCase());

const openForm = guard(async (c, rec, done) => {
  const refs = {};
  for (const f of c.fields) if (f.ref && !refs[f.ref]) { const rc = BY_PATH[f.ref]; refs[f.ref] = (await api(rc.path, { query: { limit: 500 } }))[rc.list].filter((x) => x.id !== rec?.id); }
  const els = c.fields.map((f) => control(f, rec ? rec[f.k] : c.defaults?.[f.k], refs));
  const extra = c.generic && rec ? h("textarea", { class: "inp", rows: 3, placeholder: "{ }" }) : null;
  const err = h("p", { class: "formerr", role: "alert" });
  const d = h("dialog", { class: "modal" }, h("form", { method: "dialog" },
    h("h2", {}, `${rec ? "Edit" : "Add"} ${c.label.toLowerCase().replace(/s$/, "")}`),
    h("div", { class: "fields" }, c.fields.map((f, i) => fieldRow(f, els[i])), extra && h("label", { class: "field" }, h("span", {}, "Extra fields (JSON)"), extra)), err,
    h("div", { class: "actions" }, h("button", { class: "btn ghost", value: "no", formnovalidate: true }, "Cancel"), h("button", { class: "btn primary", value: "ok" }, rec ? "Save changes" : "Add"))));
  d.addEventListener("close", () => d.remove());
  d.querySelector("form").addEventListener("submit", async (e) => {
    if (e.submitter?.value !== "ok") return;
    e.preventDefault(); err.textContent = "";
    const body = {};
    try {
      c.fields.forEach((f, i) => { const v = read(f, els[i]); if (rec || (v !== null && v !== "")) body[f.k] = v; });
      if (extra?.value.trim()) Object.assign(body, JSON.parse(extra.value));
    } catch { err.textContent = "One of the JSON fields isn't valid. Check the brackets and quotes."; return; }
    try {
      await api(rec ? `${c.path}/${rec.id}` : c.path, { method: rec ? "PUT" : "POST", body });
      toast(rec ? "Changes saved" : "Added"); d.close("ok"); done();
    } catch (x) { x.auth ? gate() : (err.textContent = x.message); }
  });
  document.body.append(d); d.showModal(); els[0]?.focus();
});

/* settings */
const B = (k, l) => F(k, l, "b");
const SECTIONS = [
  { t: "Startup", get: "settings", put: "settings", fields: [F("homepage", "Homepage"), F("startupMode", "On startup", "s", { o: ["new-tab", "homepage", "restore"] }), F("defaultSearchEngine", "Default search engine"), B("restorePreviousSession", "Restore previous session")] },
  { t: "Appearance", get: "settings", put: "settings", key: "appearance", fields: [F("theme", "Theme", "s", { o: ["system", "light", "dark"] }), F("accentColor", "Accent color", "c"), B("compactMode", "Compact lists")] },
  { t: "Privacy", get: "privacy", put: "privacy", fields: [B("doNotTrack", "Send Do Not Track"), B("blockThirdPartyCookies", "Block third-party cookies"), B("clearDataOnExit", "Clear data on exit"), B("sendUsageStatistics", "Share usage statistics")] },
  { t: "Security", get: "settings", put: "settings", key: "security", fields: [B("safeBrowsing", "Safe browsing"), B("httpsOnly", "HTTPS only")] },
  { t: "Downloads", get: "settings", put: "settings", key: "downloads", fields: [B("askWhereToSave", "Ask where to save each file"), F("defaultDirectory", "Default folder")] },
  { t: "Language", get: "settings", put: "settings", key: "language", fields: [F("primary", "Primary language"), F("languages", "Languages (comma separated)", "l")] },
  { t: "Accessibility", get: "settings", put: "settings", key: "accessibility", fields: [B("reducedMotion", "Reduce motion"), B("highContrast", "High contrast"), F("textScale", "Text size (1 = normal)", "n")] },
  { t: "Toolbar", get: "settings", put: "settings", key: "toolbar", fields: [B("showHomeButton", "Home button"), B("showBookmarksButton", "Bookmarks button"), B("showDownloadsButton", "Downloads button"), B("showExtensionsButton", "Extensions button")] },
  { t: "New tab page", get: "settings", put: "settings", key: "newTab", fields: [B("showShortcuts", "Shortcuts"), B("showBookmarks", "Bookmarks"), B("showHistory", "History")] },
  { t: "Profile", get: "profile", put: "profile", fields: [F("browserName", "Browser name"), F("avatar", "Avatar address", "u"), F("profileColor", "Profile color", "c")] },
  { t: "Diagnostics", get: "telemetry", put: "telemetry", fields: [B("enabled", "Allow diagnostics"), B("crashReports", "Crash reports"), B("performanceReports", "Performance reports"), B("usageStatistics", "Usage statistics")] },
];
async function viewSettings() {
  const [settings, privacy, profile, telemetry, flags] = await Promise.all([api("settings"), api("privacy"), api("profile"), api("telemetry"), api("feature-flags")]);
  const data = { settings: settings.settings, privacy: privacy.privacy, profile: profile.profile, telemetry: telemetry.telemetry };
  applyAppearance(settings.settings);
  const cards = SECTIONS.map((s) => {
    const src = s.key ? data[s.get][s.key] || {} : data[s.get];
    const els = s.fields.map((f) => control(f, src[f.k]));
    const form = h("form", { class: "card form", onsubmit: guard(async (e) => {
      e.preventDefault();
      const vals = Object.fromEntries(s.fields.map((f, i) => [f.k, read(f, els[i])]));
      const body = s.key ? { [s.key]: { ...src, ...vals } } : vals;
      const r = await api(s.put, { method: "PUT", body });
      if (s.get === "settings") { data.settings = r.settings; applyAppearance(r.settings); }
      toast(`${s.t} saved`);
    }) }, h("h2", {}, s.t), h("div", { class: "fields" }, s.fields.map((f, i) => fieldRow(f, els[i]))),
      h("div", { class: "actions" }, h("button", { class: "btn primary" }, "Save changes")));
    return form;
  });
  const flagRows = h("div", { class: "flags" });
  const addFlag = (k = "", v = "") => flagRows.append(h("div", { class: "flag" }, h("input", { class: "inp", placeholder: "name", value: k }),
    h("input", { class: "inp", placeholder: "value (true, 3, \"text\")", value: v === "" ? "" : JSON.stringify(v) }),
    h("button", { type: "button", class: "btn ghost sm danger", onclick: (e) => e.target.closest(".flag").remove() }, "Remove")));
  Object.entries(flags.flags).forEach(([k, v]) => addFlag(k, v));
  const flagCard = h("section", { class: "card" }, h("h2", {}, "Feature flags"), flagRows,
    h("div", { class: "actions" }, h("button", { class: "btn ghost", onclick: () => addFlag() }, "Add flag"),
      h("button", { class: "btn primary", onclick: guard(async () => {
        const out = {};
        for (const r of flagRows.children) { const [k, v] = r.querySelectorAll("input"); if (!k.value.trim()) continue; try { out[k.value.trim()] = JSON.parse(v.value); } catch { out[k.value.trim()] = v.value; } }
        await api("feature-flags", { method: "PUT", body: out }); toast("Flags saved"); }) }, "Save changes")));
  setView("settings", head("Settings", "These sync to every device signed in to your account."), h("div", { class: "grid two" }, cards, flagCard));
  omni.placeholder = "Jump to a section";
}

/* backup & sync */
async function pullSync() { const d = await api("sync"); download(`fades-sync-${new Date().toISOString().slice(0, 10)}.json`, d); toast("Sync pulled and saved to a file"); refreshStats(); }
async function viewData() {
  const out = h("pre", { class: "result", hidden: true });
  const show = (title, r) => { out.hidden = false; out.textContent = title + "\n" + JSON.stringify(r.results || r.deleted || r, null, 2); out.scrollIntoView({ block: "nearest" }); refreshStats(); };
  const before = h("input", { class: "inp", type: "datetime-local" }), site = h("input", { class: "inp", placeholder: "https://example.com/page" });
  const act = (label, fn, cls = "") => h("button", { class: "btn " + cls, onclick: guard(fn) }, label);
  setView("data", head("Backup & sync", "Move your browser data in and out of your account."),
    h("div", { class: "grid two" },
      card("Sync", h("p", { class: "muted" }, "Pull downloads a full copy. Push merges a file into your account — the newest edit of each item wins."),
        h("div", { class: "actions" }, act("Pull", pullSync), act("Push from file", async () => {
          const j = await pickJSON(); const r = await api("sync", { method: "POST", body: { data: j.data || j } }); show("Push complete", r); toast("Pushed"); }, "primary"))),
      card("Export & restore", h("p", { class: "muted" }, "Export is a complete backup. Restore overwrites matching items with the file's version."),
        h("div", { class: "actions" }, act("Export backup", async () => { const r = await api("export"); download(`fades-browser-export-${new Date().toISOString().slice(0, 10)}.json`, r); toast("Backup saved"); }),
          act("Restore from file", async () => {
            const j = await pickJSON(); if (!(await ask("Restore this backup into your account?", { action: "Restore" }))) return;
            const r = await api("restore", { method: "POST", body: { export: j.export || j } }); show("Restore complete", r); toast("Restored"); }, "primary")))),
    card("Clear browsing history", h("div", { class: "fields inline" },
      h("label", { class: "field" }, h("span", {}, "Older than"), before), h("label", { class: "field" }, h("span", {}, "Only this address"), site)),
      h("div", { class: "actions" }, act("Clear history", async () => {
        const b = before.value ? new Date(before.value).toISOString() : "";
        if (!(await ask(b || site.value ? "Clear the matching history?" : "Clear all history?", { action: "Clear", danger: true }))) return;
        const r = await api("history", { method: "DELETE", query: { before: b, url: site.value.trim() } }); show("History cleared", r); toast(`Removed ${r.deleted} entries`); }, "danger"),
        act("Clear search history", async () => { if (await ask("Clear all search history?", { action: "Clear", danger: true })) { const r = await api("search-history", { method: "DELETE" }); show("Search history cleared", r); } }, "danger"))),
    out,
    card("Delete cloud data", h("p", { class: "muted" }, "Removes everything Fades Browser has stored for your account in the cloud. Data on your devices isn't touched. Export a backup first."),
      h("div", { class: "actions" }, act("Delete all cloud data", async () => {
        if (!(await ask("This permanently deletes all your synced browser data.", { typed: "DELETE", action: "Delete everything", danger: true }))) return;
        const r = await api("data", { method: "DELETE" }); show(r.message, r); toast("Cloud data deleted"); }, "danger"))));
  omni.placeholder = "Jump to a section";
}

/* ---------- router ---------- */
const route = guard(async () => {
  const [, kind, id] = (location.hash || "#/").split("/");
  if (kind === "c" && BY_ID[id]) return viewCollection(BY_ID[id]);
  if (kind === "settings") return viewSettings();
  if (kind === "data") return viewData();
  return viewOverview();
});
async function boot() {
  try { shell(); await api("account").then((r) => (S.user = r.user)); } catch (e) { return e.auth ? gate() : ($("#app").textContent = e.message); }
  api("settings").then((r) => applyAppearance(r.settings)).catch(() => {});
  route();
}
window.addEventListener("hashchange", route);
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot();
})();
