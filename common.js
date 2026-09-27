// Shared helpers for all tool pages
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const num = (id) => { const v = parseFloat(String($('#' + id).value).replace(/,/g, '')); return isNaN(v) ? 0 : v; };
const inr = (n, d = 0) => '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: d, minimumFractionDigits: d });
const fmt = (n, d = 2) => Number(n).toLocaleString('en-IN', { maximumFractionDigits: d });
const store = {
  get(k, def) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
function bar(parts) { // parts: [{v, c, label}]
  const t = parts.reduce((a, p) => a + Math.max(p.v, 0), 0) || 1;
  return '<div class="bar">' + parts.map(p => `<i style="width:${(Math.max(p.v, 0) / t * 100).toFixed(2)}%;background:${p.c}"></i>`).join('') + '</div>' +
    '<div class="legend">' + parts.map(p => `<span style="--c:${p.c}">${p.label}</span>`).join('') + '</div>';
}
function kv(rows) { return rows.map(([k, v]) => `<div class="kv"><span>${k}</span><b>${v}</b></div>`).join(''); }
// Auto-recalculate on input
function live(fn) { $$('input,select,textarea').forEach(el => el.addEventListener('input', fn)); fn(); }

// Theme toggle
(function () {
  const saved = store.get('theme', null);
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  document.addEventListener('DOMContentLoaded', () => {
    const b = $('#themeBtn'); if (!b) return;
    b.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') ||
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const nx = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nx); store.set('theme', nx);
    });
    // Remember recently used tools (shown on home page)
    const slug = document.body.dataset.slug;
    if (slug) { let r = store.get('recent', []).filter(x => x !== slug); r.unshift(slug); store.set('recent', r.slice(0, 6)); }
    const sh = $('#shareBtn');
    if (sh) sh.addEventListener('click', async () => {
      const data = { title: document.title, url: location.href };
      if (navigator.share) { try { await navigator.share(data); } catch (e) {} }
      else { window.open('https://wa.me/?text=' + encodeURIComponent(document.title + ' ' + location.href), '_blank'); }
    });
  });
})();
