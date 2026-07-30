/* ==========================================================================
   ERBEY MÜHENDİSLİK — main.js
   ========================================================================== */
(function () {
  'use strict';

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const IMG = 'assets/img/projeler/';

  /* --- Preloader ------------------------------------------------------- */
  const pre = $('.pre');
  if (pre) {
    const hide = () => setTimeout(() => pre.classList.add('is-done'), 500);
    window.addEventListener('load', hide);
    setTimeout(hide, 2600); // güvenlik ağı
  }

  /* --- Header: scroll durumu ------------------------------------------- */
  const hdr = $('.hdr');
  const bar = $('.progress');
  const top = $('.totop');

  function onScroll() {
    const y = window.scrollY;
    if (hdr) hdr.classList.toggle('is-stuck', y > 40);
    if (top) top.classList.toggle('is-on', y > 700);
    if (bar) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (top) top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* --- Mobil menü ------------------------------------------------------ */
  const burger = $('.burger');
  const mmenu  = $('.mmenu');
  if (burger && mmenu) {
    const links = $$('.mmenu__link', mmenu);
    const toggle = (open) => {
      burger.classList.toggle('is-open', open);
      mmenu.classList.toggle('is-open', open);
      document.body.classList.toggle('no-scroll', open);
      burger.setAttribute('aria-expanded', String(open));
      links.forEach((l, i) => { l.style.transitionDelay = open ? (0.18 + i * 0.07) + 's' : '0s'; });
    };
    burger.addEventListener('click', () => toggle(!mmenu.classList.contains('is-open')));
    links.forEach(l => l.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  }

  /* --- Scroll reveal --------------------------------------------------- */
  const rvEls = $$('[data-rv]');
  if (rvEls.length) {
    if (!('IntersectionObserver' in window)) {
      rvEls.forEach(el => el.classList.add('is-in'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (!en.isIntersecting) return;
          const d = parseFloat(en.target.dataset.rvd || 0);
          setTimeout(() => en.target.classList.add('is-in'), d * 1000);
          io.unobserve(en.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
      rvEls.forEach(el => io.observe(el));
    }
  }

  /* --- Sayaçlar -------------------------------------------------------- */
  const counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const target = parseFloat(el.dataset.count);
        const dur = 1600;
        const t0 = performance.now();
        const fmt = new Intl.NumberFormat('tr-TR');
        (function tick(t) {
          const p = Math.min(1, (t - t0) / dur);
          const e = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt.format(Math.round(target * e));
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  }

  /* --- Hero slider ----------------------------------------------------- */
  const hero = $('.hero');
  if (hero) {
    const slides  = $$('.hero__slide', hero);
    const dots    = $$('.hero__dot', hero);
    const capName = $('[data-cap-name]', hero);
    const capMeta = $('[data-cap-meta]', hero);
    let i = 0, timer = null;
    const DUR = 6000;

    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-on', k === i));
      dots.forEach((d, k) => {
        d.classList.remove('is-on');
        if (k === i) { void d.offsetWidth; d.classList.add('is-on'); }
      });
      const s = slides[i];
      if (capName) capName.textContent = s.dataset.name || '';
      if (capMeta) capMeta.textContent = s.dataset.meta || '';
    }
    function play() { clearInterval(timer); timer = setInterval(() => go(i + 1), DUR); }

    if (slides.length) {
      go(0); play();
      dots.forEach((d, k) => d.addEventListener('click', () => { go(k); play(); }));
      document.addEventListener('visibilitychange', () => {
        document.hidden ? clearInterval(timer) : play();
      });
    }
  }

  /* --- Yatay rail (sürükle + oklar) ------------------------------------ */
  $$('[data-rail]').forEach(rail => {
    const wrap  = rail.closest('section') || document;
    const prev  = $('[data-rail-prev]', wrap);
    const next  = $('[data-rail-next]', wrap);
    const step  = () => (rail.querySelector('.rail-card')?.offsetWidth || 340) + 26;

    const sync = () => {
      const max = rail.scrollWidth - rail.clientWidth - 4;
      if (prev) prev.disabled = rail.scrollLeft <= 4;
      if (next) next.disabled = rail.scrollLeft >= max;
    };
    rail.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    setTimeout(sync, 120);

    if (prev) prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
    if (next) next.addEventListener('click', () => rail.scrollBy({ left:  step(), behavior: 'smooth' }));

    // fare ile sürükleme
    let down = false, sx = 0, sl = 0, moved = 0;
    rail.addEventListener('pointerdown', e => {
      if (e.pointerType === 'touch') return;
      down = true; moved = 0;
      sx = e.clientX; sl = rail.scrollLeft;
      rail.classList.add('is-dragging');
    });
    rail.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - sx;
      moved = Math.abs(dx);
      rail.scrollLeft = sl - dx;
    });
    const up = () => {
      if (!down) return;
      down = false;
      rail.classList.remove('is-dragging');
    };
    rail.addEventListener('pointerup', up);
    rail.addEventListener('pointerleave', up);
    rail.addEventListener('click', e => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
  });

  /* --- Proje kartı HTML ------------------------------------------------ */
  function meta(p) {
    return [p.buyukluk, p.sehir].filter(Boolean).join(' · ');
  }
  function picture(p, size, cls, lazy) {
    const s = size ? '-' + size : '';
    return '<picture>' +
      '<source srcset="' + IMG + p.slug + s + '.webp" type="image/webp">' +
      '<img src="' + IMG + p.slug + s + '.jpg" alt="' + p.title + ' — ' + p.tur + '"' +
      (cls ? ' class="' + cls + '"' : '') +
      (lazy === false ? '' : ' loading="lazy" decoding="async"') + '>' +
      '</picture>';
  }

  function cardHTML(p, idx) {
    return '<article class="card" data-i="' + idx + '" tabindex="0" role="button" ' +
      'aria-label="' + p.title + ' projesini incele">' +
      '<div class="card__img">' + picture(p, 800) + '</div>' +
      '<span class="card__plus" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
        '<path d="M12 5v14M5 12h14"/></svg></span>' +
      '<div class="card__body">' +
        '<div class="card__cat">' + p.catName + '</div>' +
        '<h3 class="card__title">' + p.title + '</h3>' +
        '<div class="card__meta">' + meta(p) + '</div>' +
      '</div></article>';
  }

  /* --- Ana sayfa: öne çıkan projeler rail'i ---------------------------- */
  const railBox = $('[data-featured]');
  if (railBox && window.PROJECTS) {
    const picks = ['empire-avcilar-istanbul', 'cherry-garden-hotel-konya', 'bahcekent-flora-emlak-konut-istanbul',
                   'optimist-residence-istanbul', 'konya-seker-entegre-tesisleri', 'tual-bahcekent-istanbul',
                   'dogasehir-konutlari', 'meram-belediyesi-hizmet-binasi-konya', 'star-tower-sitesi',
                   'novaland-a-v-m', 'gaziosmanpasa-toki-istanbul', 'algida-dondurma-fabrikasi'];
    const list = picks.map(s => window.PROJECTS.find(p => p.slug === s)).filter(Boolean);
    railBox.innerHTML = list.map(p =>
      '<a class="rail-card" href="projeler.html#' + p.slug + '">' +
        '<div class="rail-card__img">' + picture(p, 800) + '</div>' +
        '<div class="rail-card__body">' +
          '<div class="rail-card__cat">' + p.catName + '</div>' +
          '<h3 class="rail-card__title">' + p.title + '</h3>' +
          '<div class="rail-card__meta">' + meta(p) + '</div>' +
        '</div><i class="rail-card__line"></i></a>'
    ).join('');
  }

  /* --- Projeler sayfası: filtre + grid + lightbox ---------------------- */
  const grid = $('[data-grid]');
  if (grid && window.PROJECTS) {
    const all = window.PROJECTS;
    let view = all.slice();

    // filtre butonlarındaki sayıları doldur
    $$('[data-filter]').forEach(b => {
      const f = b.dataset.filter;
      const n = f === 'all' ? all.length : all.filter(p => p.cat === f).length;
      const s = $('span', b);
      if (s) s.textContent = n;
    });

    function render(list) {
      view = list;
      grid.innerHTML = list.length
        ? list.map((p, i) => cardHTML(p, i)).join('')
        : '<p class="empty">Bu kategoride henüz proje eklenmedi.</p>';
      $$('.card', grid).forEach((c, i) => { c.style.animationDelay = (i % 12) * 0.05 + 's'; });
    }
    render(all);

    $$('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('[data-filter]').forEach(b => b.classList.remove('is-on'));
        btn.classList.add('is-on');
        const f = btn.dataset.filter;
        render(f === 'all' ? all : all.filter(p => p.cat === f));
      });
    });

    /* Lightbox */
    const lb = $('.lb');
    if (lb) {
      const box   = $('.lb__box', lb);
      let cur = 0;

      function fill(i) {
        cur = (i + view.length) % view.length;
        const p = view[cur];
        box.innerHTML =
          picture(p, '', 'lb__img', false) +
          '<div class="lb__body">' +
            '<div class="lb__cat">' + p.catName + '</div>' +
            '<h2 class="lb__title">' + p.title + '</h2>' +
            '<dl class="lb__specs">' +
              spec('Proje Türü', p.tur) +
              spec('Kapsam', p.buyukluk) +
              spec('Konum', p.sehir) +
              spec('Yıl', p.yil) +
            '</dl></div>';
        if (history.replaceState) history.replaceState(null, '', '#' + p.slug);
      }
      function spec(k, v) {
        return v ? '<div class="lb__spec"><dt>' + k + '</dt><dd>' + v + '</dd></div>' : '';
      }
      function open(i) {
        fill(i);
        lb.classList.add('is-open');
        document.body.classList.add('no-scroll');
      }
      function close() {
        lb.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
        if (history.replaceState) history.replaceState(null, '', location.pathname);
      }

      grid.addEventListener('click', e => {
        const c = e.target.closest('.card');
        if (c) open(+c.dataset.i);
      });
      grid.addEventListener('keydown', e => {
        const c = e.target.closest('.card');
        if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(+c.dataset.i); }
      });

      $('.lb__close', lb).addEventListener('click', close);
      $('.lb__nav--prev', lb).addEventListener('click', () => fill(cur - 1));
      $('.lb__nav--next', lb).addEventListener('click', () => fill(cur + 1));
      lb.addEventListener('click', e => { if (e.target === lb) close(); });
      document.addEventListener('keydown', e => {
        if (!lb.classList.contains('is-open')) return;
        if (e.key === 'Escape')     close();
        if (e.key === 'ArrowLeft')  fill(cur - 1);
        if (e.key === 'ArrowRight') fill(cur + 1);
      });

      // #slug ile doğrudan açılış
      const hash = location.hash.slice(1);
      if (hash) {
        const i = all.findIndex(p => p.slug === hash);
        if (i >= 0) setTimeout(() => open(i), 700);
      }
    }
  }

  /* --- İletişim formu (statik site: mailto ile gönderim) --------------- */
  const form = $('[data-form]');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const d = new FormData(form);
      const body =
        'Ad Soyad: ' + (d.get('ad') || '') + '\n' +
        'Telefon: '  + (d.get('tel') || '') + '\n' +
        'E-posta: '  + (d.get('email') || '') + '\n' +
        'Konu: '     + (d.get('konu') || '') + '\n\n' +
        (d.get('mesaj') || '');
      const to = form.dataset.form || 'bilgi@erbeymuhendislik.com';
      window.location.href = 'mailto:' + to +
        '?subject=' + encodeURIComponent('Web Sitesi Talebi — ' + (d.get('konu') || 'Genel')) +
        '&body=' + encodeURIComponent(body);
      const msg = $('.form__msg', form);
      if (msg) msg.classList.add('is-on');
    });
  }

  /* --- Yıl --------------------------------------------------------------*/
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
