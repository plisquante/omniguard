/* OmniGuard site — theme, navigation, search, copy buttons, scroll effects. No dependencies. */
(function () {
  'use strict';
  var root = document.body.getAttribute('data-root') || '';
  var docsBase = root + 'docs/';

  // ── theme ────────────────────────────────────────────────
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('og-theme', t); } catch (e) { /* private mode */ }
  }
  var themeBtn = document.getElementById('theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    });
  }

  // ── translations ─────────────────────────────────────────
  var lang = window.OG_LANG || 'en';
  var dict = null;
  function t(key, fallback) { return (dict && dict[key]) || fallback; }
  function applyLang(d) {
    dict = d;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = d[el.getAttribute('data-i18n')];
      if (v !== undefined) { el.innerHTML = v; }
    });
    [['content', 'content'], ['aria', 'aria-label'], ['ph', 'placeholder']].forEach(function (pair) {
      document.querySelectorAll('[data-i18n-' + pair[0] + ']').forEach(function (el) {
        var v = d[el.getAttribute('data-i18n-' + pair[0])];
        if (v !== undefined) { el.setAttribute(pair[1], v); }
      });
    });
    var title = document.querySelector('title[data-i18n]');
    if (title) { document.title = title.textContent; }
    document.querySelectorAll('.copy').forEach(function (b) { b.textContent = t('ui.copy', 'Copy'); });
    document.documentElement.classList.remove('i18n-pending');
    document.documentElement.classList.toggle('lang-en', lang === 'en');
  }
  var page = document.body.getAttribute('data-page');
  var enDoc = null;
  function loadLang(code) {
    var ui = fetch(root + 'assets/i18n/' + code + '.json').then(function (r) { return r.json(); });
    if (!page) { return ui; }
    var doc = code === 'en' ? Promise.resolve(enDoc)
      : fetch(root + 'assets/i18n/docs/' + code + '/' + page + '.json').then(function (r) { return r.json(); });
    return Promise.all([ui, doc]).then(function (r) { applyDoc(r[1]); return r[0]; });
  }
  function applyDoc(d) {
    var art = document.querySelector('.prose');
    var toc = document.querySelector('.toc');
    if (!d || !art) { return; }
    art.innerHTML = d.b;
    if (toc) { toc.querySelectorAll('a').forEach(function (a) { a.remove(); }); toc.insertAdjacentHTML('beforeend', d.c); }
    document.title = d.t + ' · OmniGuard Docs';
    index = null;
    decorate();
    if (location.hash) { var h = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (h) { h.scrollIntoView(); } }
  }
  if (page) {
    var art0 = document.querySelector('.prose');
    enDoc = { t: (document.querySelector('.prose h1') || {}).textContent.replace(/#$/, ''), b: art0.innerHTML, c: Array.prototype.map.call(document.querySelectorAll('.toc a'), function (a) { return a.outerHTML; }).join('') };
  }
  document.documentElement.classList.toggle('lang-en', lang === 'en');
  var code = document.querySelector('.lang-code');
  if (code) { code.textContent = lang.toUpperCase(); }
  if (lang !== 'en') {
    loadLang(lang).then(applyLang).catch(function () { document.documentElement.classList.remove('i18n-pending'); });
  }
  var langBtn = document.getElementById('lang');
  var langMenu = document.getElementById('lang-menu');
  if (langBtn && langMenu) {
    langMenu.querySelectorAll('[data-lang]').forEach(function (b) {
      if (b.getAttribute('data-lang') === lang) { b.classList.add('on'); }
      b.addEventListener('click', function () {
        lang = b.getAttribute('data-lang');
        try { localStorage.setItem('og-lang', lang); } catch (e) { /* private mode */ }
        document.documentElement.lang = lang;
        if (code) { code.textContent = lang.toUpperCase(); }
        langMenu.querySelectorAll('[data-lang]').forEach(function (x) { x.classList.toggle('on', x === b); });
        langMenu.classList.remove('open');
        langBtn.setAttribute('aria-expanded', 'false');
        loadLang(lang).then(applyLang);
      });
    });
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = langMenu.classList.toggle('open');
      langBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.lang')) { langMenu.classList.remove('open'); langBtn.setAttribute('aria-expanded', 'false'); }
    });
  }

  // ── mobile navigation drawer ─────────────────────────────
  var menu = document.getElementById('menu');
  var backdrop = document.getElementById('drawer-backdrop');
  function setDrawer(open) {
    document.body.classList.toggle('nav-open', open);
    if (menu) { menu.setAttribute('aria-expanded', open ? 'true' : 'false'); }
  }
  if (menu) {
    menu.addEventListener('click', function (e) { e.stopPropagation(); setDrawer(!document.body.classList.contains('nav-open')); });
    if (backdrop) { backdrop.addEventListener('click', function () { setDrawer(false); }); }
    document.querySelectorAll('.drawer a').forEach(function (a) { a.addEventListener('click', function () { setDrawer(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setDrawer(false); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 860) { setDrawer(false); } });
  }

  // ── copy buttons and table-of-contents scroll spy (re-run after a translated article is swapped in) ──
  var spy = null;
  function decorate() {
  document.querySelectorAll('.hl').forEach(function (block) {
    var btn = document.createElement('button');
    btn.className = 'copy';
    btn.type = 'button';
    btn.textContent = t('ui.copy', 'Copy');
    btn.addEventListener('click', function () {
      var text = block.querySelector('pre').innerText;
      var done = function () { btn.textContent = t('ui.copied', 'Copied'); setTimeout(function () { btn.textContent = t('ui.copy', 'Copy'); }, 1400); };
      if (navigator.clipboard) { navigator.clipboard.writeText(text).then(done, done); } else { done(); }
    });
    block.appendChild(btn);
  });

  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc a'));
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    if (spy) { spy.disconnect(); }
    spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && byId[en.target.id]) {
          tocLinks.forEach(function (a) { a.classList.remove('on'); });
          byId[en.target.id].classList.add('on');
        }
      });
    }, { rootMargin: '-80px 0px -70% 0px' });
    Object.keys(byId).forEach(function (id) { var h = document.getElementById(id); if (h) { spy.observe(h); } });
  }
  }
  decorate();

  // ── reveal on scroll ─────────────────────────────────────
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // ── live log on the landing page ─────────────────────────
  var log = document.getElementById('log');
  if (log) {
    var lines = [
      '<span class="tag">[OmniGuard]</span> Atk_81 &gt; <span class="red">book</span> book edit in slot 77 <span class="red">[kicked]</span>',
      '<span class="tag">[OmniGuard]</span> 185.x.x.12 <span class="yel">connection flood</span> &mdash; 212 refused',
      '<span class="tag">[OmniGuard]</span> <span class="red">DUPE</span> elytra 0495b4&hellip; player Steve &rarr; chest 3 -60 -4',
      '<span class="tag">[OmniGuard]</span> Kiddo &gt; <span class="red">invalid-movement</span> non-finite position',
      '<span class="tag">[OmniGuard]</span> <span class="yel">redstone</span> chunk 10,10 &gt; 900 updates/s, frozen 10s',
      '<span class="tag">[OmniGuard]</span> <span class="red">ATTACK MODE</span> 214 logins/s &mdash; limits tightened',
      '<span class="tag">[OmniGuard]</span> 10 players on 85.x.x.4 joined <span class="ok2">&mdash; trusted IP, no limits</span>',
      '<span class="tag">[OmniGuard]</span> X_Ray &gt; <span class="red">packet-rate</span> CLICK_WINDOW &gt; 60/s <span class="red">[kicked]</span>',
      '<span class="tag">[OmniGuard]</span> <span class="ok2">Attack mode ended</span> after 32s &mdash; 1 980 connections refused'
    ];
    var i = 0;
    var push = function () {
      var div = document.createElement('div');
      div.innerHTML = lines[i % lines.length];
      log.appendChild(div);
      while (log.children.length > 7) { log.removeChild(log.firstChild); }
      i++;
    };
    for (var k = 0; k < 5; k++) { push(); }
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setInterval(push, 1900); }
  }

  // ── search ───────────────────────────────────────────────
  var modal = document.getElementById('search');
  var input = modal && modal.querySelector('input');
  var results = modal && modal.querySelector('.results');
  var index = null;
  var selected = 0;

  function escapeHtml(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function load() {
    if (index) { return Promise.resolve(index); }
    return fetch(docsBase + (lang === 'en' ? 'search.json' : 'search.' + lang + '.json')).then(function (r) { return r.json(); }).then(function (j) { index = j; return j; });
  }
  function open() {
    if (!modal) { return; }
    modal.classList.add('open');
    input.value = '';
    results.innerHTML = '<div class="empty">' + t('search.hint', 'Type to search the documentation') + '</div>';
    setTimeout(function () { input.focus(); }, 10);
    load();
  }
  function close() { if (modal) { modal.classList.remove('open'); } }
  function run(q) {
    q = q.trim().toLowerCase();
    if (!q) { results.innerHTML = '<div class="empty">' + t('search.hint', 'Type to search the documentation') + '</div>'; return; }
    var words = q.split(/\s+/);
    var hits = [];
    index.forEach(function (p) {
      var hay = (p.t + ' ' + p.x).toLowerCase();
      var score = 0;
      for (var w = 0; w < words.length; w++) {
        var pos = hay.indexOf(words[w]);
        if (pos < 0) { return; }
        score += (p.t.toLowerCase().indexOf(words[w]) >= 0 ? 10 : 1) + (pos < 200 ? 1 : 0);
      }
      var at = p.x.toLowerCase().indexOf(words[0]);
      var start = Math.max(0, at - 50);
      var snippet = escapeHtml(p.x.substr(start, 150));
      words.forEach(function (w) {
        if (w.length > 1) { snippet = snippet.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); }
      });
      hits.push({ p: p, s: score, snip: (start > 0 ? '…' : '') + snippet + '…' });
    });
    hits.sort(function (a, b) { return b.s - a.s; });
    selected = 0;
    results.innerHTML = hits.length ? hits.slice(0, 12).map(function (h, n) {
      return '<a href="' + docsBase + h.p.u + '"' + (n === 0 ? ' class="sel"' : '') + '><b>' + escapeHtml(h.p.t) + '</b><span>' + h.snip + '</span></a>';
    }).join('') : '<div class="empty">' + t('search.none', 'No results for') + ' “' + escapeHtml(q) + '”</div>';
  }
  if (modal) {
    document.querySelectorAll('[data-search]').forEach(function (b) { b.addEventListener('click', open); });
    modal.addEventListener('click', function (e) { if (e.target === modal) { close(); } });
    input.addEventListener('input', function () { load().then(function () { run(input.value); }); });
    input.addEventListener('keydown', function (e) {
      var items = results.querySelectorAll('a');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!items.length) { return; }
        items[selected].classList.remove('sel');
        selected = (selected + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length;
        items[selected].classList.add('sel');
        items[selected].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter' && items[selected]) {
        window.location.href = items[selected].getAttribute('href');
      }
    });
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName))) {
        e.preventDefault(); open();
      } else if (e.key === 'Escape') { close(); }
    });
  }
})();
