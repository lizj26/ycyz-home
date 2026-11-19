# 宁夏银川一中之家

> 在读的时候找资料，毕业以后找去处。

面向**银川一中在读学生**和**毕业 1—2 年**的校友，把四样东西收进一个入口：

| 部分 | 位置 | 内容 | 状态 |
|---|---|---|---|
| 文字论坛 | `forum/`（后端待部署） | 发帖、回帖、选课问答、二手与失物 | 筹备中 |
| 毕业留念 | `memory/` | 按届分卷的「蹭饭图」，谁去了哪座城市 | 已上线（2026 届 · 16 个班） |
| 高中开源资料 | `highschool/` | 笔记、真题、讲义、错题本 | 空壳，等第一份投稿 |
| 大学开源资料 | `university/` | 只给入口：公开课、图书馆、开源笔记、工具 | 已上线 |
| 大学资讯聚合 | 外链 → [university-know](https://lizj26.github.io/university-know/) | 四所高校官网与公众号更新 | 独立仓库，独立维护 |

纯静态站点：**没有构建、没有依赖、没有服务器费**。唯一的例外是论坛——它需要后端，代码放在另一个仓库。

**非官方**，由学生与校友自发搭建维护，不代表学校立场。

- 本仓库：`lizj26/ycyz-home`
- 线上地址（在 Settings → Pages 启用后）：<https://lizj26.github.io/ycyz-home/>
- 关联但独立的仓库：[`lizj26/university-know`](https://github.com/lizj26/university-know)

---

## 一、两个仓库的边界

这是本项目最容易搞混的地方，先说清楚：

```
lizj26/ycyz-home          ← 本仓库，一个 Pages 站点，四个子目录
├─ 论坛占位前端
├─ 毕业留念
├─ 高中资料
├─ 大学资料（入口目录）
└─ 门户首页 ──────────────→ 外链，跳出去
                            lizj26/university-know   ← 另一个仓库、另一个 Pages 站点
                            └─ 四所高校的资讯聚合（清华 / 浙大 / 上交 / 西交 + 知识地图）
```

- **`university-know` 不在本仓库里，一行代码都没有复制过来。** 它有自己的抓取脚本、
  自己的 Actions 定时任务、自己的 Pages 地址，改动和发布都独立进行。
- 门户里的「大学资讯聚合」卡片是一个**纯外链**（新窗口打开），由
  `assets/site.config.js` 的 `universityKnow` 一项控制。
- 因此：`university-know` 挂了、改版了、换地址了，本站其余部分照常工作。
- 反过来也一样：本站删掉那张卡片，`university-know` 照常工作。

**它换地址了怎么办？** 只改一处：

```js
// assets/site.config.js
universityKnow: "https://新地址/"
```

不需要改任何 HTML。详见 [`docs/部署与仓库.md`](docs/部署与仓库.md)。

---

## 二、目录结构

```
ycyz-home/
├─ index.html                门户首页（五个入口）
├─ 404.html                  Pages 找不到页面时的兜底页
├─ assets/
│  ├─ site.config.js         ★ 全站配置：论坛地址、外部站点地址
│  ├─ portal.css             门户样式（配色、卡片、页脚）
│  ├─ subpage.css            子页样式（列表行、空状态、提示框）
│  └─ emblem.png             百廿校庆纪念标
│
├─ memory/                   毕业留念「蹭饭图」· 按届分卷
│  ├─ index.html             总入口（1—16 班卡片）
│  ├─ class.html?cls=N       单个班级页
│  ├─ data/years.js          ★ 有哪几届（届别清单）
│  ├─ data/2026.js           ★ 2026 届的班级去向
│  ├─ assets/                地图、背景音乐、节日彩蛋、届别装载器 year-loader.js
│  └─ game/                  小游戏「2 班人会飞」
│
├─ highschool/
│  ├─ index.html             高中资料页（空状态）
│  └─ data/links.js          ★ 资料清单（现在是空数组）
│
├─ university/
│  ├─ index.html             大学入口目录页
│  └─ data/links.js          ★ 入口清单（5 组，含收录原则注释）
│
├─ forum/
│  └─ index.html             论坛占位说明（后端上线后自动跳转）
│
└─ docs/
   ├─ 维护手册.md            日常改内容：加一届、加链接、开论坛
   └─ 部署与仓库.md          仓库关系、Pages 设置、地址变更
```

带 ★ 的四个文件是日常要动的，其余基本不用碰。

---

## 三、本地预览

因为是纯静态，起个静态服务就能看全站（`file://` 直接双击大部分页面也能开，
但本地服务更接近线上行为，推荐用这个）：

```bash
cd ycyz-home
python -m http.server 8000
# 打开 http://127.0.0.1:8000/
```

不需要 `npm install`，不需要 `pip install`。改完文件刷新浏览器即可，**没有构建步骤**。

---

## 四、部署

站点由 GitHub Pages 托管，发布方式二选一。

### 方式 A：从分支发布（推荐，零配置）

1. 推到 `main` 分支；
2. 仓库 **Settings → Pages**；
3. **Source** 选 `Deploy from a branch`，分支 `main`、目录 `/ (root)`，保存；
4. 等 1—2 分钟，访问 `https://lizj26.github.io/ycyz-home/`。

根目录的 `.nojekyll` 是必需的：它会关掉 Jekyll 处理，否则以 `_` 开头的路径
和部分文件名会被忽略。

### 方式 B：从 Actions 发布

仓库目前**没有** Pages workflow。等站点内容稳定、需要"推送后自动构建/校验"
再考虑加，那时把 Source 改成 `GitHub Actions` 并提交 workflow 即可。

### 日常更新

```bash
git add -A
git commit -m "添加 2027 届毕业留念"
git push
```

推送后 Pages 自动重建，30 秒到 1 分钟上线。浏览器有缓存时按 `Ctrl+F5` 强刷。

---

## 五、日常维护

| 想做的事 | 改哪个文件 | 说明 |
|---|---|---|
| 论坛上线后接入 | `assets/site.config.js` 的 `forumUrl` | 填了以后门户、顶栏、子页同时变外链 |
| 毕业留念加一届 | `memory/data/years.js` + 新建 `data/2027.js` | 复制旧文件改数据，两行搞定 |
| 大学资料加一条入口 | `university/data/links.js` | 按分组追加一个对象 |
| 高中资料开始收录 | `highschool/data/links.js` | 把注释里的示例取消注释 |
| 改联系方式 / 投稿方式 | 对应页面的说明区 | 见手册第 6 节 |
| 改配色 | `assets/portal.css` 顶部 `:root` | 子页共用同一套变量 |

完整步骤、数据格式、常见错误排查：**[`docs/维护手册.md`](docs/维护手册.md)**

---

## 六、设计与技术约定

- **视觉**：绛红 `#a9291c` + 鎏金 `#c9973f` + 米黄纸底，取自百廿校庆纪念标；
  标题用衬线（宋/黑混排），正文用系统中文黑体。所有页面共用一套 CSS 变量。
- **路径**：站内互相引用**一律用相对路径**，所以部署在根目录、子目录、
  或本地都能打开；某个子站将来单独拆出去，把 `site.config.js` 的 `paths`
  改成完整 URL 即可，页面不用动。
- **无框架**：不引 Vue/React，不用打包工具。页面逻辑都是原生 JS，
  单个文件几十行，谁都能改。
- **渐进增强**：`memory/`、`university/` 的数据都靠 `<script>` 注入全局变量，
  脚本加载失败时页面显示空状态而不是白屏。

---

## 七、隐私与内容边界

- 毕业留念里的人名**一律只用拼音首字母**，原始蹭饭图不对外；
  页面带 `noindex`，根目录 `robots.txt` 也挡了 `/memory/`。
- 论坛设计上不收图片、不存手机号；新号前 3 条需审核。
- 只放学生自己整理的、或作者明确允许转载的内容。不传教辅扫描件、
  不搬付费课程的录屏。涉及侵权请提 issue，维护者会删。
- 「大学资料」只给外部入口，不镜像内容，因此不涉及转载授权。

---

## 八、文档索引

- [`docs/维护手册.md`](docs/维护手册.md) —— 加一届、加链接、开论坛、排查问题
- [`docs/部署与仓库.md`](docs/部署与仓库.md) —— 仓库拓扑、Pages 设置、与 university-know 的关系
- [`README.md`](README.md) —— 就是本页

## 相关仓库

| 仓库 | 作用 | 关系 |
|---|---|---|
| [`lizj26/university-know`](https://github.com/lizj26/university-know) | 四校资讯聚合 + 知识地图 | 独立站点，本站只做外链 |
| `campus-forum` | 论坛后端（Flask + SQLite） | 尚未部署；部署后填 `forumUrl` 接进来 |
