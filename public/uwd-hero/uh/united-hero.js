/*! UNITED hero animation — vanilla JS, no dependencies.
 *  Usage:  <div class="uh" data-united-hero data-assets="assets/"></div>
 *  API:    const hero = UnitedHero.mount(el, { mode: 'autoplay' | 'scroll' | 'manual', sceneSeconds: 3.4 })
 *          hero.goTo(7)  hero.play()  hero.pause()  hero.setProgress(0..1)
 *  The whole picture is a pure function of one number t (0 … 11), so autoplay,
 *  scroll-scrubbing and clicking a stage all drive the same timeline.
 */
(function (global) {
  'use strict';
  var W = 1672, H = 941, N = 11;

  // Titles/copy mirror src/lib/heroTimeline.ts (the site's business-reviewed
  // stage content) so the timeline never drifts out of sync with the rest of
  // the page. Keep titles short: the desktop step labels wrap at ~11ch.
  var SCENES = [
    ['Water Loss', 'A roof leak, upstairs bathroom leak, or washing-machine failure can send water well beyond the first visible puddle.'],
    ['Moisture Migration', 'Water can wick into drywall and framing, pass beneath flooring, and reach insulation or the room below.'],
    ['United Arrives', 'The response starts with the water source, immediate property protection, and a clear assessment of affected areas.'],
    ['Inspection', 'Moisture readings and visual inspection help map affected materials against comparable dry areas — not just what looks wet.'],
    ['Extraction', 'Standing and accessible water is extracted first. Less bulk water means a more controlled drying phase.'],
    ['Air Movers', 'Air movers are positioned at the affected rooms and surfaces according to the drying plan, not scattered at random.'],
    ['Airflow', 'Directed air movement supports evaporation at wet materials while the affected indoor environment is managed.'],
    ['Dehumidification', 'Commercial dehumidification captures moisture released into the air so evaporation can continue effectively.'],
    ['Monitoring', 'Technicians track material moisture and indoor conditions, then adjust the setup as the structure changes.'],
    ['Drying Progress', 'Readings trend toward the drying goal. Equipment stays in place until the affected materials are ready for verification.'],
    ['Verified Drying', 'The drying phase concludes with documented conditions and a clear explanation of any remaining repair work.']
  ];

  // Moisture zones: [cx, cy, rx, ry, spreadDelay, dryDelay, originX, originY]
  var ZONES = [
    [1085, 215, 120, 85, 0.00, 0.55, 1080, 150],
    [1082, 330, 60, 95, 0.10, 0.45, 1080, 200],
    [1300, 325, 95, 85, 0.12, 0.35, 1290, 300],
    [1130, 428, 190, 30, 0.35, 0.60, 1080, 410],
    [1150, 505, 105, 75, 0.50, 0.30, 1100, 450],
    [1170, 660, 330, 30, 0.62, 0.10, 1100, 655],
    [1160, 745, 160, 50, 0.78, 0.70, 1150, 700]
  ];
  // Airflow: cubic béziers starting at each air mover
  var FLOWS = [
    [[1128, 388], [1070, 392], [1040, 360], [1046, 290], [1052, 225], [1090, 188], [1165, 186]],
    [[1372, 388], [1310, 394], [1246, 372], [1242, 300], [1240, 235], [1290, 190], [1400, 192]],
    [[862, 648], [960, 636], [1070, 660], [1140, 598], [1185, 548], [1150, 478], [1040, 470]],
    [[1412, 648], [1330, 638], [1262, 655], [1222, 600], [1196, 548], [1236, 480], [1365, 472]]
  ];
  var LEAKS = [[1080, 152, 404], [1141, 150, 182], [1046, 452, 654], [1150, 702, 792], [1118, 702, 780]];
  var TAGS = [
    { x: 1128, y: 262, name: 'Bathroom ceiling', wet: 38, dry: 11, scanAt: 0.45 },
    { x: 1322, y: 236, name: 'Laundry wall', wet: 31, dry: 10, scanAt: 0.75 },
    { x: 1090, y: 566, name: 'Subfloor', wet: 42, dry: 12, scanAt: 0.42 }
  ];

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(v) { return v * v * (3 - 2 * v); }
  function ramp(t, a, b) { return ease(clamp((t - a) / (b - a))); }
  function lin(t, a, b) { return clamp((t - a) / (b - a)); }
  function outCubic(v) { return 1 - Math.pow(1 - v, 3); }
  function inCubic(v) { return v * v * v; }
  function el(tag, cls, parent, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html) n.innerHTML = html;
    if (parent) parent.appendChild(n);
    return n;
  }
  function bez(p0, p1, p2, p3, u) {
    var m = 1 - u, a = m * m * m, b = 3 * m * m * u, c = 3 * m * u * u, d = u * u * u;
    return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
  }
  function polyline(f) {            // two chained cubic segments → 64 points
    var pts = [], i;
    for (i = 0; i < 32; i++) pts.push(bez(f[0], f[1], f[2], f[3], i / 32));
    for (i = 0; i <= 32; i++) pts.push(bez(f[3], f[4], f[5], f[6], i / 32));
    return pts;
  }

  function Hero(root, opts) {
    opts = opts || {};
    this.root = root;
    this.assets = opts.assets || root.getAttribute('data-assets') || 'assets/';
    this.mode = opts.mode || root.getAttribute('data-mode') || 'autoplay';
    this.sceneSeconds = opts.sceneSeconds || parseFloat(root.getAttribute('data-scene-seconds')) || 3.4;
    this.reduced = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.t = 0; this.target = null; this.playing = false; this.visible = true;
    this.clock = 0; this.last = 0; this.scene = -1; this.nextFlash = 3; this.flashT = -9;
    this.build();
    this.seedParticles();
    this.bind();
    if (this.reduced) { this.t = 6.6; this.render(0); }        // calm, informative still
    else if (this.mode === 'autoplay') this.play();
    this.loop = this.loop.bind(this);
    global.requestAnimationFrame(this.loop);
  }

  Hero.prototype.url = function (f) { return (global.UH_ASSETS && global.UH_ASSETS[f]) || this.assets + f; };

  Hero.prototype.build = function () {
    var r = this.root, A = this.assets, self = this;
    r.classList.add('uh');
    r.setAttribute('role', 'region');
    if (!r.getAttribute('aria-label')) r.setAttribute('aria-label', 'How UNITED dries a water-damaged home, in 11 stages');
    var slot = Array.prototype.slice.call(r.children);
    r.innerHTML = '';
    var view = this.view = el('div', 'uh-view', r);
    var st = this.stage = el('div', 'uh-stage', view);
    function img(cls, file, eager) {
      var i = el('img', cls, st);
      i.alt = ''; i.decoding = 'async'; i.draggable = false;
      
      i.src = self.url(file); return i;
    }
    var first = img('uh-base', 'base-storm.webp', true);
    first.setAttribute('fetchpriority', 'high');
    first.alt = 'Cutaway view of a two-storey Bay Area home during a storm, showing water entering the bathroom, laundry and lower floor';
    this.interior = img('uh-base uh-interior', 'interior-dry.webp');
    this.dry = img('uh-base uh-dry', 'base-dry.webp');

    // moisture + thermal overlays (soft radial gradients, no filters)
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'uh-svg'); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'none'); svg.setAttribute('aria-hidden', 'true');
    var uid = 'uh' + Math.random().toString(36).slice(2, 7);
    svg.innerHTML =
      '<defs>' +
      '<radialGradient id="' + uid + 'm"><stop offset="0" stop-color="#2f9dff" stop-opacity=".58"/><stop offset=".5" stop-color="#1b78e0" stop-opacity=".36"/><stop offset="1" stop-color="#1b78e0" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + uid + 't"><stop offset="0" stop-color="#fff2a0" stop-opacity=".9"/><stop offset=".3" stop-color="#ff9a2e" stop-opacity=".8"/><stop offset=".62" stop-color="#d4307a" stop-opacity=".55"/><stop offset="1" stop-color="#4a1d8f" stop-opacity="0"/></radialGradient>' +
      '<clipPath id="' + uid + 'c"><rect x="790" y="140" width="0" height="660"/></clipPath>' +
      '</defs><g class="m"></g><g class="t" clip-path="url(#' + uid + 'c)"></g>';
    st.appendChild(svg);
    this.scanRect = svg.querySelector('clipPath rect');
    this.thermal = svg.querySelector('g.t');
    this.zoneEls = []; this.thermEls = [];
    var gm = svg.querySelector('g.m');
    ZONES.forEach(function (z) {
      [[gm, 'm', self.zoneEls], [self.thermal, 't', self.thermEls]].forEach(function (k) {
        var e = document.createElementNS(NS, 'ellipse');
        e.setAttribute('cx', z[0]); e.setAttribute('cy', z[1]); e.setAttribute('rx', z[2]); e.setAttribute('ry', z[3]);
        e.setAttribute('fill', 'url(#' + uid + k[1] + ')');
        e.style.transformOrigin = z[6] + 'px ' + z[7] + 'px';
        e.style.transformBox = 'view-box';
        k[0].appendChild(e); k[2].push(e);
      });
    });

    // props
    function prop(cls, file, x, y, pw) {
      var p = el('div', 'uh-prop ' + cls, st);
      p.style.setProperty('--x', x); p.style.setProperty('--y', y);
      if (pw) p.style.setProperty('--pw', pw);
      var i = el('img', '', p); i.alt = ''; i.decoding = 'async'; i.src = self.url(file);
      return p;
    }
    this.dehu = prop('uh-in', 'dehu.webp', 1120, 672, 66);
    this.movers = [
      prop('uh-in uh-flip', 'am4.webp', 1152, 404, 50),
      prop('uh-in uh-flip', 'am2.webp', 1396, 404, 50),
      prop('uh-in', 'am1.webp', 838, 670, 60),
      prop('uh-in uh-flip', 'am4.webp', 1438, 672, 58)
    ];
    this.extractor = prop('uh-in', 'extractor.webp', 1222, 674, 74);
    this.techWork = prop('uh-in', 'tech-work.webp', 1330, 676, 158);
    this.techScan = prop('uh-in', 'tech-walk.webp', 985, 672, 86);
    this.techMon = prop('uh-in', 'tech-walk.webp', 968, 405, 84);
    this.van = prop('uh-van', 'van.webp', 250, 884, 520);
    el('span', 'uh-beam', this.van);

    this.canvas = el('canvas', 'uh-fx', st); this.canvas.setAttribute('aria-hidden', 'true');
    this.ctx = this.canvas.getContext('2d');
    this.flash = el('div', 'uh-flash', st);
    el('div', 'uh-grade', st);

    this.tags = TAGS.map(function (d) {
      var g = el('div', 'uh-tag', st);
      g.style.setProperty('--x', d.x); g.style.setProperty('--y', d.y);
      g.innerHTML = '<span></span><small>' + d.name + '</small>';
      return { el: g, val: g.firstChild, d: d, shown: null };
    });

    // anything you put inside the root element is kept as an overlay above the picture
    var ov = el('div', 'uh-overlay', view);
    slot.forEach(function (n) { ov.appendChild(n); });

    // timeline
    var bar = el('div', 'uh-bar', r);
    this.btn = el('button', 'uh-play', bar); this.btn.type = 'button';
    var track = this.track = el('div', 'uh-track', bar);
    el('div', 'uh-rail', track); this.fill = el('div', 'uh-fill', track);
    var ol = el('ol', 'uh-steps', track);
    this.steps = SCENES.map(function (s, i) {
      var li = el('li', '', ol), b = el('button', 'uh-step', li);
      b.type = 'button';
      var n = (i < 9 ? '0' : '') + (i + 1);
      b.innerHTML = '<i></i><b>' + n + '</b><span>' + s[0] + '</span>';
      b.setAttribute('aria-label', 'Stage ' + (i + 1) + ': ' + s[0]);
      b.addEventListener('click', function () { self.goTo(i + 1); });
      return b;
    });
    this.now = el('p', 'uh-now', bar); this.now.setAttribute('aria-live', 'polite');
    this.syncButton();
  };

  Hero.prototype.bind = function () {
    var self = this;
    this.btn.addEventListener('click', function () { self.playing ? self.pause() : self.play(); });
    this.root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { self.goTo(Math.min(N, self.scene + 2)); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { self.goTo(Math.max(1, self.scene)); e.preventDefault(); }
    });
    if ('IntersectionObserver' in global) {
      new IntersectionObserver(function (en) { self.visible = en[0].isIntersecting; }, { threshold: 0.05 }).observe(this.root);
    }
    if ('ResizeObserver' in global) new ResizeObserver(function () { self.resize(); }).observe(this.view);
    this.resize();
    if (this.mode === 'scroll') {
      var host = this.root.closest('[data-uh-scroll]') || this.root.parentElement;
      var onScroll = function () {
        var b = host.getBoundingClientRect(), span = b.height - global.innerHeight;
        self.setProgress(span > 0 ? clamp(-b.top / span) : 0);
      };
      global.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  };

  Hero.prototype.resize = function () {
    var b = this.stage.getBoundingClientRect();
    if (!b.width) return;
    var dpr = Math.min(global.devicePixelRatio || 1, 1.5);
    var w = Math.min(Math.round(b.width * dpr), 2200);
    this.canvas.width = w; this.canvas.height = Math.round(w * H / W);
    this.k = w / W;
    var v = this.view.getBoundingClientRect();
    this.portrait = v.width < v.height * 0.95;
    // van parks where it stays in frame: by the driveway on wide screens, under the cutaway on phones
    this.vanPark = this.portrait ? [770, 916] : [250, 884];
    this.van.style.setProperty('--x', this.vanPark[0]);
    this.van.style.setProperty('--y', this.vanPark[1]);
    this.dirty = true;
  };

  Hero.prototype.seedParticles = function () {
    var i; this.rain = []; this.drops = []; this.vapor = [];
    for (i = 0; i < 260; i++) this.rain.push({ x: Math.random() * (W + 300) - 150, y: Math.random() * H, l: 14 + Math.random() * 26, v: 900 + Math.random() * 700, a: 0.12 + Math.random() * 0.3 });
    for (i = 0; i < 46; i++) this.drops.push({ k: i % LEAKS.length, u: Math.random(), v: 0.9 + Math.random() * 0.8, dx: (Math.random() - 0.5) * 9 });
    for (i = 0; i < 70; i++) { var z = ZONES[i % ZONES.length]; this.vapor.push({ sx: z[0] + (Math.random() - 0.5) * z[2] * 1.4, sy: z[1] + (Math.random() - 0.5) * z[3] * 1.2, u: Math.random(), v: 0.16 + Math.random() * 0.16 }); }
    this.flowPts = FLOWS.map(polyline);
    this.streaks = [];
    for (i = 0; i < 88; i++) this.streaks.push({ f: i % 4, u: Math.random() * 1.2 - 0.1, v: 0.26 + Math.random() * 0.24, off: (Math.random() - 0.5) * 34, len: 10 + Math.floor(Math.random() * 12) });
  };

  /* ───────── transport ───────── */
  Hero.prototype.play = function () { if (this.reduced) return; this.playing = true; this.syncButton(); };
  Hero.prototype.pause = function () { this.playing = false; this.syncButton(); };
  Hero.prototype.goTo = function (n) { this.target = (n - 1) + 0.62; this.dirty = true; };
  Hero.prototype.setProgress = function (p) { this.t = clamp(p) * (N - 0.001); this.target = null; this.dirty = true; };
  Hero.prototype.syncButton = function () {
    this.btn.setAttribute('aria-label', this.playing ? 'Pause animation' : 'Play animation');
    this.btn.innerHTML = this.playing
      ? '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.6" height="12" rx="1"/><rect x="9.4" y="2" width="3.6" height="12" rx="1"/></svg>'
      : '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.2v11.6a.8.8 0 0 0 1.2.7l9-5.8a.8.8 0 0 0 0-1.4l-9-5.8A.8.8 0 0 0 4 2.2z"/></svg>';
  };

  Hero.prototype.loop = function (ms) {
    var dt = Math.min((ms - this.last) / 1000 || 0, 0.05); this.last = ms;
    if (this.visible && !document.hidden) {
      if (this.target !== null) {
        var d = this.target - this.t;
        if (this.reduced || Math.abs(d) < 0.01) { this.t = this.target; this.target = null; }
        else this.t += d * Math.min(1, dt * 5.5);
        this.dirty = true;
      } else if (this.playing && this.mode !== 'scroll') {
        this.t += dt / this.sceneSeconds;
        if (this.t >= N) this.t -= N;
        this.dirty = true;
      }
      var ambient = !this.reduced;
      if (ambient) this.clock += dt;
      if (this.dirty || ambient) this.render(ambient ? dt : 0);
      this.dirty = false;
    }
    global.requestAnimationFrame(this.loop);
  };

  /* ───────── the picture as a function of t ───────── */
  Hero.prototype.render = function (dt) {
    var t = this.t, c = this.clock, self = this, i;
    var s = {
      rain: 1 - ramp(t, 8.6, 10.0),
      leak: 1 - ramp(t, 3.0, 4.4),
      interior: ramp(t, 4.15, 4.95),
      dry: ramp(t, 9.0, 10.5),
      flow: ramp(t, 6.0, 6.35) * (1 - ramp(t, 9.5, 10.05)) * (t < 7 ? 1 : 0.6),
      vapor: ramp(t, 7.25, 7.6) * (1 - ramp(t, 9.6, 10.1)),
      thermal: ramp(t, 3.08, 3.3) * (1 - ramp(t, 3.86, 4.0)),
      scan: lin(t, 3.1, 3.72)
    };

    this.interior.style.opacity = s.interior.toFixed(3);
    this.dry.style.opacity = s.dry.toFixed(3);

    // moisture: spreads in stage 2, shrinks from dehumidification to the end of stage 10
    var spread = lin(t, 0.85, 2.0), dryP = lin(t, 7.3, 10.0);
    ZONES.forEach(function (z, n) {
      var g = ease(clamp((spread - z[4]) / 0.3));
      var d = ease(clamp((dryP - z[5] * 0.6) / 0.4));
      var k = g * (1 - d), pulse = 1 + 0.035 * Math.sin(c * 1.6 + n);
      self.zoneEls[n].style.transform = 'scale(' + (0.15 + 0.85 * g) * (1 - 0.45 * d) * pulse + ')';
      self.zoneEls[n].style.opacity = (k * (1 - 0.45 * s.thermal)).toFixed(3);
      self.thermEls[n].style.opacity = g.toFixed(3);
    });
    this.thermal.style.opacity = (s.thermal * 0.7).toFixed(3);
    this.scanRect.setAttribute('width', (s.scan * 720).toFixed(1));

    // van: in during stage 3, away at the very end (so the loop restarts clean)
    var vin = outCubic(lin(t, 2.02, 2.8)), vout = inCubic(lin(t, 10.55, 11));
    var vx = -(this.vanPark[0] + 560) * (1 - vin) + (W - this.vanPark[0] + 80) * vout;
    var bob = (vin < 1 || vout > 0) ? Math.sin(c * 17) * 0.06 : 0;
    this.van.style.opacity = t > 2 ? 1 : 0;
    this.van.style.transform = 'translate(' + (vx / 10).toFixed(2) + 'em,' + (vx * 0.056 / 10).toFixed(2) + 'em) translate(0,-100%) rotate(3.2deg) translateY(' + bob + 'em)';
    this.van.style.setProperty('--van-b', (0.7 + 0.2 * s.dry).toFixed(2));
    this.van.style.setProperty('--beam', ((t > 2 ? 1 : 0) * (1 - s.dry) * (1 - 0.7 * ramp(t, 2.9, 3.2)) * (1 - vout)).toFixed(2));

    // people and equipment
    function show(p, o, extra) {
      p.style.opacity = o.toFixed(3);
      p.style.transform = 'translate(-50%,-100%) ' + (extra || '');
    }
    var scanIn = ramp(t, 2.92, 3.12) * (1 - ramp(t, 3.88, 4.0));
    show(this.techScan, scanIn, 'translateX(' + (lin(t, 2.92, 3.8) * 9).toFixed(2) + 'em)');
    var ex = ramp(t, 4.0, 4.2) * (1 - ramp(t, 4.9, 5.02)), push = lin(t, 4.1, 4.95);
    show(this.techWork, ex, 'translateX(' + (push * 7 + Math.sin(c * 2.2) * 0.5 * ex).toFixed(2) + 'em)');
    show(this.extractor, ex, 'translateX(' + (Math.sin(c * 40) * 0.03).toFixed(3) + 'em)');
    var out = ramp(t, 10.0, 10.3);
    this.movers.forEach(function (m, n) {
      var a = lin(t, 5.05 + n * 0.16, 5.3 + n * 0.16), o = outCubic(a);
      show(m, clamp(a * 3) * (1 - out), 'translateY(' + ((1 - o) * -2.2).toFixed(2) + 'em)' + (s.flow > 0.05 ? ' rotate(' + (Math.sin(c * 50 + n) * 0.25).toFixed(2) + 'deg)' : ''));
    });
    var dh = lin(t, 7.0, 7.28);
    show(this.dehu, clamp(dh * 3) * (1 - out), 'translateY(' + ((1 - outCubic(dh)) * -2.4).toFixed(2) + 'em)');
    var mon = ramp(t, 8.0, 8.2) * (1 - ramp(t, 9.55, 9.8));
    show(this.techMon, mon, 'translateX(' + (lin(t, 8.0, 9.6) * 6).toFixed(2) + 'em)');

    // readings
    var fall = ease(lin(t, 8.15, 9.85));
    this.tags.forEach(function (g) {
      var first = (s.scan > g.d.scanAt ? 1 : 0) * (1 - ramp(t, 3.88, 4.0));
      var second = ramp(t, 8.1, 8.3) * (1 - ramp(t, 10.35, 10.6));
      var v = Math.round(t < 5 ? g.d.wet : g.d.wet + (g.d.dry - g.d.wet) * fall);
      var o = Math.max(first, second);
      g.el.style.opacity = o.toFixed(2);
      if (o > 0 && g.shown !== v) {
        g.shown = v; g.val.textContent = 'Moisture ' + v + '%';
        g.el.setAttribute('data-state', v <= 15 ? 'dry' : 'wet');
        g.el.lastChild.textContent = g.d.name + (v <= 15 ? ' · dry standard' : '');
      }
    });

    // lightning — only while the storm is the story
    if (dt && t < 2.9 && s.rain > 0.5) {
      if (c > this.nextFlash) { this.flashT = c; this.nextFlash = c + 4.5 + Math.random() * 5; }
      var f = c - this.flashT;
      this.flash.style.opacity = (f < 0.5 ? Math.max(0, (f < 0.08 ? 0.75 : f < 0.16 ? 0.1 : f < 0.24 ? 0.55 : 0.55 - (f - 0.24) * 2.2)) : 0).toFixed(2);
    } else this.flash.style.opacity = 0;

    this.paint(s, dt);

    // timeline
    var sc = Math.min(N - 1, Math.floor(t));
    this.fill.style.setProperty('--p', (Math.min(t, N - 1) / (N - 1)).toFixed(4));
    if (sc !== this.scene) {
      this.scene = sc;
      this.steps.forEach(function (b, n) {
        n === sc ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current');
        n < sc ? b.setAttribute('data-done', '') : b.removeAttribute('data-done');
      });
      this.now.innerHTML = '<strong>' + (sc < 9 ? '0' : '') + (sc + 1) + ' ' + SCENES[sc][0] + '</strong>' + SCENES[sc][1];
      this.root.setAttribute('data-scene', sc + 1);
      this.root.dispatchEvent(new CustomEvent('uh:scene', { detail: { index: sc + 1, title: SCENES[sc][0], text: SCENES[sc][1] }, bubbles: true }));
    }
  };

  Hero.prototype.paint = function (s, dt) {
    var ctx = this.ctx, k = this.k, c = this.clock, i, p;
    if (!k) return;
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = 'round';

    // rain
    if (s.rain > 0.01) {
      var count = Math.round(this.rain.length * s.rain);
      ctx.lineWidth = 1.3;
      for (i = 0; i < count; i++) {
        p = this.rain[i];
        p.y += p.v * dt; p.x -= p.v * 0.16 * dt;
        if (p.y > H + 30) { p.y = -30; p.x = Math.random() * (W + 300) - 50; }
        var inside = p.x > 800 && p.x < 1495 && p.y > 170 && p.y < 690;
        ctx.strokeStyle = 'rgba(205,225,245,' + (p.a * s.rain * (inside ? 0.18 : 1)).toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.l * 0.16, p.y + p.l); ctx.stroke();
      }
    }

    // active leaks: falling droplets + splash rings
    if (s.leak > 0.01) {
      ctx.lineWidth = 1.8;
      for (i = 0; i < this.drops.length; i++) {
        p = this.drops[i]; p.u += p.v * dt * 1.5; if (p.u > 1) p.u -= 1;
        var L = LEAKS[p.k], y = L[1] + (L[2] - L[1]) * p.u * p.u, a = s.leak * 0.85;
        ctx.strokeStyle = 'rgba(190,228,255,' + a.toFixed(2) + ')';
        ctx.beginPath(); ctx.moveTo(L[0] + p.dx, y); ctx.lineTo(L[0] + p.dx, y + 6 + 12 * p.u); ctx.stroke();
        if (p.u > 0.86) {
          var r = (p.u - 0.86) / 0.14;
          ctx.strokeStyle = 'rgba(190,228,255,' + (a * (1 - r) * 0.8).toFixed(2) + ')';
          ctx.beginPath(); ctx.ellipse(L[0] + p.dx, L[2], 3 + r * 13, 1 + r * 3.2, 0, 0, 6.283); ctx.stroke();
        }
      }
    }

    // thermal scan line
    if (s.thermal > 0.01 && s.scan < 1) {
      var sx = 790 + s.scan * 720, g = ctx.createLinearGradient(sx - 46, 0, sx, 0);
      g.addColorStop(0, 'rgba(255,170,60,0)'); g.addColorStop(1, 'rgba(255,190,90,' + (0.4 * s.thermal).toFixed(2) + ')');
      ctx.fillStyle = g; ctx.fillRect(sx - 46, 150, 46, 650);
      ctx.fillStyle = 'rgba(255,225,160,' + (0.95 * s.thermal).toFixed(2) + ')'; ctx.fillRect(sx - 1, 150, 2, 650);
    }

    // airflow streaks
    if (s.flow > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      for (i = 0; i < this.flowPts.length; i++) {            // soft ribbon body under the moving streaks
        var fp = this.flowPts[i], m, breathe = 0.75 + 0.25 * Math.sin(c * 2.4 + i);
        for (m = 1; m < fp.length; m++) {
          var along = m / 64;
          ctx.strokeStyle = 'rgba(60,160,255,' + (0.10 * s.flow * breathe * Math.sin(along * 3.1416)).toFixed(3) + ')';
          ctx.lineWidth = 8 + 30 * along;
          ctx.beginPath(); ctx.moveTo(fp[m - 1][0], fp[m - 1][1]); ctx.lineTo(fp[m][0], fp[m][1]); ctx.stroke();
        }
      }
      for (i = 0; i < this.streaks.length; i++) {
        p = this.streaks[i]; p.u += p.v * dt; if (p.u > 1.15) { p.u = -0.1; p.off = (Math.random() - 0.5) * 34; }
        var pts = this.flowPts[p.f], head = Math.floor(p.u * 64), j;
        for (j = 0; j < p.len; j++) {
          var n = head - j; if (n < 1 || n > 64) continue;
          var q0 = pts[n - 1], q1 = pts[n], life = Math.sin(clamp(p.u) * 3.1416), tail = 1 - j / p.len;
          var spreadOff = p.off * (0.25 + n / 64);           // stream fans out as it travels
          ctx.strokeStyle = 'rgba(96,200,255,' + (0.62 * s.flow * life * tail).toFixed(3) + ')';
          ctx.lineWidth = 1.2 + 3.2 * tail;
          ctx.beginPath(); ctx.moveTo(q0[0], q0[1] + spreadOff * (n - 1) / n); ctx.lineTo(q1[0], q1[1] + spreadOff); ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    // moisture leaving the structure, drawn into the dehumidifier
    if (s.vapor > 0.01) {
      for (i = 0; i < this.vapor.length; i++) {
        p = this.vapor[i]; p.u += p.v * dt; if (p.u > 1) p.u -= 1;
        var e = p.u * p.u, vxp = p.sx + (1118 - p.sx) * e, vyp = p.sy + (612 - p.sy) * e - Math.sin(p.u * 3.1416) * 26;
        ctx.fillStyle = 'rgba(150,215,255,' + (s.vapor * 0.75 * Math.sin(p.u * 3.1416)).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(vxp, vyp, 2.6 * (1 - 0.6 * e), 0, 6.283); ctx.fill();
      }
    }
  };

  var api = {
    SCENES: SCENES,
    mount: function (elOrSel, opts) {
      var n = typeof elOrSel === 'string' ? document.querySelector(elOrSel) : elOrSel;
      if (!n) return null;
      if (n.__uh) return n.__uh;
      return (n.__uh = new Hero(n, opts));
    }
  };
  global.UnitedHero = api;
  function auto() { Array.prototype.forEach.call(document.querySelectorAll('[data-united-hero]'), function (n) { api.mount(n); }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto); else auto();
})(window);
