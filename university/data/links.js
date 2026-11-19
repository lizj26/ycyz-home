/* ============================================================
 * 大学开源资料站 · 入口清单
 * ------------------------------------------------------------
 * 维护方式：只改这个文件，不用碰页面。
 * 新增一条 =
 *   { name: "名称", url: "https://...", desc: "一句话说明", tag: "免费" }
 * tag 可省略。加一个新类别 = 在数组里加一个 { group, note, items } 对象。
 *
 * 收录原则（重要）：
 *   1. 只给「入口」，不镜像、不搬运内容，所以不怕版权问题；
 *   2. 优先官方站点和长期存在的仓库，短命的活动页别放；
 *   3. 新增后请自己点一遍，确认能打开。
 * ============================================================ */
window.YCYEZ_LINKS = [

  {
    group: "课程与公开课",
    note: "想补某门课，先在这里找，通常比看网盘盗录靠谱",
    items: [
      {
        name: "中国大学 MOOC",
        url: "https://www.icourse163.org/",
        desc: "国内高校自己开的课，注册就免费学，部分课程有认证证书。",
        tag: "免费"
      },
      {
        name: "学堂在线",
        url: "https://www.xuetangx.com/",
        desc: "清华发起的慕课平台，理工科课程比较全。",
        tag: "免费"
      },
      {
        name: "国家高等教育智慧教育平台",
        url: "https://higher.smartedu.cn/",
        desc: "教育部牵头汇聚的高校课程平台，按学科和专业检索。",
        tag: "免费"
      },
      {
        name: "MIT OpenCourseWare",
        url: "https://ocw.mit.edu/",
        desc: "MIT 几乎全部课程的讲义、作业与考试题公开下载，英文。",
        tag: "开源"
      },
      {
        name: "网易公开课",
        url: "https://open.163.com/",
        desc: "名校公开课和 TED 的中文字幕版，通识类看看不错。",
        tag: "免费"
      }
    ]
  },

  {
    group: "论文与文献",
    note: "全文下载基本都要学校 IP 或图书馆账号，校外先用摘要判断值不值得找",
    items: [
      {
        name: "中国知网 CNKI",
        url: "https://www.cnki.net/",
        desc: "中文期刊与学位论文最全的一个库，全文需要机构权限。",
        tag: "需校园网"
      },
      {
        name: "万方数据",
        url: "https://www.wanfangdata.com.cn/",
        desc: "期刊、学位论文、会议论文，和知网互补，缺的常在这里补上。",
        tag: "需校园网"
      },
      {
        name: "国家哲学社会科学文献中心",
        url: "https://www.ncpssd.org/",
        desc: "社科类中文期刊免费开放，注册即可下载。",
        tag: "免费"
      },
      {
        name: "arXiv",
        url: "https://arxiv.org/",
        desc: "物理、数学、计算机的预印本，最新研究基本都先出现在这里。",
        tag: "免费"
      },
      {
        name: "全国图书馆参考咨询联盟",
        url: "http://www.ucdrs.superlib.net/",
        desc: "文献传递服务，找不到的论文可以在这里申请，按页收费。",
        tag: "付费"
      }
    ]
  },

  {
    group: "开源课程与笔记",
    note: "学长学姐整理好的完整课程资料，比自己从零搜集省事得多",
    items: [
      {
        name: "清华大学计算机系课程攻略",
        url: "https://github.com/PKUanonym/REKCARC-TSC-UHT",
        desc: "清华计算机本科课程的课件、作业、历年题汇总，Star 很高。",
        tag: "开源"
      },
      {
        name: "浙江大学课程攻略共享计划",
        url: "https://github.com/QSCTech/zju-icicles",
        desc: "浙大各专业的课程资料合集，理工文都有。",
        tag: "开源"
      },
      {
        name: "CS 自学指南",
        url: "https://github.com/PKUFlyingPig/cs-self-learning",
        desc: "把计算机专业的课按顺序排好，每门都给了公开课链接，适合跨考和转行。",
        tag: "开源"
      },
      {
        name: "MDN Web 文档",
        url: "https://developer.mozilla.org/zh-CN/",
        desc: "前端最权威的中文文档，HTML/CSS/JS 查手册首选。",
        tag: "免费"
      },
      {
        name: "菜鸟教程",
        url: "https://www.runoob.com/",
        desc: "语言入门速查，写得浅但上手快，适合第一次接触新语言。",
        tag: "免费"
      }
    ]
  },

  {
    group: "入学与过渡",
    note: "大一最容易踩坑的几件事，入口都在这",
    items: [
      {
        name: "学信网",
        url: "https://www.chsi.com.cn/",
        desc: "学籍、学历查询的官方入口，报到后记得核对学籍信息。",
        tag: "官方"
      },
      {
        name: "全国大学英语四、六级考试报名网",
        url: "https://cet-bm.neea.edu.cn/",
        desc: "四六级报名与准考证打印，各校报名时间不同，别错过。",
        tag: "官方"
      },
      {
        name: "中国研究生招生信息网",
        url: "https://yz.chsi.com.cn/",
        desc: "考研报名、调剂、专业目录查询的唯一官方入口。",
        tag: "官方"
      },
      {
        name: "国家留学网",
        url: "https://www.csc.edu.cn/",
        desc: "国家公派留学项目的公告与申请入口，大三大四用得上。",
        tag: "官方"
      }
    ]
  },

  {
    group: "顺手工具",
    note: "写论文、查资料时最常用的几个，都是免费能用的",
    items: [
      {
        name: "Zotero",
        url: "https://www.zotero.org/",
        desc: "文献管理，一键抓取网页信息，自动生成参考文献格式。",
        tag: "开源"
      },
      {
        name: "Overleaf",
        url: "https://www.overleaf.com/",
        desc: "在线 LaTeX 编辑器，有现成模板，写课程报告和论文都能用。",
        tag: "免费"
      },
      {
        name: "DeepL 翻译",
        url: "https://www.deepl.com/translator",
        desc: "长句和专业术语的翻译质量明显好于通用机翻。",
        tag: "免费"
      },
      {
        name: "Wolfram Alpha",
        url: "https://www.wolframalpha.com/",
        desc: "解方程、求积分、画函数图，检查作业答案很好用。",
        tag: "免费"
      }
    ]
  }

];
