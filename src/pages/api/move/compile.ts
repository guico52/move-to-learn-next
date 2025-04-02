import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

// 检查 Sui CLI 是否可用
async function checkSuiCLI(): Promise<boolean> {
  try {
    await execAsync('sui --version');
    return true;
  } catch {
    return false;
  }
}

// 复制目录的辅助函数
async function copyDir(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

// 获取 Sui 框架路径
async function getSuiFrameworkPath(): Promise<string> {
  try {
    // 首先尝试从环境变量获取
    const suiPath = process.env.SUI_FRAMEWORK_PATH;
    if (suiPath && await fs.access(suiPath).then(() => true).catch(() => false)) {
      return suiPath;
    }

    // 如果环境变量不存在，尝试从 sui 命令获取路径
    const { stdout } = await execAsync('where sui');
    const suiBinPath = stdout.split('\n')[0].trim();
    
    // Windows 上通常 sui.exe 在 .sui\bin 目录下
    // 框架文件在 .sui\sui-framework\packages 目录下
    const suiHome = path.join(os.homedir(), '.sui');
    const frameworkPath = path.join(suiHome, 'sui-framework', 'packages');
    
    if (await fs.access(frameworkPath).then(() => true).catch(() => false)) {
      return frameworkPath;
    }

    throw new Error('无法找到 Sui 框架目录');
  } catch (error) {
    throw new Error(`获取 Sui 框架路径失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: '只支持 POST 请求' 
    });
  }

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ 
        success: false, 
        error: '请提供代码' 
      });
    }

    // 检查 Sui CLI
    const cliAvailable = await checkSuiCLI();
    if (!cliAvailable) {
      return res.status(500).json({
        success: false,
        error: '未检测到 Sui CLI。请确保已安装 Sui 并添加到系统 PATH 中。\n\n安装步骤：\n1. 访问 https://docs.sui.io/build/install\n2. 按照说明安装 Sui\n3. 确保 sui 命令可在终端中运行'
      });
    }

    // 创建临时项目目录
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sui-playground-'));

    try {
      // 创建新的 Sui Move 项目
      await execAsync('sui move new playground', {
        cwd: tempDir,
        encoding: 'utf8',
      });

      const projectDir = path.join(tempDir, 'playground');
      const sourcesDir = path.join(projectDir, 'sources');

      // 写入源代码文件
      await fs.writeFile(path.join(sourcesDir, 'playground.move'), code, 'utf8');

      // 执行编译命令
      const { stdout, stderr } = await execAsync('sui move build', {
        cwd: projectDir,
        encoding: 'utf8',
        env: {
          ...process.env,
          LANG: 'en_US.UTF-8',
        }
      });

      return res.status(200).json({
        success: true,
        output: stdout,
        error: stderr || null
      });
    } finally {
      // 清理临时文件

      console.log('tempDir', tempDir);
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (e) {
        console.error('清理临时文件失败:', e);
      }
    }
  } catch (error) {
    console.error('编译错误:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : '编译过程中发生未知错误';
    
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
} 