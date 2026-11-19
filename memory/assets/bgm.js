/* ============================================================================
   共享背景音乐（地图主页 index.html 使用；小游戏页 game/index.html 里自带画布内播放器）
   ----------------------------------------------------------------------------
   用法：<script src="assets/bgm.js" defer></script>
   可选：页面里放一个 <button id="bgm-btn"> 作为入口；没有则自动在右下角生成悬浮按钮。

   - 本站 4 首（小游戏页 3 首，两边共用同一份偏好）。点击「🎵 音乐」展开选曲面板：
     可手动选曲、可开关音乐，当前曲目高亮，播完自动切下一首。
  - 起始曲目：1 月 1 日**强制**「夜空中最亮的星」，并把用户保存的偏好一起覆盖掉；
     其它日子默认「向着太阳出发」，用户手动选过之后沿用上次的选择。
   - 切页面续播：离开时把「第几首 + 播到第几秒」写进 sessionStorage，
     新页面接着那首、那个位置放，不再从头开始
     （能不能自动出声仍取决于浏览器自动播放策略：被拦下时，新页面的第一次点击会接着放）。
   - 两页共用同一份偏好：
       localStorage.bgm_on    = '1' / '0'              开关
       localStorage.bgm_track = '0' / '1' / '2' / '3'  当前曲目（3 = 夜空中最亮的星，小游戏里没有这首）
     在主页选了「好风扬帆」，进小游戏菜单里高亮的也是它；在小游戏里静音，回到主页也是静音。
   - 浏览器禁止自动播放：首次点击/触摸/按键后才真正出声
   ========================================================================== */
