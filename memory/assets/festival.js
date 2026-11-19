/* ============================================================================
   节日彩蛋 1 · assets/festival.js
   ----------------------------------------------------------------------------
   9 月 10 日教师节 → 「教师节快乐！」祝福卡 + 满屏纸屑粒子（没有 🎂）
   1 月 1 日元旦     → 「元旦快乐！」祝福卡 + 满屏纸屑粒子 + 🎂 从天而降

   谁开启：
     · index.html          —— 总入口
     · class.html?cls=2    —— 2 班页面（class.html 里用 window.FESTIVAL_ENABLED 控制，
                               想看别的班也弹，把那行改成 true）
   预览 / 关闭：
     ?egg=teacher   强制教师节      ?egg=newyear  强制元旦
                    （预览参数在任何页面都生效，包括非 2 班页面）
     ?noegg=1       关掉彩蛋（截图、排查用）
   说明：默认按访客本地时间判断，只在当天触发；每个页面各弹一次
        （总入口弹过之后，从主菜单点进 2 班页还会再落一遍 🎂；同一页刷新不重复）。
        粒子会一直落到屏幕外才收画布，不会半路消失；文案里的年份取当前年份。
   ========================================================================== */
(function () {
  'use strict';

  var search = location.search || '';

  /* ---------- 开关 ---------- */
  if (/(?:^|[?&])noegg=1(?:&|$)/.test(search)) return;

  function forcedKey() {
    var m = search.match(/[?&]egg=(teacher|newyear)(?:&|$)/);
    return m ? m[1] : null;
  }
  function todayKey() {
    var d = new Date();
    if (d.getMonth() === 8 && d.getDate() === 10) return 'teacher';   /* 9/10 */
    if (d.getMonth() === 0 && d.getDate() === 1) return 'newyear';     /* 1/1  */
    return null;
  }

  /* ?egg= 是显式预览：连「只在 2 班页面开」这条也绕过，
     于是任何页面加参数都能看效果；按日期自动触发时仍然只认 2 班页。 */
  var FORCED = forcedKey();
  if (!FORCED && window.FESTIVAL_ENABLED === false) return;

  var KEY = FORCED || todayKey();
  if (!KEY) return;

  /* 每个页面各弹一次：sessionStorage 跟着标签页走，关掉标签页 / 新开一个就重新开始。
     按页面分开记 —— 总入口弹过之后，从主菜单点进 2 班页还会再落一遍 🎂；
     但同一页刷新不会重复弹。存的是「哪个节日」，所以教师节放过之后元旦不会一并被挡。
     ?egg= 属于手动预览，显式要看，就不受这个限制。 */
  var PAGE = /class\.html$/i.test(location.pathname) ? 'class' : 'index';
  var SEEN_KEY = 'ycyz_egg_seen_' + PAGE;
  function sessionSeen() {
    try { return sessionStorage.getItem(SEEN_KEY) === KEY; } catch (e) { return false; }
  }
  function markSessionSeen() {
    try { sessionStorage.setItem(SEEN_KEY, KEY); } catch (e) { }
  }
  if (!FORCED && sessionSeen()) return;

  var YEAR = new Date().getFullYear();
  var COPY = {
    teacher: {
      emoji: '💐',
      title: '教师节快乐！',
      lines: ['感谢恩师教导', '您辛苦了！']
    },
    newyear: {
      emoji: '🎂',
      title: '元旦快乐！',
      lines: [YEAR + ' · 新年新气象', '愿我们都好，也常常见面']
    }
  }[KEY];

  /* 🎂 只在元旦飘；教师节只放纸屑 */
  var CAKES = (KEY === 'newyear');

  /* 「减少动态效果」：以前是整块跳过，结果无头浏览器、部分系统设置、微信 webview
     都会把它报成 reduce，页面只剩一张卡，看起来像坏了。
     现在密度一律不减，只是把纸屑的旋转和横向飘去掉 —— 该有的画面一个不少。 */
  var REDUCE = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- 样式 ---------- */
  function injectStyle() {
    if (document.getElementById('festival-style')) return;
    var st = document.createElement('style');
    st.id = 'festival-style';
    st.textContent = [
      '#festival-fx{position:fixed;top:0;right:0;bottom:0;left:0;z-index:9990;',
      'pointer-events:none;transition:opacity .8s ease}',

      '#festival-card{position:fixed;left:50%;top:50%;z-index:9995;',
      'transform:translate(-50%,-50%) scale(.94);opacity:0;',
      'width:min(88vw,380px);box-sizing:border-box;padding:24px 26px 20px;',
      'border-radius:20px;border:1px solid rgba(232,201,122,.85);',
      'background:linear-gradient(180deg,rgba(40,13,10,.93),rgba(22,7,5,.95));',
      'box-shadow:0 20px 54px rgba(18,5,4,.52),0 0 0 1px rgba(255,255,255,.05) inset;',
      'text-align:center;color:#f7ead2;pointer-events:auto;',
      'font-family:"PingFang SC","Microsoft YaHei","Source Han Sans SC",sans-serif;',
      'transition:opacity .45s ease,transform .5s cubic-bezier(.22,1,.36,1)}',
      '#festival-card.on{opacity:1;transform:translate(-50%,-50%) scale(1)}',

      '#festival-card .fe-x{position:absolute;top:8px;right:8px;width:28px;height:28px;',
      'border:0;border-radius:8px;background:transparent;color:rgba(247,234,210,.55);',
      'font-size:14px;line-height:1;cursor:pointer;font-family:inherit;',
      'display:flex;align-items:center;justify-content:center}',
      '#festival-card .fe-x:hover{background:rgba(232,201,122,.16);color:#f2d992}',

      '#festival-card .fe-emoji{font-size:42px;line-height:1;margin-bottom:10px}',
      '#festival-card .fe-title{font-family:"KaiTi","STKaiti",serif;font-weight:700;',
      'font-size:23px;letter-spacing:2px;color:#f2d992;',
      'text-shadow:0 2px 12px rgba(0,0,0,.5)}',
      '#festival-card .fe-body{margin-top:9px;font-size:14px;line-height:1.95;',
      'color:rgba(247,234,210,.92);letter-spacing:.02em}',
      '#festival-card .fe-foot{margin-top:14px;padding-top:10px;',
      'border-top:1px solid rgba(232,201,122,.22);font-size:11px;',
      'letter-spacing:.12em;color:rgba(232,201,122,.7)}'
    ].join('');
    document.head.appendChild(st);
  }

  /* ---------- 祝福卡 ---------- */
  var card = null, cardTimer = 0;

  function buildCard() {
    card = document.createElement('div');
    card.id = 'festival-card';
    card.setAttribute('role', 'status');
    card.setAttribute('aria-live', 'polite');
    card.innerHTML =
      '<button type="button" class="fe-x" aria-label="关闭祝福">✕</button>' +
      '<div class="fe-emoji" aria-hidden="true">' + COPY.emoji + '</div>' +
      '<div class="fe-title">' + COPY.title + '</div>' +
      '<div class="fe-body">' + COPY.lines.join('<br>') + '</div>' +
      '<div class="fe-foot">宁夏银川一中 · 2026 届</div>';
    document.body.appendChild(card);
    card.querySelector('.fe-x').addEventListener('click', closeAll);
    requestAnimationFrame(function () { if (card) card.classList.add('on'); });
    cardTimer = setTimeout(hideCard, 9000);
  }

  function hideCard() {
    if (!card) return;
    clearTimeout(cardTimer);
    var el = card;
    card = null;
    el.classList.remove('on');
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 520);
  }

  function closeAll() {
    hideCard();
    stopFx();
  }

  /* ---------- 粒子 + 🎂 ---------- */
  var SPAWN_MS = 7000;      /* 前 7 秒持续投放 */
  var MAX_MS = 45000;       /* 兜底上限：只防「有颗粒卡住导致画布永不收」，正常 15~30 秒就自然收完 */
  var MAX_PARTS = 150;
  var COLORS = ['#e8c97a', '#f2d992', '#f7ead2', '#d9553f', '#a9291c', '#c9973f'];

  var cv = null, cx = null, W = 0, H = 0, DPR = 1;
  var parts = [], raf = 0, running = false;
  var startAt = 0, lastT = 0, spawnAcc = 0, pausedAt = 0;

  function setupCanvas() {
    cv = document.createElement('canvas');
    cv.id = 'festival-fx';
    cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    cx = cv.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    if (!cv) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = Math.round(W * DPR);
    cv.height = Math.round(H * DPR);
    cv.style.width = W + 'px';
    cv.style.height = H + 'px';
    cx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function addConfetti(n) {
    for (var i = 0; i < n; i++) {
      parts.push({
        k: 'c',
        x: Math.random() * W,
        y: -14 - Math.random() * 70,
        vx: REDUCE ? 0 : (Math.random() - 0.5) * 46,
        vy: 95 + Math.random() * 170,
        w: 3.5 + Math.random() * 4.5,
        h: 7 + Math.random() * 9,
        rot: REDUCE ? 0 : Math.random() * 6.283,
        vr: REDUCE ? 0 : (Math.random() - 0.5) * 7,
        col: COLORS[(Math.random() * COLORS.length) | 0],
        a: 0.72 + Math.random() * 0.28
      });
    }
  }

  function addCake(n) {
    for (var i = 0; i < n; i++) {
      var bx = Math.random() * W;          /* 横向基准，摆动围绕它 */
      parts.push({
        k: 'e',
        bx: bx, x: bx,
        y: -48 - Math.random() * 140,
        vy: 62 + Math.random() * 80,
        size: 20 + Math.random() * 20,
        ph: Math.random() * 6.283,
        sw: 12 + Math.random() * 26,
        rot: (Math.random() - 0.5) * 0.5,
        vr: (Math.random() - 0.5) * 0.9,
        a: 1
      });
    }
  }

  function draw(dt, t) {
    cx.clearRect(0, 0, W, H);
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.y += p.vy * dt;
      if (p.k === 'c') {
        p.x += p.vx * dt;
        p.rot += p.vr * dt;
        if (p.y > H + 30) { parts.splice(i, 1); continue; }
        cx.save();
        cx.globalAlpha = p.a;
        cx.translate(p.x, p.y);
        cx.rotate(p.rot);
        cx.fillStyle = p.col;
        cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        cx.restore();
      } else {
        p.rot += p.vr * dt;
        p.x = p.bx + Math.sin(p.ph + t / 620) * p.sw;
        if (p.y > H + 80) { parts.splice(i, 1); continue; }
        cx.save();
        cx.globalAlpha = p.a;
        cx.translate(p.x, p.y);
        cx.rotate(p.rot);
        cx.font = p.size + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';
        cx.fillText('🎂', 0, 0);
        cx.restore();
      }
    }
  }

  function loop(now) {
    if (!running) return;
    if (!lastT) lastT = now;
    var dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    var t = now - startAt;

    if (t < SPAWN_MS && parts.length < MAX_PARTS) {
      spawnAcc += dt;
      while (spawnAcc >= 0.12) {
        spawnAcc -= 0.12;
        addConfetti(2);
        if (CAKES && Math.random() < 0.5) addCake(1);
      }
    }

    draw(dt, t);

    /* 投放结束、并且最后一颗也落出屏幕之后才收画布 ——
       以前到点直接 stopFx，还挂在半空的 🎂 / 纸屑会“啪”地消失。 */
    if (t >= SPAWN_MS && !parts.length) { stopFx(); return; }
    if (t >= MAX_MS) { stopFx(); return; }
    raf = requestAnimationFrame(loop);
  }

  function startFx() {
    if (!cv) return;
    parts = [];
    running = true;
    lastT = 0;
    spawnAcc = 0;
    raf = requestAnimationFrame(function (now) {
      startAt = now;
      lastT = now;
      loop(now);
    });
  }

  function stopFx() {
    running = false;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    parts = [];
    if (!cv) return;
    var el = cv;
    cv = null;
    cx = null;
    el.style.opacity = '0';
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 820);
  }

  /* 调试钩子（与 window.BGM / window.__THU 同一风格）：
     排查「没看到纸屑 / 🎂」时，控制台敲 __FESTIVAL.parts() 看当前粒子构成 */
  window.__FESTIVAL = {
    key: KEY,
    cakes: CAKES,
    reduce: REDUCE,
    parts: function () {
      var c = 0, e = 0;
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].k === 'e') e++; else c++;
      }
      return { total: parts.length, confetti: c, cakes: e };
    }
  };

  /* 切到后台先停，回来接着放（并把暂停的时长从时间轴里补掉） */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (running) {
        pausedAt = performance.now();
        running = false;
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
      }
    } else if (pausedAt && cv) {
      startAt += performance.now() - pausedAt;
      pausedAt = 0;
      lastT = 0;
      running = true;
      raf = requestAnimationFrame(loop);
    }
  });

  /* ---------- 启动 ---------- */
  function boot() {
    injectStyle();
    buildCard();
    if (!FORCED) markSessionSeen();   /* 自动触发的记一笔，本会话不再弹 */
    setupCanvas();
    startFx();
  }

  /* 首页有入场动画（#ycyz-loader），等它收幕再放彩蛋，免得被幕布盖住 */
  (function whenReady() {
    var tries = 0;
    (function check() {
      if (!document.getElementById('ycyz-loader')) return boot();
      if (++tries > 48) return boot();      /* 最多等 12s，别把彩蛋卡死 */
      setTimeout(check, 250);
    })();
  })();
})();
