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

  // ── mobile navigation ────────────────────────────────────
  var menu = document.getElementById('menu');
  if (menu) {
    menu.addEventListener('click', function () { document.body.classList.toggle('nav-open'); });
    document.addEventListener('click', function (e) {
      if (document.body.classList.contains('nav-open') && !e.target.closest('.sidebar') && !e.target.closest('#menu')) {
        document.body.classList.remove('nav-open');
      }
    });
  }

  // ── copy buttons on code blocks ──────────────────────────
  document.querySelectorAll('.hl').forEach(function (block) {
    var btn = document.createElement('button');
    btn.className = 'copy';
    btn.type = 'button';
    btn.textContent = 'Copy';
    btn.addEventListener('click', function () {
      var text = block.querySelector('pre').innerText;
      var done = function () { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy'; }, 1400); };
      if (navigator.clipboard) { navigator.clipboard.writeText(text).then(done, done); } else { done(); }
    });
    block.appendChild(btn);
  });

  // ── table of contents scroll spy ─────────────────────────
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc a'));
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && byId[en.target.id]) {
          tocLinks.forEach(function (a) { a.classList.remove('on'); });
          byId[en.target.id].classList.add('on');
        }
      });
    }, { rootMargin: '-80px 0px -70% 0px' });
    Object.keys(byId).forEach(function (id) { var h = document.getElementById(id); if (h) { spy.observe(h); } });
  }

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
    return fetch(docsBase + 'search.json').then(function (r) { return r.json(); }).then(function (j) { index = j; return j; });
  }
  function open() {
    if (!modal) { return; }
    modal.classList.add('open');
    input.value = '';
    results.innerHTML = '<div class="empty">Type to search the documentation</div>';
    setTimeout(function () { input.focus(); }, 10);
    load();
  }
  function close() { if (modal) { modal.classList.remove('open'); } }
  function run(q) {
    q = q.trim().toLowerCase();
    if (!q) { results.innerHTML = '<div class="empty">Type to search the documentation</div>'; return; }
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
    }).join('') : '<div class="empty">No results for “' + escapeHtml(q) + '”</div>';
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
