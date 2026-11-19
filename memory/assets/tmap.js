/* ============================================================================
   蹭饭图 · 共享腾讯地图模块
   ----------------------------------------------------------------------------
   用法（在 class.html / index.html 里）：
     <script>var TENCENT_MAP_KEY = '';</script>   <!-- 部署时填自己的 key -->
     <script src="assets/tmap.js" defer></script>
     <div id="map"></div>                          <!-- 地图容器 -->
     TMAP.init({ containerId:'map', onSelect:function(city){...} });

   说明：
   - 本模块只负责「把 CITY_COORD 里的城市画到腾讯地图上」，不含任何业务数据。
   - 城市经纬度按各区/市驻地取值，够用即可；新增城市直接往 CITY_COORD 里加。
   - 同一城市有多个校区时不做散开处理（班级地图视野小，重叠不明显）。
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 城市经纬度表（经度 lng, 纬度 lat） ---------- */
  var CITY_COORD = {
    /* —— 直辖市 —— */
    '北京':       [116.4074, 39.9042],
    '上海':       [121.4737, 31.2304],
    '天津':       [117.2010, 39.0842],
    '重庆':       [106.5516, 29.5630],
    /* —— 宁夏（生源地，重点） —— */
    '银川':       [106.2309, 38.4872],
    '宁夏':       [106.2309, 38.4872],
    /* —— 陕西 —— */
    '西安':       [108.9398, 34.3416],
    '咸阳':       [108.7051, 34.3330],
    '陕西':       [108.9398, 34.3416],
    /* —— 甘肃 / 青海 / 新疆 —— */
    '兰州':       [103.8343, 36.0611],
    '甘肃':       [103.8343, 36.0611],
    '西宁':       [101.7782, 36.6171],
    '青海':       [101.7782, 36.6171],
    '乌鲁木齐':   [87.6168, 43.8256],
    '克拉玛依':   [84.8890, 45.5799],
    '石河子':     [86.0411, 44.3054],
    '新疆':       [87.6168, 43.8256],
    /* —— 四川 / 重庆 —— */
    '成都':       [104.0665, 30.5723],
    '四川':       [104.0665, 30.5723],
    '绵阳':       [104.6796, 31.4675],
    '南充':       [106.1107, 30.8373],
    '宜宾':       [104.6428, 28.7520],
    /* —— 云南 / 贵州 —— */
    '昆明':       [102.8329, 24.8801],
    '云南':       [102.8329, 24.8801],
    '大理':       [100.2676, 25.6065],
    '贵阳':       [106.6302, 26.6477],
    '贵州':       [106.6302, 26.6477],
    /* —— 湖北 / 湖南 —— */
    '武汉':       [114.3055, 30.5928],
    '湖北':       [114.3055, 30.5928],
    '宜昌':       [111.2865, 30.6919],
    '襄阳':       [112.1226, 32.0090],
    '长沙':       [112.9388, 28.2282],
    '湖南':       [112.9388, 28.2282],
    '湘潭':       [112.9447, 27.8298],
    '吉首':       [109.7398, 28.3143],
    '衡阳':       [112.5719, 26.8933],
    /* —— 河南 / 河北 / 山西 / 山东 —— */
    '郑州':       [113.6254, 34.7466],
    '河南':       [113.6254, 34.7466],
    '洛阳':       [112.4540, 34.6197],
    '石家庄':     [114.5025, 38.0455],
    '保定':       [115.4646, 38.8740],
    '唐山':       [118.1802, 39.6307],
    '廊坊':       [116.6835, 39.5379],
    '秦皇岛':     [119.5860, 39.9354],
    '河北':       [114.5025, 38.0455],
    '太原':       [112.5489, 37.8570],
    '山西':       [112.5489, 37.8570],
    '济南':       [117.0009, 36.6512],
    '青岛':       [120.3826, 36.0671],
    '泰安':       [117.0879, 36.1997],
    '威海':       [122.1201, 37.5133],
    '烟台':       [121.4479, 37.4638],
    '山东':       [117.0009, 36.6512],
    /* —— 江苏 / 安徽 —— */
    '南京':       [118.7969, 32.0603],
    '苏州':       [120.5853, 31.2989],
    '无锡':       [120.3119, 31.4912],
    '徐州':       [117.1848, 34.2618],
    '镇江':       [119.4528, 32.1868],
    '扬州':       [119.4212, 32.3933],
    '南通':       [120.8943, 31.9802],
    '常州':       [119.9740, 31.8112],
    '江苏':       [118.7969, 32.0603],
    '合肥':       [117.2272, 31.8206],
    '芜湖':       [118.3766, 31.3263],
    '淮南':       [117.0183, 32.6255],
    '马鞍山':     [118.5067, 31.6705],
    '安徽':       [117.2272, 31.8206],
    /* —— 浙江 / 江西 / 福建 —— */
    '杭州':       [120.1551, 30.2741],
    '宁波':       [121.5440, 29.8683],
    '温州':       [120.6994, 27.9944],
    '金华':       [119.6497, 29.0895],
    '嘉兴':       [120.7555, 30.7460],
    '浙江':       [120.1551, 30.2741],
    '南昌':       [115.8582, 28.6829],
    '江西':       [115.8582, 28.6829],
    '福州':       [119.2965, 26.0745],
    '厦门':       [118.0894, 24.4798],
    '泉州':       [118.6757, 24.8741],
    '福建':       [119.2965, 26.0745],
    /* —— 广东 / 广西 / 海南 —— */
    '广州':       [113.2644, 23.1291],
    '深圳':       [114.0579, 22.5431],
    '珠海':       [113.5530, 22.2250],
    '东莞':       [113.7518, 23.0207],
    '佛山':       [113.1220, 23.0288],
    '汕头':       [116.7080, 23.3710],
    '湛江':       [110.3594, 21.2707],
    '广东':       [113.2644, 23.1291],
    '南宁':       [108.3669, 22.8170],
    '桂林':       [110.2993, 25.2740],
    '广西':       [108.3669, 22.8170],
    '海口':       [110.3312, 20.0311],
    '三亚':       [109.5082, 18.2479],
    '海南':       [110.3312, 20.0311],
    /* —— 东北 —— */
    '沈阳':       [123.4315, 41.8057],
    '大连':       [121.6147, 38.9140],
    '鞍山':       [122.9946, 41.1105],
    '锦州':       [121.1357, 41.1195],
    '辽宁':       [123.4315, 41.8057],
    '长春':       [125.3235, 43.8171],
    '吉林':       [126.5496, 43.8378],
    '延边':       [129.5093, 42.8913],
    '哈尔滨':     [126.5349, 45.8038],
    '大庆':       [125.1030, 46.5895],
    '黑龙江':     [126.5349, 45.8038],
    /* —— 港澳 —— */
    '香港':       [114.1734, 22.3200],
    '澳门':       [113.5492, 22.1987],
    /* —— 校园（银川一中本区，作参照点） —— */
    '银川一中':   [106.2300, 38.4900],
    /* 兜底：名称里带「大学/学院」但城市未单列时，落到其所在省会 */
    '南方科技大学': [114.0579, 22.5431]
  };

  /* 省份名 → 代表性城市（用于「地区名只是省」的兜底） */
  var PROV_CITY = {
    '北京市':'北京','天津市':'天津','上海市':'上海','重庆市':'重庆',
    '河北省':'石家庄','山西省':'太原','内蒙古自治区':'呼和浩特','辽宁省':'沈阳',
    '吉林省':'长春','黑龙江省':'哈尔滨','江苏省':'南京','浙江省':'杭州',
    '安徽省':'合肥','福建省':'福州','江西省':'南昌','山东省':'济南',
    '河南省':'郑州','湖北省':'武汉','湖南省':'长沙','广东省':'广州',
    '广西壮族自治区':'南宁','海南省':'海口','四川省':'成都','贵州省':'贵阳',
    '云南省':'昆明','西藏自治区':'拉萨','陕西省':'西安','甘肃省':'兰州',
    '青海省':'西宁','宁夏回族自治区':'银川','新疆维吾尔自治区':'乌鲁木齐',
    '香港特别行政区':'香港','澳门特别行政区':'澳门','台湾省':'台北'
  };

  /* CITY_COORD 里按「省名」写入的别名键：仅作定位兜底，不作为显示用的城市名
     （否则「湖南大学」「湘潭大学」两个点都会被打上「湖南」标签）
     注意：「吉林」不加进来 —— 它本身就是地级市（吉林市），必须可用于显示 */
  var PROV_ALIAS = {
    '宁夏':1,'陕西':1,'甘肃':1,'青海':1,'新疆':1,'四川':1,'云南':1,'贵州':1,
    '湖北':1,'湖南':1,'河南':1,'河北':1,'山西':1,'山东':1,'江苏':1,'安徽':1,
    '浙江':1,'江西':1,'福建':1,'广东':1,'广西':1,'海南':1,'辽宁':1,
    '黑龙江':1,'内蒙古':1,'西藏':1,'台湾':1
  };

  /* 校名里不含所在城市、且「省名→省会」兜底会猜错的高校：显式指定到地级市
     （只列会出错的；能自解释的学校名无需登记） */
  var UNI_CITY = {
    /* 吉林市 ≠ 长春 */
    '吉林大学':'长春', '东北师范大学':'长春', '东北电力大学':'吉林',
    /* 山东：省会兜底会落到济南，但这些学校在青岛 */
    '中国海洋大学':'青岛', '中国石油大学(华东)':'青岛', '山东科技大学':'青岛',
    /* 江苏：省会兜底会落到南京 */
    '中国矿业大学':'徐州', '江苏大学':'镇江', '江苏科技大学':'镇江',
    '江南大学':'无锡', '西交利物浦大学':'苏州',
    /* 河北 */
    '中国人民警察大学':'廊坊', '华北理工大学':'唐山',
    /* 安徽 */
    '安徽理工大学':'淮南',
    /* 湖北（武汉之外） */
    '华中农业大学':'武汉', '三峡大学':'宜昌',
    /* 其他易错 */
    '陆军军医大学':'重庆', '中国石油大学(北京)克拉玛依校区':'克拉玛依',
    '国防科技大学':'长沙', '中南大学':'长沙', '中南林业科技大学':'长沙',
    '湖南大学':'长沙', '信息工程大学':'郑州', '网络空间部队信息工程大学':'郑州',
    '解放军信息工程大学':'郑州', '武警工程大学':'西安', '石河子大学':'石河子',
    /* 分校 / 校区：校名里同时含「本部城市」和「校区城市」时，「包含城市名」的兜底
       会命中靠前的本部（如「哈尔滨工业大学(深圳)」→ 哈尔滨），必须显式指定 */
    '哈尔滨工业大学(深圳)':'深圳', '哈尔滨工业大学深圳校区':'深圳',
    '哈尔滨工业大学(威海)':'威海', '北京师范大学珠海分校':'珠海',
    '北京邮电大学(海南校区)':'海口',
    /* 校名里没有任何 CITY_COORD 词条的（否则落不到地图点） */
    '中国科学技术大学':'合肥'
  };

  /**
   * 从「大学·城市」字符串里解析出城市名，返回 [lng,lat] 或 null
   * 支持：'宁夏大学' / '西安交通大学·西安' / '陕西省' / '北京市' /
   *       '广东省 / 河南省 / 重庆市'（多值取第一个）/ '清华大学·北京'
   */
  function geocode(raw) {
    if (!raw) return null;
    var s = String(raw).trim();

    /* 多地区串（如「上海市 / 浙江省」）→ 取第一个能识别的 */
    if (s.indexOf('/') >= 0) {
      var parts = s.split('/');
      for (var i = 0; i < parts.length; i++) {
        var got = geocode(parts[i].trim());
        if (got) return got;
      }
      return null;
    }

    /* 校名里不含城市、且省名兜底会猜错的，直接查表（优先级最高） */
    if (UNI_CITY[s] && CITY_COORD[UNI_CITY[s]]) return CITY_COORD[UNI_CITY[s]];

    /* 「大学·城市」→ 取最后一个 · 后的城市；城市名里不应含「大学/学院」 */
    if (s.indexOf('·') >= 0) {
      var seg = s.split('·').pop().trim();
      if (CITY_COORD[seg]) return CITY_COORD[seg];
      var g1 = geocode(seg);
      if (g1) return g1;
      /* 「XX大学·XX」里的城市没能识别 → 继续走校名表 */
      var base = s.split('·')[0].trim();
      if (UNI_CITY[base] && CITY_COORD[UNI_CITY[base]]) return CITY_COORD[UNI_CITY[base]];
    }

    /* 直接命中城市名 */
    if (CITY_COORD[s]) return CITY_COORD[s];

    /* 省 / 直辖市全称 → 省会 */
    if (PROV_CITY[s] && CITY_COORD[PROV_CITY[s]]) return CITY_COORD[PROV_CITY[s]];

    /* 去掉省/市/自治区后缀再试 */
    var short = s.replace(/(省|市|回族自治区|维吾尔自治区|壮族自治区|自治区|特别行政区)$/, '');
    if (CITY_COORD[short]) return CITY_COORD[short];
    if (PROV_CITY[s]) return CITY_COORD[PROV_CITY[s]];

    /* 名称里包含已知城市名（如「哈尔滨工业大学(威海)」→威海；「山东大学(威海)」） */
    var keys = Object.keys(CITY_COORD).sort(function (a, b) { return b.length - a.length; });
    for (var k = 0; k < keys.length; k++) {
      if (short.indexOf(keys[k]) >= 0) return CITY_COORD[keys[k]];
    }
    /* 检查括号里的城市，如「哈尔滨工业大学(威海)」 */
    var m = s.match(/[（(]([^）)]+)[）)]/);
    if (m) {
      var inner = m[1].replace(/(校区|分校|校区）)$/, '').trim();
      if (CITY_COORD[inner]) return CITY_COORD[inner];
      if (PROV_CITY[inner] && CITY_COORD[PROV_CITY[inner]]) return CITY_COORD[PROV_CITY[inner]];
    }
    return null;
  }

  /**
   * 反查：给定经纬度，返回对应的「地级市」名称（跳过省名别名键）。
   * 用途：数据里只有校名（如「湘潭大学」「中南林业科技大学」）时，
   *       由坐标反推出显示用的地级市名，避免相邻两个点都标成「湖南」。
   * @param {number} lng
   * @param {number} lat
   * @param {number} [tol] 容差（度），默认 0.05 ≈ 5km
   */
  function cityNameByCoord(lng, lat, tol) {
    var best = null, bestD = (typeof tol === 'number' ? tol : 0.05);
    Object.keys(CITY_COORD).forEach(function (name) {
      if (PROV_ALIAS[name]) return;              /* 省名别名不作为城市名显示 */
      var c = CITY_COORD[name];
      var d = Math.abs(c[0] - lng) + Math.abs(c[1] - lat);
      if (d < bestD) { bestD = d; best = name; }
    });
    return best;
  }

  /* ---------- 地图渲染 ---------- */
  var map = null, marker = null, label = null, pop = null;
  var opts = null, ready = false;
  var curLift = 12;   /* 当前缩放下的标签抬升量（px），弹窗据此避让 */

  function svgIcon(color, r) {
    var size = r * 2 + 4;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '">' +
      '<circle cx="' + (r + 2) + '" cy="' + (r + 2) + '" r="' + r + '" fill="' + color +
      '" stroke="#ffffff" stroke-width="2.5"/></svg>';
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  var IS_MOBILE = window.matchMedia('(max-width:900px)').matches;

  /**
   * 初始化地图
   * @param {Object} o { containerId, points:[{city,lng,lat,count,students:[..]}],
   *                     onCityClick(city) — 点城市标签 / 标注时回调 }
   */
  function init(o) {
    opts = o || {};
    if (typeof TMap === 'undefined') { fallback(); return; }
    try { render(); ready = true; } catch (e) { fallback(); }
  }

  /* 计算刚好装下所有点的中心与缩放 */
  function fitView(points) {
    if (!points.length) return { center: [106.23, 38.49], zoom: 5 };
    var lngs = points.map(function (p) { return p.lng; });
    var lats = points.map(function (p) { return p.lat; });
    var minLng = Math.min.apply(null, lngs), maxLng = Math.max.apply(null, lngs);
    var minLat = Math.min.apply(null, lats), maxLat = Math.max.apply(null, lats);
    var cx = (minLng + maxLng) / 2, cy = (minLat + maxLat) / 2;
    var el = document.getElementById(opts.containerId);
    var w = (el && el.clientWidth) || 800, h = (el && el.clientHeight) || 520;
    /* 留 22% 边距，并把单点/同城的情况兜住 */
    var spanLng = Math.max(maxLng - minLng, 1.2);
    var spanLat = Math.max(maxLat - minLat, 0.9);
    var zW = Math.log(w * 360 / (256 * spanLng * 1.55)) / Math.LN2;
    var zH = Math.log(h * 360 / (256 * spanLat * 1.55)) / Math.LN2;
    var z = Math.min(zW, zH);
    return { center: [cx, cy], zoom: Math.max(3.2, Math.min(11, isFinite(z) ? z : 4)) };
  }

  function render() {
    var pts = (opts.points || []).filter(function (p) {
      return typeof p.lng === 'number' && typeof p.lat === 'number';
    });
    var v = fitView(pts);

    map = new TMap.Map(opts.containerId, {
      center: new TMap.LatLng(v.center[1], v.center[0]),
      zoom: v.zoom,
      viewMode: '2D'
    });

    var kR = IS_MOBILE ? 10 : 8;
    marker = new TMap.MultiMarker({
      map: map,
      styles: {
        dot: new TMap.MarkerStyle({
          width: kR * 2 + 4, height: kR * 2 + 4, src: svgIcon('#c0392b', kR),
          anchor: { x: kR + 2, y: kR + 2 }
        })
      },
      geometries: pts.map(function (p, i) {
        return { id: 'p' + i, styleId: 'dot', position: new TMap.LatLng(p.lat, p.lng) };
      })
    });

    /* 城市名常显标签（腾讯地图原生 Label 不支持点击，这里用 DOM 覆盖层实现） */
    buildCityChips(pts, v);

    ensurePop();

    marker.on('click', function (evt) {
      if (!evt.geometry) return;
      var p = pts[parseInt(evt.geometry.id.slice(1), 10)];
      if (!p) return;
      showPop(p);
      fireCity(p.city);
    });
    map.on('click', closePop);

    /* ---------- 标签定位：随缩放变化的抬升量 + 标签间最小间距 ---------- */

    /* 每 1° 纬度对应多少像素（用来把抬升量换算成「地理距离」） */
    function pxPerDegLat() {
      try {
        var c = map.getCenter();
        var a = map.projectToContainer(new TMap.LatLng(c.lat, c.lng));
        var b = map.projectToContainer(new TMap.LatLng(c.lat + 0.01, c.lng));
        var d = Math.abs(b.y - a.y) / 0.01;
        return d > 0 ? d : 1;
      } catch (e) { return 1; }
    }

    /* 标签中心离红点中心的距离：
       不是写死的像素值，而是「固定的一段地理距离」在当前缩放下的像素长度，
       于是放大时标签自然拉开、缩小时自然靠拢；再夹在 [22, 52] px 内，
       下限保证标签不会压到红点（红点半径 ≈10px），上限避免缩太远。 */
    var LIFT_DEG = 0.032;      /* ≈3.5km，等效参考距离 */
    function liftPx() {
      var px = pxPerDegLat() * LIFT_DEG;
      return Math.max(22, Math.min(52, px + (kR + 6)));
    }

    /* 标签落位策略：
       1) 默认永远贴在「红点正上方」（距离由 liftPx 随缩放给定）；
       2) 只有真的和已放标签重叠才移动，而且「够用就停」——
          先在正上方基础上向上叠、或落到红点正下方，再左右让开「刚好不压住」的距离；
       3) 以上都不行 → 隐藏（红点仍可点，右侧名单可查），绝不甩到远处。
       于是相距较远的城市（如合肥、香港）不会被无谓地推开，只有真正挤在一起
       （如西安/咸阳、香港/深圳）才会错开最小距离。
       视野较小时标签自动变小（.dense），因此概览下绝大多数城市名都能同时显示。 */
    var GAP_X = 6, GAP_Y = 4, DENSE_ZOOM = 6.2;
    function syncChips() {
      var nodes = document.querySelectorAll('#tmap-chips .city-chip');
      if (!nodes.length) return;

      var lift = liftPx();
      var dense = false;
      try { dense = map.getZoom() < DENSE_ZOOM; } catch (e) {}
      var box = document.getElementById('tmap-chips');
      if (box) box.classList.toggle('dense', dense);   /* 缩小时标签更紧凑 */

      var items = [];
      Array.prototype.forEach.call(nodes, function (el) {
        try {
          var px = map.projectToContainer(new TMap.LatLng(+el.dataset.lat, +el.dataset.lng));
          var w = el.offsetWidth || 68, h = el.offsetHeight || 22;
          items.push({
            el: el, w: w, h: h, ax: px.x, ay: px.y,
            lat: +el.dataset.lat, lng: +el.dataset.lng,
            count: parseInt(el.dataset.count || '0', 10)
          });
        } catch (e) {}
      });

      /* 先放「人多的城市」；同人数用经纬度排序，避免拖动地图时顺序抖动 */
      items.sort(function (a, b) {
        var d = b.count - a.count;
        if (d) return d;
        return (b.lat - a.lat) || (a.lng - b.lng);
      });

      var dotR = IS_MOBILE ? 12 : 10;
      var CW = (box && box.clientWidth) || 800;
      var CH = (box && box.clientHeight) || 600;
      var MARGIN = 60;   /* 红点已在视口外（含少量缓冲区）就不要再放标签 */
      var GAP_DOT = 4;   /* 标签与红点之间至少留出的空隙 */

      var live = [], placed = [];
      items.forEach(function (it) {
        if (it.ax < -MARGIN || it.ax > CW + MARGIN ||
            it.ay < -MARGIN || it.ay > CH + MARGIN) {
          it.el.style.visibility = 'hidden';   /* 用 visibility 而非 display：尺寸仍可量到 */
          return;
        }
        it.defY = it.ay - lift - it.h / 2;   /* 默认位置：红点正上方 */
        it.keep = false;
        it.hidden = false;
        live.push(it);
      });

      function rectHit(x, y, w, h, b) {
        return Math.abs(x - b.x) < (w + b.w) / 2 + GAP_X &&
               Math.abs(y - b.y) < (h + b.h) / 2 + GAP_Y;
      }
      function hitOf(x, y, it) {
        for (var i = 0; i < placed.length; i++) {
          if (rectHit(x, y, it.w, it.h, placed[i])) return placed[i];
        }
        return null;
      }
      function inside(x, y, it) {
        return x - it.w / 2 >= 2 && x + it.w / 2 <= CW - 2 &&
               y - it.h / 2 >= 2 && y + it.h / 2 <= CH - 2;
      }
      /* 标签不能压住自己的红点（横向已经错开则无所谓） */
      function notOnDot(x, y, it) {
        if (Math.abs(x - it.ax) >= it.w / 2 + dotR) return true;
        return y + it.h / 2 <= it.ay - dotR - GAP_DOT ||
               y - it.h / 2 >= it.ay + dotR + GAP_DOT;
      }
      /* 把位置就近夹到「不压红点」的最近一处 */
      function fitDot(x, y, it) {
        if (Math.abs(x - it.ax) >= it.w / 2 + dotR) return { x: x, y: y };
        var up = it.ay - dotR - GAP_DOT - it.h / 2;   /* 贴着红点上沿 */
        var dn = it.ay + dotR + GAP_DOT + it.h / 2;   /* 贴着红点下沿 */
        if (y <= up || y >= dn) return { x: x, y: y };
        return { x: x, y: (y - up <= dn - y) ? up : dn };
      }

      /* ---- 第一步：默认位互不影响的标签原样不动 -------------------------
         只有当某个标签的默认位，和「优先级更高、且它自己不用动」的标签重叠时，
         才把它列为需要让位的（movers）。这样「相距较远、本来就不重叠」的城市
         永远不会被推开；也避免了「一个标签挪走 → 旁边跟着挪」的连锁位移。 */
      var anchors = [], movers = [];
      live.forEach(function (it) {
        var blocked = false;
        for (var i = 0; i < anchors.length; i++) {
          if (rectHit(it.ax, it.defY, it.w, it.h, anchors[i])) { blocked = true; break; }
        }
        if (blocked) movers.push(it);
        else { it.keep = true; anchors.push({ x: it.ax, y: it.defY, w: it.w, h: it.h }); }
      });
      anchors.forEach(function (b) { placed.push(b); });

      /* ---- 第二步：需要让位的标签，四向试探，取「位移最小」的落点 --------
         每个方向都直接算到「刚好不压住」的临界位置，而不是跳一整格。 */
      movers.forEach(function (it) {
        var x0 = it.ax, y0 = it.defY;
        var stepY = it.h + GAP_Y;
        var cands = [{ x: x0, y: y0 }];

        ['up', 'down', 'left', 'right'].forEach(function (dir) {
          var x = x0, y = y0;
          for (var k = 0; k < 8; k++) {
            var h = hitOf(x, y, it);
            if (!h) break;
            if (dir === 'up') y = h.y - (it.h + h.h) / 2 - GAP_Y - 1;
            else if (dir === 'down') y = h.y + (it.h + h.h) / 2 + GAP_Y + 1;
            else if (dir === 'left') x = h.x - (it.w + h.w) / 2 - GAP_X - 1;
            else x = h.x + (it.w + h.w) / 2 + GAP_X + 1;
          }
          cands.push({ x: x, y: y });
        });
        /* 固定档兜底：正上方再抬一层 / 落到红点正下方 */
        cands.push({ x: x0, y: y0 - stepY });
        cands.push({ x: x0, y: it.ay + dotR + GAP_DOT + 6 + it.h / 2 });

        var best = null;
        cands.forEach(function (c) {
          var p = fitDot(c.x, c.y, it);
          if (!inside(p.x, p.y, it)) return;
          if (!notOnDot(p.x, p.y, it)) return;
          if (hitOf(p.x, p.y, it)) return;
          var d = Math.sqrt((p.x - x0) * (p.x - x0) + (p.y - y0) * (p.y - y0));
          if (!best || d < best.d - 0.01) best = { x: p.x, y: p.y, d: d };
        });

        if (!best) {                         /* 真挤不下 → 隐藏，交给红点/名单兜底 */
          it.hidden = true;
        } else {
          it.x = best.x; it.y = best.y;
          placed.push({ x: best.x, y: best.y, w: it.w, h: it.h });
        }
      });

      /* ---- 第三步：统一写回 DOM ---- */
      live.forEach(function (it) {
        if (it.hidden) { it.el.style.visibility = 'hidden'; return; }
        it.el.style.visibility = '';         /* 放大后重新出现 */
        var x = it.keep ? it.ax : it.x;
        var y = it.keep ? it.defY : it.y;
        /* 记下最终位置（容器坐标系），弹窗据此避让标签 */
        it.el._cx = x; it.el._cy = y; it.el._cw = it.w; it.el._ch = it.h;
        it.el.style.transform = 'translate(-50%,-50%) translate(' +
          Math.round(x) + 'px,' + Math.round(y) + 'px)';
      });

      curLift = lift;   /* 供弹窗避让标签时参考 */
      syncPop();        /* 地图一动，弹窗跟着走 */
    }
    map.on('idle', syncChips);
    map.on('move', syncChips);
    map.on('zoom', syncChips);
    window.__TMAP_SYNC__ = syncChips;
    setTimeout(syncChips, 60);
  }

  /* 生成可点击的城市标签覆盖层 */
  function buildCityChips(pts, v) {
    var wrap = document.getElementById(opts.containerId);
    if (!wrap) return;
    wrap.style.position = wrap.style.position || 'relative';
    var old = document.getElementById('tmap-chips');
    if (old) old.parentNode.removeChild(old);

    var box = document.createElement('div');
    box.id = 'tmap-chips';
    box.style.cssText = 'position:absolute;inset:0;z-index:1100;pointer-events:none;overflow:hidden';
    pts.forEach(function (p) {
      if (!p.city) return;
      var el = document.createElement('button');
      el.type = 'button';
      el.className = 'city-chip';
      el.dataset.lng = p.lng;
      el.dataset.lat = p.lat;
      el.dataset.count = p.count;      /* 避让时人多的城市优先占位 */
      el.style.position = 'absolute';
      el.style.left = '0';
      el.style.top = '0';
      el.style.pointerEvents = 'auto';
      el.style.transform = 'translate(-50%,-50%)';   /* 待 syncChips 精确定位 */
      el.innerHTML = p.city + '<b>' + p.count + '</b>';
      el.title = '查看 ' + p.city + ' 的同学与学校';
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        showPop(p);
        fireCity(p.city);
      });
      box.appendChild(el);
    });
    wrap.appendChild(box);
    void v;
  }

  /* 信息窗内容：城市 + 该城同学前往的高校（一行一个，人数多的在前）
     人名首字母不在这里重复显示 —— 右侧「同学录」已有完整名单 */
  function schoolLines(p, limit) {
    var order = (p.schoolOrder || []).slice();
    if (!order.length) {
      return '<div style="color:#6b7f70;font-size:12px">去向见原图</div>';
    }
    order.sort(function (a, b) {
      return (p.schools[b] || []).length - (p.schools[a] || []).length;
    });
    if (limit && order.length > limit) order = order.slice(0, limit);
    return order.map(function (s) {
      /* 「去向见原图」是缺校名时的占位分组，直接显示该城总人数更合理 */
      var n = (s === '去向见原图') ? p.count : (p.schools[s] || []).length;
      return '<div style="display:flex;align-items:baseline;gap:8px;padding:2px 0;' +
        'border-top:1px dashed #e6eee3">' +
        '<span style="flex:0 0 auto;width:6px;height:6px;border-radius:50%;background:#c0392b;' +
        'transform:translateY(-2px)"></span>' +
        '<span style="flex:1 1 auto;min-width:0;color:#4a2c22">' + s + '</span>' +
        '<span style="flex:0 0 auto;color:#6b7f70;font-size:11px">' + n + ' 人</span>' +
        '</div>';
    }).join('');
  }

  /* ══════════ 城市弹窗（自绘）══════════
     原生 InfoWindow 只会朝「正上方」展开，缩放后经常把旁边的城市标签压住。
     自绘弹窗四向择优：优先落在标签下方，其次上方，再左右；
     打开时挑「不压住任何标签」的位置，之后跟随地图平移，不再重复跳动。 */
  var popState = null;   /* { lat, lng, city, dir } */

  function ensurePop() {
    if (pop) return pop;
    var wrap = document.getElementById(opts.containerId);
    if (!wrap) return null;
    pop = document.createElement('div');
    pop.id = 'tmap-pop';
    pop.className = 'tmap-pop';
    pop.setAttribute('role', 'dialog');
    pop.style.visibility = 'hidden';
    wrap.appendChild(pop);
    /* 点到弹窗以外就收起（拖地图 / 点空白处） */
    wrap.addEventListener('pointerdown', function (e) {
      if (!popState || pop.contains(e.target)) return;
      if (e.target.classList && e.target.classList.contains('city-chip')) return;  /* chip 会自己换内容 */
      closePop();
    });
    /* Esc 收起 */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) closePop();
    });
    /* 事件委托：内容每次重建，处理函数只绑一次 */
    pop.addEventListener('click', function (e) {
      var t = e.target;
      if (t.closest && t.closest('.pop-x')) { e.stopPropagation(); closePop(); return; }
      if (t.closest && t.closest('.pop-foot')) { e.stopPropagation(); if (popState) fireCity(popState.city); }
    });
    return pop;
  }

  function closePop() {
    if (!popState) return;
    popState = null;
    clearMask();
    if (pop) {
      pop.classList.remove('on');
      /* 等淡出结束再摘掉，避免下一帧被鼠标事件碰上 */
      setTimeout(function () {
        if (!popState && pop) pop.style.visibility = 'hidden';
      }, 180);
    }
  }

  /* 当前可见标签的矩形（容器坐标系，与 projectToContainer 同一套） */
  function chipBoxes() {
    var out = [];
    var nodes = document.querySelectorAll('#tmap-chips .city-chip');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.style.visibility === 'hidden') continue;
      if (typeof el._cx !== 'number') continue;
      out.push({
        l: el._cx - el._cw / 2, t: el._cy - el._ch / 2,
        r: el._cx + el._cw / 2, b: el._cy + el._ch / 2,
        city: el.textContent
      });
    }
    return out;
  }

  /* 算某个方向下的弹窗左上角坐标（shift 为水平错位，lift 为额外抬起） */
  function popBox(dir, g, shift, lift) {
    var GAP = 10, l, t;
    switch (dir) {
      /* 标签下方：弹窗顶边贴在被点标签底边之下 —— 标签完整露出 */
      case 'down':  l = g.ax - g.cw / 2; t = Math.max(g.self ? g.self.b : 0, g.ay + g.dotR) + GAP; break;
      /* 标签上方：弹窗底边落在标签上沿之上 */
      case 'up':    l = g.ax - g.cw / 2; t = g.chipTop - GAP - g.ch; break;
      case 'right': l = g.chipRight + GAP; t = g.ay - g.ch / 2; break;
      case 'left':  l = g.chipLeft - GAP - g.cw; t = g.ay - g.ch / 2; break;
      default:      l = g.ax - g.cw / 2; t = g.ay + g.ch / 2;
    }
    return { l: l + (shift || 0), t: t + (lift || 0) };
  }

  function layoutPop(choose) {
    if (!popState || !pop || !map) return;
    var wrap = document.getElementById(opts.containerId);
    if (!wrap) return;

    var W = wrap.clientWidth, H = wrap.clientHeight;
    var pt;
    try { pt = map.projectToContainer(new TMap.LatLng(popState.lat, popState.lng)); } catch (e) { return; }
    if (!pt) return;

    var cw = pop.offsetWidth || 200, ch = pop.offsetHeight || 120;
    var chips = chipBoxes();
    var self = null;
    for (var i = 0; i < chips.length; i++) {
      if (chips[i].city.indexOf(popState.city) === 0) { self = chips[i]; break; }
    }

    var g = {
      ax: pt.x, ay: pt.y, cw: cw, ch: ch,
      dotR: IS_MOBILE ? 12 : 10,
      chipTop: self ? self.t : pt.y - curLift - 11,
      chipBottom: self ? self.b : pt.y - curLift + 11,
      chipLeft: self ? self.l : pt.x - 30,
      chipRight: self ? self.r : pt.x + 30,
      self: self
    };

    var PAD = 10;
    function clampPos(b) {
      var l = Math.min(Math.max(b.l, PAD), Math.max(PAD, W - PAD - cw));
      var t = Math.min(Math.max(b.t, PAD), Math.max(PAD, H - PAD - ch));
      return { l: l, t: t };
    }
    function overlap(p) {
      var n = 0, box = { l: p.l, t: p.t, r: p.l + cw, b: p.t + ch };
      for (var i = 0; i < chips.length; i++) {
        var c = chips[i];
        if (box.l < c.r && box.r > c.l && box.t < c.b && box.b > c.t) n++;
      }
      return n;
    }

    var dir = popState.dir, sx = popState.sx || 0, lift = popState.lift || 0;
    var fx = popState.fx, fy = popState.fy;

    if (choose || !dir) {
      /* 打开时择优：先在「一个标签都不压」的方案里挑，
         同分再按 up（弹窗上移、标签露在它下面）> down > right > left 取顺手的一个。 */
      var cands = [
        { d: 'up',    sx: 0,          lift: 0,   cost: 0 },
        { d: 'down',  sx: 0,          lift: 0,   cost: 2 },
        { d: 'up',    sx: -cw * 0.55, lift: 0,   cost: 6 },
        { d: 'up',    sx: cw * 0.55,  lift: 0,   cost: 6 },
        { d: 'up',    sx: 0,          lift: -28, cost: 8 },
        { d: 'down',  sx: -cw * 0.55, lift: 0,   cost: 8 },
        { d: 'down',  sx: cw * 0.55,  lift: 0,   cost: 8 },
        { d: 'right', sx: 0,          lift: 0,   cost: 12 },
        { d: 'left',  sx: 0,          lift: 0,   cost: 12 },
        { d: 'down',  sx: 0,          lift: 30,  cost: 14 }
      ];
      /* 再补一圈「环绕红点」的候选：中心城市标签挤成一片时，常常只有斜角是空的 */
      [[0, -1], [0, 1], [1, 0], [-1, 0], [1, -1], [1, 1], [-1, -1], [-1, 1]]
        .forEach(function (v, i) {
          [0, 52].forEach(function (extra, j) {
            var l = g.ax + v[0] * (cw / 2 + 14 + extra) - cw / 2;
            var t = g.ay + v[1] * (ch / 2 + 14 + extra) - ch / 2;
            cands.push({
              d: v[1] < 0 ? 'up' : (v[1] > 0 ? 'down' : (v[0] > 0 ? 'right' : 'left')),
              fx: l - g.ax, fy: t - g.ay,
              cost: 20 + i * 2 + j * 8
            });
          });
        });

      var best = null;
      cands.forEach(function (c) {
        var raw = (typeof c.fx === 'number')
          ? { l: g.ax + c.fx, t: g.ay + c.fy }
          : popBox(c.d, g, c.sx, c.lift);
        var p = clampPos(raw);
        /* 轻微偏好离红点近的落点，避免为了躲标签飘太远 */
        var dx = (p.l + cw / 2) - pt.x, dy = (p.t + ch / 2) - pt.y;
        var score = overlap(p) * 100 + c.cost + Math.sqrt(dx * dx + dy * dy) / 20;
        if (!best || score < best.score) best = { p: p, c: c, score: score };
      });
      var win = best.c;
      dir = win.d;
      sx = win.sx || 0; lift = win.lift || 0;
      fx = (typeof win.fx === 'number') ? win.fx : null;
      fy = (typeof win.fy === 'number') ? win.fy : null;
      popState.dir = dir; popState.sx = sx; popState.lift = lift;
      popState.fx = fx; popState.fy = fy;
    }

    var pos = clampPos((typeof fx === 'number')
      ? { l: g.ax + fx, t: g.ay + fy }
      : popBox(dir, g, sx, lift));
    pop.style.left = Math.round(pos.l) + 'px';
    pop.style.top = Math.round(pos.t) + 'px';
    pop.dataset.dir = dir;

    /* 箭头始终指向被点击的城市；偏得太远以致指不准时干脆不画，免得指错方向 */
    var arrow = pop.querySelector('.pop-arrow');
    if (arrow) {
      var off = null;
      if (dir === 'down' || dir === 'up') off = pt.x - pos.l;
      else off = pt.y - pos.t;
      var lim = (dir === 'down' || dir === 'up') ? cw : ch;
      if (off >= 14 && off <= lim - 14) {
        pop.classList.remove('no-arrow');
        if (dir === 'down' || dir === 'up') {
          arrow.style.left = Math.round(off) + 'px';
          arrow.style.top = '';
        } else {
          arrow.style.top = Math.round(off) + 'px';
          arrow.style.left = '';
        }
      } else {
        pop.classList.add('no-arrow');
      }
    }

    maskUnderPop();
  }

  /* 躲不开的邻居标签：整块让给弹窗，别只露出一角
     （用透明度而非 visibility，不干扰 syncChips 自己的显隐判断；
       直接比较屏幕矩形，避免用到过期的标签坐标） */
  var maskAt = 0;
  function maskUnderPop(force) {
    if (!pop || !popState) return;
    var now = Date.now();
    if (!force && now - maskAt < 90) return;
    maskAt = now;
    var pr = pop.getBoundingClientRect();
    var nodes = document.querySelectorAll('#tmap-chips .city-chip');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var r = el.getBoundingClientRect();
      if (!r.width || el.style.visibility === 'hidden') {
        el.classList.remove('under-pop');
        continue;
      }
      var hit = r.left < pr.right && r.right > pr.left && r.top < pr.bottom && r.bottom > pr.top;
      el.classList.toggle('under-pop', hit);
    }
  }

  function clearMask() {
    var nodes = document.querySelectorAll('#tmap-chips .city-chip');
    for (var i = 0; i < nodes.length; i++) nodes[i].classList.remove('under-pop');
  }

  function syncPop() {
    if (!popState) return;
    layoutPop(false);
    /* 内容或字体变化会让尺寸略有出入，量一次再对齐 */
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(function () { if (popState) layoutPop(false); });
    }
  }

  function showPop(p) {
    var el = ensurePop();
    if (!el || typeof p.lat !== 'number') return;
    var same = !!(popState && popState.city === p.city);
    var N = (p.schoolOrder || []).length;
    if (!same) {
      el.innerHTML =
        '<div class="pop-card">' +
          '<button type="button" class="pop-x" aria-label="关闭">✕</button>' +
          '<div class="pop-t">' + p.city +
            '<span>' + p.count + ' 人 · ' + N + ' 校</span></div>' +
          '<div class="pop-body">' + schoolLines(p, 3) +
            (N > 3 ? '<div class="pop-more">等 ' + N + ' 所学校</div>' : '') + '</div>' +
          '<button type="button" class="pop-foot">查看全部名单 →</button>' +
        '</div>' +
        '<span class="pop-arrow"></span>';
    }

    popState = same
      ? { lat: p.lat, lng: p.lng, city: p.city, dir: popState.dir, sx: popState.sx, lift: popState.lift, fx: popState.fx, fy: popState.fy }
      : { lat: p.lat, lng: p.lng, city: p.city, dir: null, sx: 0, lift: 0, fx: null, fy: null };
    el.style.visibility = 'visible';
    el.classList.add('on');
    layoutPop(!same);
    maskUnderPop(true);
    /* 打开后再校一次：首帧字体未就位时高度会差几像素 */
    setTimeout(function () {
      if (!popState) return;
      layoutPop(false);
      maskUnderPop(true);
    }, 40);
  }

  function fireCity(city) {
    if (opts && opts.onCityClick) opts.onCityClick(city);
  }

  function fallback() {
    var el = document.getElementById(opts && opts.containerId);
    if (el) el.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;height:100%;' +
      'color:#6b7f70;font-size:13px;text-align:center;line-height:2;padding:20px">' +
      '地图加载失败（需要联网加载腾讯地图）<br>右侧名单不受影响，可正常查看各班去向</div>';
  }

  /* 地图被侧栏面板遮挡的宽度（居中时要扣掉，否则城市会藏在面板后面） */
  var inset = { right: 0, top: 0 };
  function setInset(o) {
    if (!o) return;
    if (typeof o.right === 'number') inset.right = Math.max(0, o.right);
    if (typeof o.top === 'number') inset.top = Math.max(0, o.top);
  }

  /**
   * 把某个经纬度移到「可见区域」正中央（可扣掉右侧面板宽度）
   * 用像素反算而不是 panTo：panTo 是动画，紧接着 setZoom 会被打断，结果只放大不平移
   */
  function centerInView(lat, lng) {
    if (!map) return;
    var el = document.getElementById(opts.containerId);
    if (!el) return;
    var w = el.clientWidth || 800, h = el.clientHeight || 520;
    /* 可见区域中心（扣掉面板） */
    var targetX = Math.max(60, (w - inset.right) / 2);
    var targetY = Math.max(60, (h - inset.top) / 2);

    if (typeof map.projectToContainer === 'function' &&
        typeof map.unprojectFromContainer === 'function') {
      var px = map.projectToContainer(new TMap.LatLng(lat, lng));
      /* 想让 (lat,lng) 落到 targetX/targetY，则新中心的像素位置为下式 */
      var cx = w / 2 + (px.x - targetX);
      var cy = h / 2 + (px.y - targetY);
      var pt = (typeof TMap.Point === 'function') ? new TMap.Point(cx, cy) : { x: cx, y: cy };
      map.setCenter(map.unprojectFromContainer(pt));
    } else {
      /* 老版本 API 兜底：直接平移（不扣面板） */
      map.panTo(new TMap.LatLng(lat, lng));
    }
  }

  /* 高亮某个城市：放大 + 居中到可见区域 + 弹窗
     opt.quiet = true 时不弹信息窗（城市面板已经展示了同样的名单，避免重复）
     opt.zoom 可指定缩放；默认停在「省 / 城市群」级别，保留全国分布语境 */
  function focusCity(city, opt) {
    if (!map) return;
    var pts = (opts.points || []).filter(function (p) { return p.city === city; });
    if (!pts.length || typeof pts[0].lng !== 'number') return;
    var p = pts[0];
    var quiet = !!(opt && opt.quiet);
    var z = (opt && typeof opt.zoom === 'number') ? opt.zoom : (IS_MOBILE ? 6 : 6.6);

    /* 1) 先定缩放；2) 等缩放渲染完成后再按像素居中（顺序不能反，否则居中会被 zoom 打断） */
    try { map.setZoom(z); } catch (e) {}
    setTimeout(function () {
      centerInView(p.lat, p.lng);
      if (quiet) {
        closePop();
      } else {
        showPop(p);
      }
      if (window.__TMAP_SYNC__) window.__TMAP_SYNC__();
      /* 3) 再校一次：抵消缩放动画的异步偏移，确保最终真的居中 */
      setTimeout(function () {
        centerInView(p.lat, p.lng);
        if (window.__TMAP_SYNC__) window.__TMAP_SYNC__();
      }, 220);
    }, 60);
  }

  /* 高亮城市标签（面板打开时同步选中态） */
  function markChip(city) {
    var chips = document.querySelectorAll('#tmap-chips .city-chip');
    chips.forEach(function (el) {
      /* city 为空表示「取消高亮」——空串的 indexOf 恒为 0，
         漏了 !!city 会把所有标签都标成 active（关面板后全变红） */
      var on = !!city && el.textContent.indexOf(city) === 0;
      el.classList.toggle('active', on);
    });
  }

  window.TMAP = {
    init: init,
    geocode: geocode,
    cityNameByCoord: cityNameByCoord,
    focusCity: focusCity,
    closePop: closePop,
    markChip: markChip,
    setInset: setInset,
    centerInView: centerInView,
    schoolLines: schoolLines,   /* 供调试：生成信息窗里的「高校列表」HTML */
    hasCity: function (c) { return !!CITY_COORD[c]; },
    coord: function (c) { return CITY_COORD[c]; },
    isReady: function () { return ready; },
    refit: function () {
      if (!map || !opts) return;
      var pts = (opts.points || []).filter(function (p) { return typeof p.lng === 'number'; });
      var v = fitView(pts);
      try {
        map.setZoom(v.zoom);
        map.setCenter(new TMap.LatLng(v.center[1], v.center[0]));
      } catch (e) {}
      if (window.__TMAP_SYNC__) setTimeout(window.__TMAP_SYNC__, 260);
    }
  };
})();
