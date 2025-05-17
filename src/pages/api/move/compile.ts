import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

// 检查 Aptos CLI 是否可用
async function checkAptosCLI(): Promise<boolean> {
  try {
    await execAsync('aptos --version');
    return true;
  } catch {
    return false;
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

    // 检查 Aptos CLI
    const cliAvailable = await checkAptosCLI();
    if (!cliAvailable) {
      return res.status(500).json({
        success: false,
        error: '未检测到 Aptos CLI。请确保已安装 Aptos 并添加到系统 PATH 中。\n\n安装步骤：\n1. 访问 https://aptos.dev/tools/aptos-cli/install-cli/\n2. 按照说明安装 Aptos CLI\n3. 确保 aptos 命令可在终端中运行'
      });
    }

    // 创建临时项目目录
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aptos-playground-'));

    try {
      // 直接在临时目录下初始化 Move 项目
      await execAsync('aptos move init --name playground', {
        cwd: tempDir,
        encoding: 'utf8',
      });

      const sourcesDir = path.join(tempDir, 'sources');
      
      // 确保 sources 目录存在
      await fs.mkdir(sourcesDir, { recursive: true });

      // 写入源代码文件 - 使用与模块名匹配的文件名
      const sourceFile = path.join(sourcesDir, 'hello.move');
      await fs.writeFile(sourceFile, code, 'utf8');

      // 执行编译命令，明确指定要编译的文件
      let compileSuccess = true;
      let compileStdout = '';
      let compileStderr = '';

      try {
        const result = await execAsync(`aptos move compile --named-addresses playground=0x1`, {
          cwd: tempDir,
          encoding: 'utf8',
          env: {
            ...process.env,
            LANG: 'en_US.UTF-8',
          }
        });
        compileStdout = result.stdout;
        compileStderr = result.stderr;
      } catch (error) {
        // 编译失败时，exec 会抛出错误
        compileSuccess = false;
        if (error instanceof Error && 'stdout' in error && 'stderr' in error) {
          const execError = error as { stdout: string; stderr: string };
          compileStdout = execError.stdout;
          compileStderr = execError.stderr;
        } else {
          compileStderr = error instanceof Error ? error.message : String(error);
        }
      }

      // 返回编译结果
      return res.status(200).json({
        success: compileSuccess,
        output: compileStdout,
        error: compileStderr || null
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