(function () {
  'use strict';

  /* 小游戏页 index.html 里已自带完整播放器，避免两条音轨打架 */
  if (window.__HAS_OWN_BGM__) return;

  var TRACKS = [
    { src: 'game/xiaoge_converted_audio.mp3',                name: '向着太阳出发' },
    { src: 'game/xiaoge_haofengyangfan_converted_audio.mp3', name: '好风扬帆' },
    { src: 'game/xiaoge_feixiang_converted_audio.mp3',       name: '飞翔' },
    { src: 'game/Star_converted_audio.mp3',                  name: '夜空中最亮的星' }
  ];
  var KEY = 'bgm_on';        /* 开关：与小游戏共用 */
  var TKEY = 'bgm_track';    /* 当前曲目：与小游戏共用 */
  var VOLUME = 0.3;          /* 与小游戏一致的音量 */
  var DEFAULT_TRACK = 0;     /* 平时默认「向着太阳出发」 */
  var NEWYEAR_TRACK = 3;     /* 元旦当天强制「夜空中最亮的星」，覆盖用户偏好 */

  var audio = new Audio();
  audio.volume = VOLUME;
  audio.preload = 'none';
  var started = false;
  var on = localStorage.getItem(KEY) !== '0';           /* 默认开 */

  /* ---------- 跨页面续播 ----------
     本站是多页站点，点一次链接就是整页重载，<audio> 没法活着跨页面。
     所以离开前把「第几首 / 播到第几秒 / 该不该继续」写进 sessionStorage
     （按标签页隔离，正合适），到新页面再跳回同一位置接着放。 */
  var PKEY = 'bgm_pos';
  var RESUME_MAX_GAP = 30 * 60 * 1000;   /* 隔了半小时以上就不续了 */
  function readPos() {
    try {
      var s = JSON.parse(sessionStorage.getItem(PKEY) || 'null');
      if (!s || typeof s.i !== 'number' || typeof s.t !== 'number') return null;
      if (!(s.i >= 0 && s.i < TRACKS.length)) return null;
      if (Date.now() - (s.d || 0) > RESUME_MAX_GAP) return null;
      return s;
    } catch (e) { return null; }
  }
  function savePos() {
    if (!audio.src) return;
    try {
      sessionStorage.setItem(PKEY, JSON.stringify({
        i: idx,
        t: audio.currentTime || 0,
        /* 用「该不该放」而不是 !audio.paused：切后台时我们主动暂停过，
           那一刻记得 playing:false 会把续播状态弄丢 */
        playing: !!(on && started && !audio.ended),
        d: Date.now()
      }));
    } catch (e) { }
  }
  /* 这两个监听必须注册在文件末尾「切后台暂停」之前：
     先存状态、再暂停，否则存下来的永远是 playing:false。 */
  window.addEventListener('pagehide', savePos);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) savePos();
  });

  var pos = readPos();

  /* 起始曲目：
       · 上一页正在放 → 接着放那一首、那个位置
       · 1 月 1 日      → 强制「夜空中最亮的星」，并覆盖用户偏好
       · 其它日子       → 沿用上次选的那首，没选过就「向着太阳出发」 */
  var now = new Date();
  var isNewYear = (now.getMonth() === 0 && now.getDate() === 1);
  var saved = parseInt(localStorage.getItem(TKEY), 10);
  if (!(saved >= 0 && saved < TRACKS.length)) saved = -1;

  /* 元旦：无条件播「夜空中最亮的星」，顺手把偏好也改成这首 ——
     需求是「覆盖用户偏好」，不是只覆盖这一次，所以下次打开（1 月 2 日）沿用的也是它。 */
  if (isNewYear) {
    saved = NEWYEAR_TRACK;
    try { localStorage.setItem(TKEY, String(NEWYEAR_TRACK)); } catch (e) { }
  }

  /* 跨页续播：元旦那天只认这一首，别把上一页正在放的其他歌接回来 */
  var resumePlaying = !!(pos && pos.playing);
  if (isNewYear && pos && pos.i !== NEWYEAR_TRACK) resumePlaying = false;

  var idx = resumePlaying ? pos.i : (saved >= 0 ? saved : DEFAULT_TRACK);
  var resumeAt = (resumePlaying && pos.t > 0.5) ? pos.t : null;
  var pendingSeek = null;

  /* ---------- 样式 ---------- */
  function injectStyle() {
    if (document.getElementById('bgm-style')) return;
    var st = document.createElement('style');
    st.id = 'bgm-style';
    st.textContent =
      '.bgm-chip{font:inherit;font-size:13px;line-height:1.2;padding:6px 12px;border-radius:999px;' +
      'background:#fff;border:1px solid #d5e0d2;color:#41684e;cursor:pointer;white-space:nowrap;' +
      'flex:0 0 auto;touch-action:manipulation;transition:.15s}' +
      '.bgm-chip:hover{border-color:#c0392b;color:#c0392b}' +
      '.bgm-chip[aria-pressed="false"]{color:#6b7f70;background:#f4f7f1}' +
      '.bgm-chip[aria-expanded="true"]{border-color:#c0392b;color:#c0392b;background:#fdf6f4}' +
      '.bgm-float{position:fixed;right:14px;z-index:1200;border:1px solid #d5e0d2;background:rgba(255,255,255,.95);' +
      'color:#41684e;font-size:13px;padding:9px 14px;border-radius:999px;cursor:pointer;' +
      'box-shadow:0 3px 10px rgba(46,64,52,.18);backdrop-filter:blur(4px)}' +
      /* ---- 选曲面板 ---- */
      '.bgm-panel{position:fixed;z-index:80;width:224px;max-width:calc(100vw - 16px);background:#fff;' +
      'border:1px solid #d5e0d2;border-radius:13px;box-shadow:0 12px 32px rgba(46,64,52,.20);' +
      'padding:9px;font-size:13px;color:#2f3d33;text-align:left}' +
      '.bgm-panel[hidden]{display:none}' +
      '.bgm-panel-h{display:flex;align-items:center;justify-content:space-between;gap:8px;' +
      'padding:1px 4px 8px;border-bottom:1px solid #eef2ec;margin-bottom:6px}' +
      '.bgm-panel-h b{font-weight:600;color:#41684e}' +
      '.bgm-switch{font:inherit;font-size:11px;line-height:1.2;padding:4px 10px;border-radius:999px;cursor:pointer;' +
      'border:1px solid #cfe0cb;background:#f0f7ef;color:#28502f;white-space:nowrap;touch-action:manipulation}' +
      '.bgm-switch[aria-pressed="false"]{border-color:#e0e4de;background:#f4f7f1;color:#6b7f70}' +
      '.bgm-track{display:flex;align-items:center;gap:8px;width:100%;text-align:left;box-sizing:border-box;' +
      'background:transparent;border:1px solid transparent;border-radius:9px;padding:7px 8px;' +
      'font:inherit;color:inherit;cursor:pointer;touch-action:manipulation}' +
      '.bgm-track:hover{background:#f6f9f4}' +
      '.bgm-track.on{background:#f0f7ef;border-color:#cfe0cb;color:#28502f;font-weight:600}' +
      '.bgm-track .bgm-i{width:14px;flex:0 0 auto;text-align:center;color:#b9c9b6;font-size:12px}' +
      '.bgm-track.on .bgm-i{color:#c0392b}' +
      '.bgm-track .bgm-n{flex:1 1 auto;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.bgm-track .bgm-tag{flex:0 0 auto;font-size:10px;color:#8aa892}' +
      '.bgm-track.on .bgm-tag{color:#c0392b}' +
      '.bgm-panel-f{padding:7px 4px 1px;margin-top:6px;border-top:1px solid #eef2ec;font-size:10.5px;' +
      'color:#8aa892;line-height:1.5}';
    document.head.appendChild(st);
  }
  injectStyle();

  /* ---------- 入口按钮 ---------- */
  /* 页面里若已有 <button id="bgm-btn">（本项目 index.html / class.html 都放在顶栏），
     就直接复用，不再生成浮动按钮 —— 否则会浮在右下角、压住手机端的「同学名单」。
     没有的话才兜底生成，位置放左上角（避开右下角常有的操作按钮与 Netlify 徽章）。 */
  var btn = document.getElementById('bgm-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'bgm-btn';
    btn.className = 'bgm-float';
    btn.style.top = 'calc(10px + env(safe-area-inset-top))';
    btn.style.left = 'calc(10px + env(safe-area-inset-left))';
    document.body.appendChild(btn);
  }
  btn.type = 'button';
  btn.classList.add('bgm-chip');
  btn.setAttribute('aria-expanded', 'false');

  /* ---------- 选曲面板 ---------- */
  var panel = document.createElement('div');
  panel.className = 'bgm-panel';
  panel.hidden = true;
  panel.innerHTML =
    '<div class="bgm-panel-h"><b>🎵 背景音乐</b>' +
    '<button type="button" class="bgm-switch"></button></div>' +
    '<div class="bgm-list"></div>' +
    '<div class="bgm-panel-f">与「2班人会飞」共用开关</div>';
  document.body.appendChild(panel);

  var listEl = panel.querySelector('.bgm-list');
  var switchEl = panel.querySelector('.bgm-switch');
  var rowEls = TRACKS.map(function (t, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'bgm-track';
    b.innerHTML = '<span class="bgm-i">♪</span><span class="bgm-n"></span><span class="bgm-tag"></span>';
    b.querySelector('.bgm-n').textContent = t.name;
    b.addEventListener('click', function () { setTrack(i); });
    listEl.appendChild(b);
    return b;
  });

  function render() {
    btn.innerHTML = (on ? '🎵 ' : '🔇 ') + '音乐';
    btn.title = (on ? '关闭背景音乐' : '开启背景音乐') + '（当前：' + TRACKS[idx].name + '）';
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    switchEl.textContent = on ? '已开启' : '已关闭';
    switchEl.setAttribute('aria-pressed', on ? 'true' : 'false');
    switchEl.title = on ? '点击关闭背景音乐' : '点击开启背景音乐';
    rowEls.forEach(function (b, i) {
      var cur = i === idx;
      b.classList.toggle('on', cur);
      b.setAttribute('aria-current', cur ? 'true' : 'false');
      b.querySelector('.bgm-tag').textContent = cur ? (on ? '播放中' : '已选中') : '';
    });
  }

  /* ---------- 播放控制 ---------- */
  function load(i, persist) {
    idx = i;
    audio.src = TRACKS[i].src;
    if (persist !== false) { try { localStorage.setItem(TKEY, String(i)); } catch (e) {} }
    render();
  }

  /* 元数据到手后才能写 currentTime（src 刚设置时写会被忽略），
     这里把「续播位置」落到音频上 */
  audio.addEventListener('loadedmetadata', function () {
    if (pendingSeek == null) return;
    var t = pendingSeek;
    pendingSeek = null;
    try {
      var max = (isFinite(audio.duration) && audio.duration > 0) ? audio.duration - 0.3 : t;
      audio.currentTime = Math.max(0, Math.min(t, max));
    } catch (e) { }
  });

  function play() {
    if (!on) return;
    /* 同一首已经挂上就别重设 src —— 重设会把播放位置清零，
       这正是「切后台再回来 / 切页面」从头开始的原因之一。 */
    if (!audio.src || audio.src.indexOf(TRACKS[idx].src) < 0) load(idx, false);
    if (resumeAt != null) pendingSeek = resumeAt;
    audio.play().then(function () {
      started = true;
      resumeAt = null;          /* 真放起来了，续播位置用完就丢 */
      pendingSeek = null;
      render();
    }).catch(function () { /* 尚未获得交互授权，等下一次手势 */ });
  }
  function pause() { audio.pause(); }
  function toggle() {
    on = !on;
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) {}
    on ? play() : pause();
    render();
  }
  /* 选曲：点一首即视为「要听这首」，音乐关着就顺手打开 */
  function setTrack(i) {
    if (!(i >= 0 && i < TRACKS.length)) return;
    var wasOff = !on;
    if (wasOff) { on = true; try { localStorage.setItem(KEY, '1'); } catch (e) {} }
    load(i);
    if (on) play();
    if (wasOff) render();
  }

  audio.addEventListener('ended', function () { load((idx + 1) % TRACKS.length); play(); });
  audio.addEventListener('error', function () { started = false; });
  btn.addEventListener('click', function (e) { e.stopPropagation(); togglePanel(); });
  switchEl.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
  render();

  /* ---------- 面板开关与定位（贴住入口按钮，右侧对齐，不超出视口） ---------- */
  function place() {
    var r = btn.getBoundingClientRect();
    var w = panel.offsetWidth || 224;
    var left = Math.min(r.right - w, window.innerWidth - w - 8);
    left = Math.max(8, left);
    var h = panel.offsetHeight || 190;
    var top = Math.min(r.bottom + 8, window.innerHeight - h - 8);
    panel.style.left = Math.round(left) + 'px';
    panel.style.top = Math.round(Math.max(8, top)) + 'px';
  }
  function openPanel() {
    panel.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    place();
  }
  function closePanel() {
    panel.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  }
  function togglePanel() { panel.hidden ? openPanel() : closePanel(); }

  document.addEventListener('pointerdown', function (e) {
    if (panel.hidden) return;
    if (panel.contains(e.target) || btn.contains(e.target)) return;
    closePanel();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) closePanel();
  });
  window.addEventListener('resize', function () { if (!panel.hidden) place(); });
  window.addEventListener('scroll', function () { if (!panel.hidden) place(); }, true);

  /* ---------- 首次用户交互后自动开声（绕过自动播放限制） ---------- */
  function unlock() {
    if (on) play();
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
      document.removeEventListener(ev, unlock);
    });
  }
  if (on) {
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
      document.addEventListener(ev, unlock, { once: true, passive: true });
    });
  }

  /* 上一页正在放 → 新页面一加载就试着接上。
     浏览器允许自动播放时才真的出声；被拦下也没事，第一次点击时 unlock 会接着放。 */
  if (on && resumePlaying) play();

  /* ---------- 切到后台时暂停，回来再续 ---------- */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) pause();
    else if (on && started) play();
  });

  window.BGM = {
    toggle: toggle, play: play, pause: pause, setTrack: setTrack,
    tracks: function () { return TRACKS.map(function (t) { return t.name; }); },
    index: function () { return idx; },
    current: function () { return TRACKS[idx].name; },
    isOn: function () { return on; },
    src: function () { return audio.src.split('/').pop(); },
    paused: function () { return audio.paused; },
    pos: function () { return audio.currentTime || 0; },   /* 调试：当前播放到第几秒 */
    open: openPanel, close: closePanel
  };
})();
