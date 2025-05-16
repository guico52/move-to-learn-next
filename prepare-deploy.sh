#!/bin/bash

echo "正在准备部署文件..."

# 创建部署文件夹
if [ -d "deploy" ]; then
    echo "清理旧的部署文件夹..."
    rm -rf deploy
fi
mkdir -p deploy

# 复制 standalone 文件夹
echo "复制 standalone 文件夹..."
cp -r .next/standalone deploy/standalone

# 在 standalone 文件夹中创建 next-static 文件夹并复制 static 文件
echo "复制静态资源文件..."
mkdir -p deploy/standalone/next-static
cp -r .next/static deploy/standalone/next-static

# 复制 public 文件夹到 standalone 目录
if [ -d "public" ]; then
    echo "复制 public 文件夹..."
    cp -r public deploy/standalone/public
fi

# 创建示例 .env 文件
echo "创建示例 .env 文件..."
cat > deploy/.env.example << EOL
# 环境变量配置示例
PORT=3000
NODE_ENV=production
EOL

# 创建启动脚本
echo "创建启动脚本..."
cat > deploy/start.sh << EOL
#!/bin/bash
cd standalone
export PORT=3000
export NODE_ENV=production
mkdir -p .next
cp -r next-static/* .next/static/
node server.js
EOL

# 设置启动脚本可执行权限
chmod +x deploy/start.sh

# 创建 README 文件
echo "创建部署说明文档..."
cat > deploy/README.md << EOL
# 部署说明

## 文件结构
- \`standalone/\` - 应用程序主要文件
  - \`next-static/\` - Next.js 静态资源文件
  - \`public/\` - 公共资源文件
- \`.env.example\` - 环境变量配置示例
- \`start.sh\` - 启动脚本

## 部署步骤
1. 复制 \`.env.example\` 为 \`.env\` 并配置环境变量:
   \`\`\`bash
   cp .env.example .env
   vim .env  # 编辑环境变量
   \`\`\`

2. 设置启动脚本执行权限:
   \`\`\`bash
   chmod +x start.sh
   \`\`\`

3. 运行应用:
   \`\`\`bash
   ./start.sh
   \`\`\`

## PM2 部署方式
1. 安装 PM2:
   \`\`\`bash
   npm install -g pm2
   \`\`\`

2. 使用 PM2 启动应用:
   \`\`\`bash
   pm2 start start.sh --name "your-app-name"
   \`\`\`

3. 设置开机自启:
   \`\`\`bash
   pm2 startup
   pm2 save
   \`\`\`

## Nginx 配置示例
\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
\`\`\`

## 注意事项
- 确保服务器已安装 Node.js
- 建议使用 PM2 进行进程管理
- 建议配置 Nginx 作为反向代理
- 静态文件会在启动时自动复制到正确位置
EOL

# 创建压缩脚本
echo "创建压缩脚本..."
cat > deploy/compress.sh << EOL
#!/bin/bash
cd \$(dirname \$0)
tar -czf ../deploy.tar.gz *
echo "压缩完成！deploy.tar.gz 已创建在上级目录。"
EOL

chmod +x deploy/compress.sh

echo "部署文件准备完成！"
echo "所有文件已整理到 deploy 文件夹中。"
echo "运行 ./compress.sh 可以创建部署压缩包。" 