import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }

    // 创建临时目录
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'move-playground-'));
    const sourceFile = path.join(tempDir, 'main.move');

    // 写入源代码文件
    await fs.writeFile(sourceFile, code);

    // 执行编译命令
    const { stdout, stderr } = await execAsync(`move compile ${sourceFile}`);

    // 清理临时文件
    await fs.rm(tempDir, { recursive: true, force: true });

    return res.status(200).json({
      success: true,
      output: stdout,
      error: stderr || null
    });
  } catch (error) {
    console.error('Compilation error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
} 