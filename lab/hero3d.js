/* ============================================================
 * 百廿光冠 · 程序化 Three.js 首屏背景
 * ------------------------------------------------------------
 * 零素材：不加载任何图片/模型。所有几何、材质、光晕都在运行时生成。
 *   · 120 根细金柱围成一圈，柱高按双峰曲线起伏（对应 1906—2026）
 *   · 三圈不同倾角与转速的细环，制造纵深
 *   · 漂浮金尘（Points + 加法混合）
 *   · 指针视差：鼠标/手指移动时整体轻微偏转
 *
 * 用法：
 *   <canvas id="hero3d"></canvas>
 *   <script src="three.min.js"></script>
 *   <script src="hero3d.js"></script>
 *   YCYEZ_HERO.mount(document.getElementById('hero3d'))
 *
 * 降级：没有 WebGL、或用户开启「减少动态效果」时，只渲染一帧静帧；
 *       WebGL 不可用则返回 false，调用方保持原有 CSS 视觉即可。
 * ============================================================ */
(function(){
  var GOLD   = 0xc9973f;
  var GOLD_HI= 0xf2d992;
  var RED    = 0xa9291c;

  function mount(canvas, opt){
    opt = opt || {};
    if (!window.THREE || !canvas) return false;

    /* ---------- 渲染器 ---------- */
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch (e) {
      return false;                       /* 无 WebGL：交给 CSS 视觉 */
    }
    var reduce = false;
    try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    /* 高分屏最多 1.5 倍：这张画面是虚化的背景层，1.5 与 2 肉眼无差，像素少 44% */
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;

    var scene  = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 40);
    camera.position.set(0, 0.42, 3.95);
    camera.lookAt(0, 0.05, 0);

    /* ---------- 程序化环境反射（金色要好看，靠的是环境，不是灯） ---------- */
    (function(){
      var c = document.createElement('canvas');
      c.width = 256; c.height = 128;
      var g = c.getContext('2d');
      var grd = g.createLinearGradient(0, 0, 0, 128);
      grd.addColorStop(0,    '#fff8e8');
      grd.addColorStop(0.38, '#c98b52');
      grd.addColorStop(0.56, '#59200f');
      grd.addColorStop(1,    '#1a0703');
      g.fillStyle = grd; g.fillRect(0, 0, 256, 128);
      /* 两道亮带：旋转时形成扫光 */
      g.fillStyle = 'rgba(255,255,255,.92)';
      g.fillRect(40, 12, 18, 46);
      g.fillRect(168, 6, 30, 58);
      var tex = new THREE.CanvasTexture(c);
      tex.mapping = THREE.EquirectangularReflectionMapping;
      if ('colorSpace' in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
      scene.environment = tex;
    })();

    /* ---------- 材质（共用，减少状态切换） ---------- */
    var matGold = new THREE.MeshStandardMaterial({
      color: GOLD, metalness: 0.96, roughness: 0.26, envMapIntensity: 1.05
    });
    var matGoldDim = new THREE.MeshStandardMaterial({
      color: 0x8d6a2c, metalness: 0.9, roughness: 0.42, envMapIntensity: 0.8,
      transparent: true, opacity: 0.75
    });
    var matRed = new THREE.MeshStandardMaterial({
      color: RED, metalness: 0.45, roughness: 0.45, envMapIntensity: 0.9,
      emissive: 0x66100a, emissiveIntensity: 0.55
    });

    var root = new THREE.Group();
    root.rotation.x = -0.40;              /* 略俯视，让环的椭圆透视出来 */
    root.rotation.z = 0.10;
    scene.add(root);

    /* ---------- 底层光晕（程序化径向渐变，加法混合，纯色更"发光"） ---------- */
    (function(){
      var S = 256, c = document.createElement('canvas');
      c.width = c.height = S;
      var g = c.getContext('2d');
      var grd = g.createRadialGradient(S/2, S/2, 0, S/2, S/2, S/2);
      grd.addColorStop(0,   'rgba(255,226,160,.55)');
      grd.addColorStop(0.35,'rgba(233,168,86,.26)');
      grd.addColorStop(0.7, 'rgba(160,60,30,.10)');
      grd.addColorStop(1,   'rgba(120,30,16,0)');
      g.fillStyle = grd; g.fillRect(0, 0, S, S);
      var tex = new THREE.CanvasTexture(c);
      if ('colorSpace' in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
      var glow = new THREE.Mesh(
        new THREE.PlaneGeometry(3.6, 3.6),
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
      );
      glow.position.set(0, 0.05, -0.55);
      root.add(glow);
    })();

    /* ---------- 120 根金柱（外圈）+ 60 根矮柱（内圈） ---------- */
    function pillarRing(count, radius, baseH, peakH, thickness, mat, yOff){
      var geo = new THREE.BoxGeometry(thickness, 1, thickness);
      geo.translate(0, 0.5, 0);           /* 让 y=0 为底面，方便按高度缩放 */
      var mesh = new THREE.InstancedMesh(geo, mat, count);
      var m = new THREE.Matrix4(), q = new THREE.Quaternion(),
          p = new THREE.Vector3(), s = new THREE.Vector3(), up = new THREE.Vector3(0,1,0);
      for (var i = 0; i < count; i++){
        var a = i / count * Math.PI * 2;
        /* 双峰起伏（两个"百年"的轮廓）+ 细密抖动，避免看起来像规则栅栏 */
        var h = baseH
              + peakH * Math.pow(Math.abs(Math.sin(a * 2)), 1.5)
              + 0.05 * Math.sin(a * 9 + 1.2)
              + 0.03 * Math.sin(a * 23);
        p.set(Math.cos(a) * radius, yOff, Math.sin(a) * radius);
        q.setFromAxisAngle(up, -a);
        s.set(1, Math.max(h, 0.04), 1);
        m.compose(p, q, s);
        mesh.setMatrixAt(i, m);
      }
      mesh.instanceMatrix.needsUpdate = true;
      root.add(mesh);
      return mesh;
    }
    pillarRing(120, 1.06, 0.10, 0.46, 0.010, matGold, -0.16);
    pillarRing(60,  0.68, 0.06, 0.22, 0.008, matGoldDim, -0.155);

    /* ---------- 三圈细环 ---------- */
    var rings = [];
    [[1.06, 0.0035, 0], [1.34, 0.0022, 0.22], [0.72, 0.0028, -0.18]].forEach(function(r, k){
      var g = new THREE.TorusGeometry(r[0], r[1], 6, 180);
      var m = new THREE.Mesh(g, k === 1 ? matGoldDim : matGold);
      m.rotation.x = Math.PI / 2 + r[2];
      m.position.y = -0.15 + k * 0.02;
      root.add(m);
      rings.push(m);
    });

    /* ---------- 中央红盘（与站点主色呼应，作为视觉锚点） ---------- */
    var disc = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.014, 64), matRed);
    disc.position.y = -0.145;
    root.add(disc);

    /* ---------- 金尘 ---------- */
    var DUST = window.innerWidth < 700 ? 260 : 520;
    var dustGeo = new THREE.BufferGeometry();
    var dpos = new Float32Array(DUST * 3);
    var dseed = new Float32Array(DUST);
    for (var d = 0; d < DUST; d++){
      var ang = Math.random() * Math.PI * 2;
      var rad = 0.55 + Math.pow(Math.random(), 0.7) * 1.35;
      dpos[d*3]     = Math.cos(ang) * rad;
      dpos[d*3 + 1] = (Math.random() - 0.5) * 1.15;
      dpos[d*3 + 2] = Math.sin(ang) * rad;
      dseed[d] = Math.random();
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
    var dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
      color: GOLD_HI, size: 0.017, sizeAttenuation: true,
      transparent: true, opacity: 0.75, depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    scene.add(dust);

    /* ---------- 灯光 ---------- */
    scene.add(new THREE.AmbientLight(0xfff0d8, 0.55));
    var key = new THREE.DirectionalLight(0xfff6e8, 1.5); key.position.set(2.4, 3.0, 2.0); scene.add(key);
    var rim = new THREE.DirectionalLight(0xd98a4a, 1.0); rim.position.set(-2.6, 1.2, -2.2); scene.add(rim);
    var fill = new THREE.DirectionalLight(0xffe9c8, 0.45); fill.position.set(0, -2.2, 1.2); scene.add(fill);

    /* ---------- 尺寸 ---------- */
    function resize(){
      var w = canvas.clientWidth || canvas.parentNode.clientWidth || 1;
      var h = canvas.clientHeight || canvas.parentNode.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      /* 窄屏把相机推远，避免环被裁掉；宽屏拉近一点更有压迫感 */
      camera.position.z = w / h < 0.85 ? 5.4 : 3.95;
      camera.updateProjectionMatrix();
      /* 尺寸变化后立刻补一帧：否则动画被暂停时（后台标签页/减少动效）
         画面上留着的还是上一尺寸的旧帧，甚至是一帧空白 */
      if (!raf) renderer.render(scene, camera);
    }
    resize();
    if (window.ResizeObserver){
      new ResizeObserver(resize).observe(canvas.parentNode || canvas);
    } else {
      window.addEventListener('resize', resize);
    }

    /* ---------- 指针视差 ---------- */
    var px = 0, py = 0, tx = 0, ty = 0;
    function onMove(e){
      var p = e.touches ? e.touches[0] : e;
      tx = (p.clientX / window.innerWidth  - 0.5) * 2;
      ty = (p.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener('pointermove', onMove, {passive: true});
    window.addEventListener('touchmove', onMove, {passive: true});

    /* ---------- 动画 ---------- */
    var t0 = performance.now(), raf = 0, running = true;

    function frame(now){
      if (!running) return;
      var t = (now - t0) / 1000;

      /* 视差：缓动跟随，避免跟手太紧显得廉价 */
      px += (tx - px) * 0.045;
      py += (ty - py) * 0.045;
      root.rotation.y = t * 0.13 + px * 0.22;
      root.rotation.x = -0.30 + py * 0.10;
      root.position.y = Math.sin(t * 0.7) * 0.02;

      /* 环各自缓慢反向转，制造层次 */
      rings[0].rotation.z =  t * 0.05;
      rings[1].rotation.z = -t * 0.08;
      rings[2].rotation.z =  t * 0.11;

      /* 金尘：整体缓慢上浮 + 呼吸 */
      dust.rotation.y = -t * 0.04;
      dust.position.y = Math.sin(t * 0.5) * 0.05;
      dust.material.opacity = 0.62 + Math.sin(t * 1.1) * 0.10;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }

    function start(){ if (!raf && !reduce) { running = true; raf = requestAnimationFrame(frame); } }
    function stop(){ running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }

    if (reduce){
      renderer.render(scene, camera);     /* 静态一帧，不再动 */
    } else {
      raf = requestAnimationFrame(frame);
      /* 切到后台、或画布滚出视口就停掉，别白烧 GPU/电 */
      document.addEventListener('visibilitychange', function(){
        if (document.hidden) stop();
        else { renderer.render(scene, camera); start(); }
      });
      if (window.IntersectionObserver){
        new IntersectionObserver(function(en){
          en[0].isIntersecting ? start() : stop();
        }, {threshold: 0}).observe(canvas);
      }
    }

    return {
      renderer: renderer,
      stop: stop,
      start: start,
      info: function(){ return renderer.info.render; }
    };
  }

  window.YCYEZ_HERO = { mount: mount };
})();
