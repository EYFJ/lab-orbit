# Cloudflare 部署实际检查与下一步（2026-10-07）

## 范围

用户提供的两份文档对应 LabHub / LabOrbit，不对应 EduAgent。本轮按文档所在项目 lab-orbit-1.1 完成本地准备；部署目标仍待用户确认。未执行云端创建、SQL 导入、发布或 Git 操作，未更改业务源码与 Wrangler 配置。

## 已执行

- frontend 下 npm ci：按 package-lock.json 安装 217 个包，未升级版本。
- npm test：97 个测试文件、698 项测试全部通过。
- npm run build：生产构建通过，输出 frontend/dist。
- Windows 环境变量方式构建 Demo：通过，独立输出 frontend/dist-demo。
- Pages Functions 使用现有兼容日期和 nodejs_compat 编译：通过，输出 frontend/.deploy-check/functions。
- Wrangler whoami：当前电脑未登录 Cloudflare，文档中的已授权状态不成立。

## 发现的实际差异

| 项目 | 文档 | 本机实际状态 |
| --- | --- | --- |
| Pages 项目 | labhub | package.json 和 wrangler.json 为 lab-hub-preview |
| D1 数据库 | labhub-db | 配置名 lab-hub-db，ID 是占位字符串 |
| R2 绑定 | 已配置附件桶 | wrangler.json 没有 FILES_BUCKET 绑定 |
| 历史数据 | scripts/data_d1.sql | 文件不存在 |
| 导出源库 | backend/labhub.db | 文件不存在；Docker 数据在相邻 lab-orbit-docker/data/labhub.db |
| 登录权限 | 已登录、管理员 | whoami 返回未认证，当前权限无法确认 |
| 代码仓库 | 可 push main | 当前文件夹不是 Git 仓库 |

导出脚本会先覆盖 scripts/schema_d1.sql，再连接不存在的 backend/labhub.db，因此本轮没有运行它。迁移应先核对数据源，采用只读备份/导出，并保留 BLOB 附件，不能把原脚本中 bytes 转 NULL 的行为当成完整迁移。

## 确认 LabHub 后的执行顺序

所有 npm / Wrangler 命令在 frontend 目录执行。

1. `npx wrangler login`：浏览器由用户选择 Cloudflare 账号并完成授权，无需把密码或 Token 发给助手。
2. `npx wrangler whoami`，然后只读列出 `npx wrangler pages project list`、`npx wrangler d1 list`，核对账号与目标项目；不要重复创建已经存在的资源。
3. 核对真实数据库 ID，配置 DB 绑定。若已有线上库，先导出备份、只读检查表结构，再决定加法迁移，禁止直接导入覆盖现有用户资料。
4. 判断是否需要 FILES_BUCKET；核对已有 R2 桶及账号启用状态，再配置附件绑定。设置独立 JWT_SECRET 和邀请码，不用仓库通用密钥发布。
5. 确认历史数据来源：使用 Docker SQLite 只读快照，校验表、行数、附件和密码摘要；采用适配 D1 的迁移方案，禁止运行旧导出脚本覆盖当前 schema 文件。
6. 配置完毕后复核单元测试、生产包和 Functions 打包，先发布隔离预览，再验证登录、权限、附件和核心页面。
7. 验证通过后交付访问网址。当前目录没有 Git 仓库，Git 同步需另行确认真实仓库；AGENTS.md 要求推送由用户自行执行。

## 官方参考

- Pages 配置与绑定：https://developers.cloudflare.com/pages/functions/wrangler-configuration/
- Pages Functions 绑定：https://developers.cloudflare.com/pages/functions/bindings/
- D1 导入导出：https://developers.cloudflare.com/d1/best-practices/import-export-data/

本地构建成功只证明代码可编译，不代表云端账号、绑定和迁移已验证；当前尚未上线。
