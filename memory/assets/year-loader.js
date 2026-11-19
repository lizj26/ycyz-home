/* ============================================================
 * 届别装载器
 * ------------------------------------------------------------
 * 作用：读 data/years.js，按 ?year= 参数（默认最新一届）决定加载哪个
 *      届别的数据文件，并把它同步塞进页面。
 *
 * 为什么用 document.write：
 *   index.html / class.html 里紧跟其后的内联脚本是**同步**执行并在解析期
 *   就去读 window.CLASS_DATA 的。用 appendChild 异步插入，数据一定来晚；
 *   用 document.write 在解析期插入，浏览器会先执行完这个 script 再继续，
 *   顺序天然正确。这是静态页面里最省事也最可靠的做法。
 *
 * 对外暴露（其它脚本可以直接用）：
 *   window.YCYEZ_YEAR          当前届别对象 { id, label, file, note }
 *   window.YCYEZ_YEAR_LATEST   最新一届（用来判断是否需要带 year 参数）
 *   window.yearQuery()         返回 "" 或 "year=2026"，拼链接时带上
 * ============================================================ */
(function () {
  var years = window.YCYEZ_YEARS || [];
  if (!years.length) {
    if (window.console) console.error("[届别] data/years.js 为空或没加载成功。");
    return;
  }

  var latest = years[years.length - 1];

  /* 读 ?year=，找不到就回落到最新一届 */
  var want = null;
  try {
    want = new URLSearchParams(location.search).get("year");
  } catch (e) {
    var m = location.search.match(/[?&]year=(\d+)/);
    want = m ? m[1] : null;
  }

  var pick = null;
  for (var i = 0; i < years.length; i++) {
    if (String(years[i].id) === String(want)) { pick = years[i]; break; }
  }
  if (!pick) pick = latest;

  window.YCYEZ_YEAR = pick;
  window.YCYEZ_YEAR_LATEST = latest;

  /* 拼链接用：只有不是最新一届时才需要带参数，保持网址干净 */
  window.yearQuery = function () {
    return (pick && latest && String(pick.id) !== String(latest.id))
      ? "year=" + encodeURIComponent(pick.id)
      : "";
  };

  if (!pick.file) {
    if (window.console) console.error("[届别] " + pick.label + " 没有配置 file 字段。");
    return;
  }

  /* 解析期同步插入数据文件 */
  document.write('<script src="' + String(pick.file).replace(/"/g, "&quot;") + '"><\/script>');
})();
