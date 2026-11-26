/* ROYAL TABLE — Service Worker مشترك للتطبيقات الثلاثة (المنيو / الكاشير / الإدارة)
   يخزّن واجهة التطبيق فقط. طلبات Firebase (الطلبات، الدخول، المنتجات) لا يتدخل فيها أبداً. */
const CACHE = 'royal-table-v1', SHELL = './__shell__';
const LIVE = /(firestore|identitytoolkit|securetoken|firebaseinstallations|firebaseio)\.googleapis\.com|firebaseapp\.com\/__\/auth/;
const STATIC = /fonts\.(googleapis|gstatic)\.com|gstatic\.com\/firebasejs|unpkg\.com|cdnjs\.cloudflare\.com/;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || LIVE.test(r.url)) return;
  if (r.mode === 'navigate') {            // الصفحة: الشبكة أولاً ثم النسخة المخزنة
    const u = new URL(r.url);
    const virt = new RegExp('^' + new URL(self.registration.scope).pathname + '(cashier|manager)(/(index\\.html)?)?$', 'i').test(u.pathname);
    const req = virt ? new Request(new URL('index.html', self.registration.scope)) : r;   // /cashier/ و /manager/ ← index.html
    e.respondWith(fetch(req).then(async res => {
      if (!res.ok) return res;
      const html = await res.blob();
      const c1 = new Response(html, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } });
      caches.open(CACHE).then(x => { x.put(virt ? r : req, c1.clone()); x.put(SHELL, c1.clone()); });
      return virt ? c1 : new Response(html, { status: 200, headers: res.headers });
    }).catch(() => caches.match(r).then(m => m || caches.match(SHELL))));
  } else if (STATIC.test(r.url)) {        // الخطوط والمكتبات: من المخزن ثم تحديث بالخلفية
    e.respondWith(caches.open(CACHE).then(c => c.match(r).then(m => {
      const f = fetch(r).then(res => { if (res.ok || res.type === 'opaque') c.put(r, res.clone()); return res; }).catch(() => m);
      return m || f;
    })));
  }
});
