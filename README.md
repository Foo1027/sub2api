# Sub2API 本地中转站

这套目录是一个可直接启动的 `sub2api` 本地部署包，使用 Docker Compose 启动以下服务：

- `sub2api`
- `PostgreSQL`
- `Redis`

## 1. 初始化

```bash
make prepare
```

这一步会：

- 生成 `.env`
- 自动补齐随机密钥和数据库密码
- 创建本地数据目录

## 2. 确保 Docker 可用

如果你是用 Colima：

```bash
colima start
```

确认 Docker daemon 正常后启动：

```bash
make up
```

## 3. 访问

默认地址：

```text
http://127.0.0.1:8080
```

默认会自动创建管理员账号，账号邮箱来自 `.env` 里的 `ADMIN_EMAIL`。

如果 `make prepare` 时自动生成了密码，终端里会打印出来；之后也可以直接去 `.env` 查看或改掉。

## 4. 常用命令

```bash
make ps
make logs
make down
make config
```

## 5. 对外提供服务

当前默认只绑定本机 `127.0.0.1`，这样更安全。

如果你要让局域网或公网访问：

1. 把 `.env` 里的 `BIND_HOST` 改成 `0.0.0.0`
2. 前面加反向代理（推荐 Caddy 或 Nginx）
3. 开启 HTTPS
4. 限制管理后台访问来源

## 6. 可选调整

`.env` 里可以按需修改：

- `SERVER_PORT`
- `ADMIN_EMAIL`
- `ALLOW_PRIVATE_HOSTS`
- `ALLOW_INSECURE_HTTP`

只有在你明确需要转发到内网地址或非 HTTPS 上游时，才建议把后两个选项改成 `true`。
