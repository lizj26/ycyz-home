# 宁夏银川一中之家

银川一中在读学生与毕业一到两年校友的公共入口：找资料、看同学去向、找个能问选课的地方。

本站由学生和校友自发搭建维护，与学校没有隶属关系，也不代表学校立场。

线上地址：<https://lizj26.github.io/ycyz-home/>

## 站点内容

- 毕业留念（[memory/](memory/)）：按届分卷的「蹭饭图」，可按班级查看每位同学去了哪座城市、哪所学校。目前收录 2026 届 16 个班。
- 高中资料（[highschool/](highschool/)）：笔记、真题、讲义的索引。页面与数据结构已就位，暂无收录内容。
- 大学资料（[university/](university/)）：公开课、文献检索、开源课程、入学准备、常用工具，分五组共 23 条。只给外部入口，不镜像内容。
- 文字论坛（[forum/](forum/)）：发帖与问答。这部分需要后端，代码在独立仓库，尚未部署，站内显示为「筹备中」。
- 大学资讯（[university-know](https://lizj26.github.io/university-know/)）：清华、浙大、上交、西交四校的官网与公众号更新，另含一个站内知识地图。独立仓库、独立维护，本站只做外链。

除论坛之外全部是静态文件，没有构建步骤，也不依赖服务端。

## 目录结构

```
ycyz-home/
├─ index.html                 门户首页
├─ 404.html                   Pages 找不到页面时的兜底页
├─ robots.txt                 挡掉 /memory/ 与 /forum/ 的抓取
├─ .nojekyll                  关闭 Jekyll 处理
├─ assets/
│  ├─ site.config.js          全站配置：论坛地址、外站地址、子站路径
│  ├─ portal.css              门户样式
│  ├─ subpage.css             子页样式
│  ├─ hero3d.js               首屏 3D 场景（程序生成，无图片素材）
│  └─ emblem.png              百廿校庆纪念标
├─ memory/                    毕业留念
│  ├─ index.html              总入口，按班级列出
│  ├─ class.html              单个班级页，参数 cls=N、year=YYYY
│  ├─ data/years.js           届别清单
│  ├─ data/2026.js            2026 届各班去向
│  ├─ assets/                 地图、背景音乐、入场动画、届别装载器
│  └─ game/                   小游戏「2 班人会飞」
├─ highschool/
│  ├─ index.html
│  └─ data/links.js           资料清单，目前是空数组
├─ university/
│  ├─ index.html
│  └─ data/links.js           入口清单，五组
├─ forum/
│  └─ index.html              占位说明；配置论坛地址后自动跳转
└─ docs/
   ├─ 维护手册.md
   └─ 部署与仓库.md
```

日常改动集中在 `assets/site.config.js`、`memory/data/`、`highschool/data/links.js`、`university/data/links.js` 这四处，其余文件基本不用碰。

## 本地运行

仓库是纯静态的，起一个静态文件服务就能看到完整站点：

```bash
python -m http.server 8000
# 打开 http://127.0.0.1:8000/
```

直接双击 HTML 用 `file://` 打开也能看大部分页面，但相对路径和外链的行为与线上不完全一致，调试时建议用本地服务。不需要 `npm install`，也没有构建产物。

## 部署

站点由 GitHub Pages 托管，源为 `main` 分支根目录，已经启用。

更新流程就是提交并推送：

```bash
git add -A
git commit -m "添加 2027 届毕业留念"
git push
```

Pages 会在推送后自动重建，通常半分钟到一分钟生效。本地浏览器有缓存时用 `Ctrl+F5` 强制刷新。

根目录的 `.nojekyll` 不能删。没有它，Jekyll 会跳过以下划线开头的路径和文件。

如果是新建仓库或换了托管位置，重新配置的步骤见 [docs/部署与仓库.md](docs/部署与仓库.md)。

## 日常维护

| 要做的事 | 改哪里 |
| --- | --- |
| 毕业留念新增一届 | `memory/data/years.js`，并新建 `memory/data/2027.js` |
| 大学资料增删条目 | `university/data/links.js` |
| 高中资料开始收录 | `highschool/data/links.js` |
| 论坛上线后接入 | `assets/site.config.js` 的 `forumUrl` |
| 资讯站换地址 | `assets/site.config.js` 的 `universityKnow` |
| 调整配色 | `assets/portal.css` 顶部的 `:root` |
| 修改公用文案 | 各页 `<footer>`，共五处，需一起改 |

详细步骤、数据格式和故障排查见 [docs/维护手册.md](docs/维护手册.md)。

## 技术约定

视觉：主色绛红 `#a9291c`，强调色鎏金 `#c9973f`，纸底米黄，取自百廿校庆纪念标。标题用衬线字体，正文用系统中文黑体。门户与三个子页共用一套 CSS 变量；`memory/` 保留独立样式，那是这一页原有的设计。

路径：站内互相引用一律用相对路径，因此部署在根目录、子目录或本地都能正常打开。将来若把某个子站拆成独立域名，改 `assets/site.config.js` 的 `paths` 即可。

不引框架：没有 Vue、React，也没有打包工具。页面逻辑都是原生 JS，单个文件几十行，改动成本低。

渐进增强：`memory/`、`university/`、`highschool/` 的数据通过 `<script>` 注入全局变量。脚本加载失败时页面显示空状态，不会白屏。

### 性能

图片按实际显示尺寸出图。页面里 42px 的徽标不要用 512px 的源文件，二倍屏给两倍、最多三倍，单张控制在 60KB 以内。首屏之外的图片带 `loading="lazy" decoding="async"`，首屏关键图带 `fetchpriority="high"`。

首屏的 3D 场景是纯装饰，`three.js`(619KB) 与入场动画(184KB) 只在确实会播放时才请求。触发条件是同时满足：本次会话没播放过、视口宽度不小于 1100px、未开启省流量模式、系统未要求减少动效、设备内存大于 2GB。任一条不满足则不发起请求，首屏退回 CSS 视觉，功能不受影响。

场景内容由 `assets/hero3d.js` 在运行时生成：120 根金柱、三圈细环、金尘与中央印章，不使用任何图片素材。加载动作排在 `requestIdleCallback` 之后，挂载失败就不加 `has3d` 类，画布保持透明。

不需要这个效果时，删掉 `index.html` 里「首屏 3D 按需加载」那一段 `<script>` 即可。`memory/assets/three.min.js` 还被毕业留念的入场动画使用，不要一并删除。

小游戏的背景图在页面 `load` 之后的空闲时间才请求，画布动画在标签页切到后台或滚出视口时停止。

## 内容边界

毕业留念中的人名一律只写拼音首字母，原始蹭饭图不对外发布。该页面带 `noindex`，根目录 `robots.txt` 另外挡掉了 `/memory/` 与 `/forum/`。

论坛设计上不支持图片和附件，不保存手机号，新账号的前三条发言需审核。

只收录学生自己整理、或作者明确允许转载的内容。不传教辅扫描件，不搬运付费课程的录屏。涉及侵权请提 issue，维护者核实后会删除。

「大学资料」只提供外部链接，不存储第三方内容，因此不涉及转载授权。

## 相关仓库

| 仓库 | 内容 | 与本站的关系 |
| --- | --- | --- |
| [lizj26/university-know](https://github.com/lizj26/university-know) | 四校资讯聚合与知识地图 | 独立站点，本站只做外链 |
| `campus-forum` | 论坛后端（Flask + SQLite） | 尚未部署，部署后填入 `forumUrl` 接入 |
