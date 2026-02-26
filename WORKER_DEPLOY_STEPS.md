# Cloudflare Worker 一键部署步骤

## 0. 前提
- 已有 Cloudflare 账号
- 本机可用 PowerShell

## 1. 在项目目录安装/调用 Wrangler
在终端执行：

```powershell
cd c:\Users\mzysh\Desktop\blog
npx wrangler --version
```

如果提示安装，输入 `y`。

## 2. 登录 Cloudflare（会弹浏览器授权）
```powershell
npx wrangler login
```

## 3. 设置 Worker 变量（匿名 key，公开可用）
```powershell
npx wrangler secret put SUPABASE_ANON_KEY
```

执行后把你的 `sb_publishable_...` 粘贴进去回车。

## 4. 部署 Worker
```powershell
npx wrangler deploy
```

部署成功后会给你一个地址，例如：
`https://shenmu-supabase-proxy.<subdomain>.workers.dev`

## 5. 切换前端到代理地址
编辑 `supabase-config.js`，把这行改成你的 Worker 地址：

```js
window.BLOG_API_BASE = "https://shenmu-supabase-proxy.<subdomain>.workers.dev";
```

## 6. 推送触发 Vercel 更新
```powershell
git add supabase-config.js
git commit -m "chore: switch api base to cloudflare worker"
git push
```

## 7. 验证
1. 打开线上 `Diary` 和 `Guestbook`
2. 测试登录、读取、写入
3. 若失败，先看页面错误提示，再看 Worker 日志：
```powershell
npx wrangler tail
```

