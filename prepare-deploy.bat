@echo off
echo 正在准备部署文件...

:: 创建部署文件夹
if exist deploy (
    echo 清理旧的部署文件夹...
    rd /s /q deploy
)
mkdir deploy

:: 复制 standalone 文件夹
echo 复制 standalone 文件夹...
xcopy /E /I /Y .next\standalone deploy\standalone

:: 在 standalone 文件夹中创建 next-static 文件夹并复制 static 文件
echo 复制静态资源文件...
mkdir deploy\standalone\next-static
xcopy /E /I /Y .next\static deploy\standalone\next-static

:: 复制 public 文件夹到 standalone 目录
if exist public (
    echo 复制 public 文件夹...
    xcopy /E /I /Y public deploy\standalone\public
)

:: 创建示例 .env 文件
echo 创建示例 .env 文件...
echo # 环境变量配置示例 > deploy\.env.example
echo PORT=3000 >> deploy\.env.example
echo NODE_ENV=production >> deploy\.env.example

:: 创建启动脚本
echo 创建启动脚本...
echo @echo off > deploy\start.bat
echo cd standalone >> deploy\start.bat
echo set PORT=3000 >> deploy\start.bat
echo set NODE_ENV=production >> deploy\start.bat
echo mkdir .next >> deploy\start.bat
echo xcopy /E /I /Y next-static .next\static\ >> deploy\start.bat
echo node server.js >> deploy\start.bat

:: 创建 README 文件
echo 创建部署说明文档...
echo # 部署说明 > deploy\README.md
echo. >> deploy\README.md
echo ## 文件结构 >> deploy\README.md
echo - `standalone/` - 应用程序主要文件 >> deploy\README.md
echo   - `next-static/` - Next.js 静态资源文件 >> deploy\README.md
echo   - `public/` - 公共资源文件 >> deploy\README.md
echo - `.env.example` - 环境变量配置示例 >> deploy\README.md
echo - `start.bat` - Windows 启动脚本 >> deploy\README.md
echo. >> deploy\README.md
echo ## 部署步骤 >> deploy\README.md
echo 1. 复制 `.env.example` 为 `.env` 并配置环境变量 >> deploy\README.md
echo 2. 运行 `start.bat` 启动应用 >> deploy\README.md
echo. >> deploy\README.md
echo ## 注意事项 >> deploy\README.md
echo - 确保服务器已安装 Node.js >> deploy\README.md
echo - 建议使用 PM2 进行进程管理 >> deploy\README.md
echo - 建议配置 Nginx 作为反向代理 >> deploy\README.md
echo - 静态文件会在启动时自动复制到正确位置 >> deploy\README.md

:: 创建压缩脚本
echo 创建压缩脚本...
echo @echo off > deploy\compress.bat
echo powershell Compress-Archive -Path * -DestinationPath ..\deploy.zip >> deploy\compress.bat
echo echo 压缩完成！deploy.zip 已创建在上级目录。 >> deploy\compress.bat
echo pause >> deploy\compress.bat

echo 部署文件准备完成！
echo 所有文件已整理到 deploy 文件夹中。
echo 运行 compress.bat 可以创建部署压缩包。
pause 