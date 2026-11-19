/* ============================================================================
   大学官网地址表（蹭饭图专用）
   ----------------------------------------------------------------------------
   用途：class.html 里点击学校名 → 新标签打开该校官网。
   规则：
     1) 优先精确匹配 UNI_URL 里的键；
     2) 未收录时，用 DOMAIN 规则猜一个 .edu.cn 域名（绝大多数高校符合）；
     3) 港澳 / 军队院校 / 中外合作等特殊院校单独列出，猜不出就返回 null（前端显示为纯文本）。
   维护：发现某校链接不对，直接改这里即可。
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 精确映射（键 = 数据里出现的学校名） ---------- */
  var UNI_URL = {
    /* —— 特殊：由校方/校友站统一托管 —— */
    '清华大学': 'https://pkuknow.cn/thu',
    '北京大学': 'https://pkuknow.cn',
    '北京大学医学部': 'https://pkuknow.cn',

    /* —— 北京 —— */
    '中国人民大学': 'https://www.ruc.edu.cn',
    '北京航空航天大学': 'https://www.buaa.edu.cn',
    '北京理工大学': 'https://www.bit.edu.cn',
    '北京师范大学': 'https://www.bnu.edu.cn',
    '北京科技大学': 'https://www.ustb.edu.cn',
    '北京交通大学': 'https://www.bjtu.edu.cn',
    '北京邮电大学': 'https://www.bupt.edu.cn',
    '北京邮电大学(海南校区)': 'https://www.bupt.edu.cn',
    '北京化工大学': 'https://www.buct.edu.cn',
    '北京林业大学': 'https://www.bjfu.edu.cn',
    '北京中医药大学': 'https://www.bucm.edu.cn',
    '北京工业大学': 'https://www.bjut.edu.cn',
    '北京体育大学': 'https://www.bsu.edu.cn',
    '中国农业大学': 'https://www.cau.edu.cn',
    '中国政法大学': 'https://www.cupl.edu.cn',
    '中国传媒大学': 'https://www.cuc.edu.cn',
    '中国戏曲学院': 'https://www.nacta.edu.cn',
    '中央财经大学': 'https://www.cufe.edu.cn',
    '中央民族大学': 'https://www.muc.edu.cn',
    '对外经济贸易大学': 'https://www.uibe.edu.cn',
    '华北电力大学': 'https://www.ncepu.edu.cn',
    '华北电力大学(北京)': 'https://www.ncepu.edu.cn',
    '华北电力大学(保定)': 'https://www.ncepu.edu.cn',
    '中国人民警察大学': 'https://www.cppsu.edu.cn',
    '中国石油大学(北京)': 'https://www.cup.edu.cn',
    '中国石油大学(北京)克拉玛依校区': 'https://www.cup.edu.cn',
    '中国石油大学克拉玛依校区': 'https://www.cup.edu.cn',
    '中国石油大学(华东)': 'https://www.upc.edu.cn',
    '中国地质大学(北京)': 'https://www.cugb.edu.cn',
    '中国地质大学(武汉)': 'https://www.cug.edu.cn',
    '中国地质大学': 'https://www.cug.edu.cn',
    '中国矿业大学': 'https://www.cumt.edu.cn',
    '中国矿业大学(北京)': 'https://www.cumtb.edu.cn',
    '北京师范大学珠海分校': 'https://www.bnuzh.edu.cn',

    /* —— 上海 —— */
    '复旦大学': 'https://www.fudan.edu.cn',
    '上海交通大学': 'https://www.sjtu.edu.cn',
    '同济大学': 'https://www.tongji.edu.cn',
    '华东师范大学': 'https://www.ecnu.edu.cn',
    '华东理工大学': 'https://www.ecust.edu.cn',
    '东华大学': 'https://www.dhu.edu.cn',
    '上海大学': 'https://www.shu.edu.cn',
    '上海财经大学': 'https://www.sufe.edu.cn',
    '上海外国语大学': 'https://www.shisu.edu.cn',
    '上海理工大学': 'https://www.usst.edu.cn',
    '上海海事大学': 'https://www.shmtu.edu.cn',
    '上海电力大学': 'https://www.shiep.edu.cn',
    '上海中医药大学': 'https://www.shutcm.edu.cn',
    '上海立信会计金融学院': 'https://www.lixin.edu.cn',
    '上海立信学院': 'https://www.lixin.edu.cn',
    '上海海关学院': 'https://www.shcc.edu.cn',
    '华东政法大学': 'https://www.ecupl.edu.cn',

    /* —— 天津 / 河北 —— */
    '南开大学': 'https://www.nankai.edu.cn',
    '天津大学': 'https://www.tju.edu.cn',
    '天津科技大学': 'https://www.tust.edu.cn',
    '天津工业大学': 'https://www.tiangong.edu.cn',
    '天津理工大学': 'https://www.tjut.edu.cn',
    '天津中医药大学': 'https://www.tjutcm.edu.cn',
    '天津财经大学': 'https://www.tjufe.edu.cn',
    '河北大学': 'https://www.hbu.edu.cn',
    '华北理工大学': 'https://www.ncst.edu.cn',
    '东北大学秦皇岛分校': 'https://www.neuq.edu.cn',

    /* —— 山西 / 内蒙古 —— */
    '太原理工大学': 'https://www.tyut.edu.cn',
    '中北大学': 'https://www.nuc.edu.cn',
    '山西大学': 'https://www.sxu.edu.cn',

    /* —— 东北 —— */
    '哈尔滨工业大学': 'https://www.hit.edu.cn',
    '哈尔滨工业大学(威海)': 'https://www.hitwh.edu.cn',
    '哈尔滨工业大学(深圳)': 'https://www.hitsz.edu.cn',
    '哈尔滨工业大学深圳校区': 'https://www.hitsz.edu.cn',
    '哈尔滨工程大学': 'https://www.hrbeu.edu.cn',
    '东北林业大学': 'https://www.nefu.edu.cn',
    '东北农业大学': 'https://www.neau.edu.cn',
    '吉林大学': 'https://www.jlu.edu.cn',
    '东北师范大学': 'https://www.nenu.edu.cn',
    '东北电力大学': 'https://www.neepu.edu.cn',
    '大连理工大学': 'https://www.dlut.edu.cn',
    '大连海事大学': 'https://www.dlmu.edu.cn',
    '大连医科大学': 'https://www.dmu.edu.cn',
    '大连东软信息学院': 'https://www.neusoft.edu.cn',
    '大连民族大学': 'https://www.dlnu.edu.cn',
    '东北大学': 'https://www.neu.edu.cn',
    '中国刑事警察学院': 'https://www.cipuc.edu.cn',
    '中国医科大学': 'https://www.cmu.edu.cn',
    '沈阳工业大学': 'https://www.sut.edu.cn',

    /* —— 江苏 —— */
    '南京大学': 'https://www.nju.edu.cn',
    '东南大学': 'https://www.seu.edu.cn',
    '南京航空航天大学': 'https://www.nuaa.edu.cn',
    '南京理工大学': 'https://www.njust.edu.cn',
    '河海大学': 'https://www.hhu.edu.cn',
    '南京师范大学': 'https://www.njnu.edu.cn',
    '南京邮电大学': 'https://www.njupt.edu.cn',
    '南京信息工程大学': 'https://www.nuist.edu.cn',
    '南京林业大学': 'https://www.njfu.edu.cn',
    '南京审计大学': 'https://www.nau.edu.cn',
    '中国药科大学': 'https://www.cpu.edu.cn',
    '苏州大学': 'https://www.suda.edu.cn',
    '江南大学': 'https://www.jiangnan.edu.cn',
    '江苏大学': 'https://www.ujs.edu.cn',
    '江苏科技大学': 'https://www.just.edu.cn',
    '西交利物浦大学': 'https://www.xjtlu.edu.cn',
    '南京警察学院': 'https://www.njpc.edu.cn',

    /* —— 浙江 —— */
    '浙江大学': 'https://www.zju.edu.cn',
    '浙江工业大学': 'https://www.zjut.edu.cn',
    '浙江师范大学': 'https://www.zjnu.edu.cn',
    '浙江农林大学': 'https://www.zafu.edu.cn',
    '浙江传媒学院': 'https://www.cuz.edu.cn',
    '宁波大学': 'https://www.nbu.edu.cn',
    '杭州电子科技大学': 'https://www.hdu.edu.cn',
    '杭州师范大学': 'https://www.hznu.edu.cn',
    '中国计量大学': 'https://www.cjlu.edu.cn',

    /* —— 安徽 / 福建 / 江西 —— */
    '中国科学技术大学': 'https://www.ustc.edu.cn',
    '合肥工业大学': 'https://www.hfut.edu.cn',
    '安徽大学': 'https://www.ahu.edu.cn',
    '安徽理工大学': 'https://www.aust.edu.cn',
    '安徽中医药大学': 'https://www.ahtcm.edu.cn',
    '厦门大学': 'https://www.xmu.edu.cn',
    '福州大学': 'https://www.fzu.edu.cn',
    '福建师范大学': 'https://www.fjnu.edu.cn',
    '福建医科大学': 'https://www.fjmu.edu.cn',
    '集美大学': 'https://www.jmu.edu.cn',
    '南昌大学': 'https://www.ncu.edu.cn',
    '华东交通大学': 'https://www.ecjtu.edu.cn',

    /* —— 山东 —— */
    '山东大学': 'https://www.sdu.edu.cn',
    '山东大学(威海)': 'https://www.wh.sdu.edu.cn',
    '中国海洋大学': 'https://www.ouc.edu.cn',
    '山东科技大学': 'https://www.sdust.edu.cn',
    '中国石油大学': 'https://www.upc.edu.cn',

    /* —— 河南 / 湖北 / 湖南 —— */
    '郑州大学': 'https://www.zzu.edu.cn',
    '郑州警察学院': 'https://www.zzpc.edu.cn',
    '武汉大学': 'https://www.whu.edu.cn',
    '华中科技大学': 'https://www.hust.edu.cn',
    '武汉理工大学': 'https://www.whut.edu.cn',
    '华中师范大学': 'https://www.ccnu.edu.cn',
    '华中农业大学': 'https://www.hzau.edu.cn',
    '中南财经政法大学': 'https://www.zuel.edu.cn',
    '中南民族大学': 'https://www.scuec.edu.cn',
    '武汉科技大学': 'https://www.wust.edu.cn',
    '武汉轻工大学': 'https://www.whpu.edu.cn',
    '江汉大学': 'https://www.jhun.edu.cn',
    '三峡大学': 'https://www.ctgu.edu.cn',
    '中南大学': 'https://www.csu.edu.cn',
    '中南大学湘雅医学院': 'https://www.csu.edu.cn',
    '湖南大学': 'https://www.hnu.edu.cn',
    '湖南师范大学': 'https://www.hunnu.edu.cn',
    '中南林业科技大学': 'https://www.csuft.edu.cn',
    '长沙理工大学': 'https://www.csust.edu.cn',
    '湘潭大学': 'https://www.xtu.edu.cn',
    '吉首大学': 'https://www.jsu.edu.cn',
    '国防科技大学': 'https://www.nudt.edu.cn',

    /* —— 广东 / 广西 / 海南 —— */
    '中山大学': 'https://www.sysu.edu.cn',
    '华南理工大学': 'https://www.scut.edu.cn',
    '暨南大学': 'https://www.jnu.edu.cn',
    '华南师范大学': 'https://www.scnu.edu.cn',
    '南方医科大学': 'https://www.smu.edu.cn',
    '南方科技大学': 'https://www.sustech.edu.cn',
    '广东工业大学': 'https://www.gdut.edu.cn',
    '广州医科大学': 'https://www.gzhmu.edu.cn',
    '广东医科大学': 'https://www.gdmu.edu.cn',
    '深圳大学': 'https://www.szu.edu.cn',
    '广西大学': 'https://www.gxu.edu.cn',
    '海南大学': 'https://www.hainanu.edu.cn',
    '琼台师范学院': 'https://www.qtnu.edu.cn',

    /* —— 重庆 / 四川 / 贵州 / 云南 —— */
    '重庆大学': 'https://www.cqu.edu.cn',
    '西南大学': 'https://www.swu.edu.cn',
    '西南政法大学': 'https://www.swupl.edu.cn',
    '重庆邮电大学': 'https://www.cqupt.edu.cn',
    '重庆理工大学': 'https://www.cqut.edu.cn',
    '四川大学': 'https://www.scu.edu.cn',
    '四川大学华西医学院': 'https://www.scu.edu.cn',
    '电子科技大学': 'https://www.uestc.edu.cn',
    '电子科技大学成都学院': 'https://www.cduestc.edu.cn',
    '西南交通大学': 'https://www.swjtu.edu.cn',
    '西南财经大学': 'https://www.swufe.edu.cn',
    '西南石油大学': 'https://www.swpu.edu.cn',
    '四川农业大学': 'https://www.sicau.edu.cn',
    '西南民族大学': 'https://www.swun.edu.cn',
    '成都大学': 'https://www.cdu.edu.cn',
    '贵州大学': 'https://www.gzu.edu.cn',
    '贵州财经大学': 'https://www.gufe.edu.cn',
    '云南大学': 'https://www.ynu.edu.cn',
    '昆明理工大学': 'https://www.kmust.edu.cn',
    '昆明医科大学': 'https://www.kmmc.cn',
    '云南财经大学': 'https://www.ynufe.edu.cn',

    /* —— 陕西 / 甘肃 / 青海 / 宁夏 / 新疆 —— */
    '西安交通大学': 'https://www.xjtu.edu.cn',
    '西北工业大学': 'https://www.nwpu.edu.cn',
    '西安电子科技大学': 'https://www.xidian.edu.cn',
    '西北大学': 'https://www.nwu.edu.cn',
    '西北农林科技大学': 'https://www.nwafu.edu.cn',
    '陕西师范大学': 'https://www.snnu.edu.cn',
    '长安大学': 'https://www.chd.edu.cn',
    '西安建筑科技大学': 'https://www.xauat.edu.cn',
    '西安理工大学': 'https://www.xaut.edu.cn',
    '西安工程大学': 'https://www.xpu.edu.cn',
    '西安邮电大学': 'https://www.xiyou.edu.cn',
    '西安财经大学': 'https://www.xaufe.edu.cn',
    '陕西科技大学': 'https://www.sust.edu.cn',
    '武警工程大学': 'https://www.wjgcxy.edu.cn',
    '兰州大学': 'https://www.lzu.edu.cn',
    '兰州交通大学': 'https://www.lzjtu.edu.cn',
    '兰州财经大学': 'https://www.lzufe.edu.cn',
    '西北师范大学': 'https://www.nwnu.edu.cn',
    '宁夏大学': 'https://www.nxu.edu.cn',
    '宁夏大学新华学院': 'https://xinhua.nxu.edu.cn',
    '宁夏医科大学': 'https://www.nxmu.edu.cn',
    '宁夏师范大学': 'https://www.nxnu.edu.cn',
    '宁夏职业技术学院': 'https://www.nxtc.edu.cn',
    '新疆大学': 'https://www.xju.edu.cn',
    '石河子大学': 'https://www.shzu.edu.cn',

    /* —— 港澳 —— */
    '香港大学': 'https://www.hku.hk',
    '香港中文大学': 'https://www.cuhk.edu.hk',
    '香港科技大学': 'https://www.ust.hk',
    '澳门科技大学': 'https://www.must.edu.mo',

    /* —— 军事院校（官网不公开或不可达，仅列可访问的） —— */
    '信息工程大学': 'https://www.xxgc.edu.cn',
    '陆军军医大学': null,
    '武警警官学院': null,
    '联勤保障部队工程大学': null,
    '解放军信息工程大学': null,
    '解放军网络安固部队信息工程大学': null,
    '网络空间部队信息工程大学': null
  };

  /* ---------- 兜底：按校名规则生成 .edu.cn 域名 ---------- */
  /* 常用词的拼音/缩写对照，覆盖「XX大学/学院」的常见命名 */
  var TOKEN = {
    '北京':'bj','上海':'sh','天津':'tj','重庆':'cq','南京':'nj','武汉':'wh',
    '西安':'xa','广州':'gz','深圳':'sz','杭州':'hz','成都':'cd','长沙':'cs',
    '合肥':'hf','济南':'jn','青岛':'qd','郑州':'zz','兰州':'lz','昆明':'km',
    '贵阳':'gy','南宁':'nn','福州':'fz','南昌':'nc','太原':'ty','石家庄':'sjz',
    '沈阳':'sy','大连':'dl','长春':'cc','哈尔滨':'hrb','吉林':'jl','苏州':'su',
    '厦门':'xm','宁波':'nb','长沙':'cs','东北':'db','西南':'xn','西北':'xb',
    '华东':'hd','华中':'hz','华南':'hn','华北':'hb','中南':'zn','中国':'zg',
    '中央':'zy','首都':'sd','对外':'dw','南京':'nj'
  };

  function guessUrl(name) {
    if (!name) return null;
    /* 军队/部队类院校不猜 */
    if (/部队|军队|解放军/.test(name)) return null;
    /* 港澳不做 .edu.cn 猜测 */
    if (/香港|澳门|台湾/.test(name)) return null;
    /* 校区后缀先剥掉 */
    var base = name.replace(/[（(][^）)]*[）)]$/, '').replace(/分校区?$/, '');
    var m = base.match(/^(.+?)(大学|学院)$/);
    if (!m) return null;
    var prefix = m[1], suffix = m[2] === '大学' ? 'u' : 'c';
    /* 已知对照优先 */
    if (TOKEN[prefix]) return 'https://www.' + TOKEN[prefix] + suffix + '.edu.cn';
    /* 单字/双字前缀（如「吉首大学」）没有把握就不猜 */
    return null;
  }

  window.UNI_URL_TABLE = UNI_URL;

  /** 取某校官网地址；取不到返回 null */
  window.uniUrl = function (name) {
    if (!name) return null;
    var n = String(name).trim();
    if (Object.prototype.hasOwnProperty.call(UNI_URL, n)) return UNI_URL[n];
    /* 去掉省份前缀（如「陕西省西安交通大学」不会出现，但保险） */
    var bare = n.replace(/[（(][^）)]*[）)]$/, '');
    if (Object.prototype.hasOwnProperty.call(UNI_URL, bare)) return UNI_URL[bare];
    /* 带校区后缀的 → 退回本部 */
    var m = n.match(/^(.+?)[（(][^）)]*[）)]/);
    if (m && Object.prototype.hasOwnProperty.call(UNI_URL, m[1])) return UNI_URL[m[1]];
    /* 「XX大学XX学院」→ 退回 XX大学 */
    var m2 = n.match(/^(.+?大学)(.+学院)$/);
    if (m2 && Object.prototype.hasOwnProperty.call(UNI_URL, m2[1])) return UNI_URL[m2[1]];
    return guessUrl(n);
  };
})();
