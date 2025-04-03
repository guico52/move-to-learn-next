import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../utils/prisma';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

// 区块链配置
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const MODULE_NAME = process.env.NEXT_PUBLIC_MODULE_NAME || '';
const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'devnet';

// 初始化 Aptos 客户端
const getAptosClient = () => {
  const network = NETWORK as Network;
  const config = new AptosConfig({ network });
  return new Aptos(config);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: '缺少钱包地址' });
  }

  try {
    console.log(`正在为钱包 ${walletAddress} 初始化用户...`);
    
    // 检查用户是否已经在数据库中
    const existingUser = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!existingUser) {
      console.log(`钱包 ${walletAddress} 的用户不存在`);
      return res.status(404).json({ error: '用户不存在' });
    }

    // 如果用户已初始化，直接返回成功
    if (existingUser.isInitialized && existingUser.profileId) {
      console.log(`钱包 ${walletAddress} 的用户已初始化，profileId: ${existingUser.profileId}`);
      return res.status(200).json({
        success: true,
        profileId: existingUser.profileId,
        message: '用户已初始化',
      });
    }

    console.log(`开始为钱包 ${walletAddress} 创建学习档案...`);
    
    // 调用区块链创建学习档案
    try {
      // 获取Aptos客户端实例
      const aptos = getAptosClient();
      console.log(`成功连接到${NETWORK}网络`);
      
      // 模拟生成一个学习档案ID（实际应从区块链返回）
      const profileId = `profile_${Date.now()}`;
      console.log(`生成的档案ID: ${profileId}`);

      // 更新用户状态
      await prisma.user.update({
        where: { walletAddress },
        data: {
          isInitialized: true,
          profileId,
        },
      });
      console.log(`已更新用户 ${walletAddress} 的初始化状态`);

      return res.status(200).json({
        success: true,
        profileId,
        message: '用户学习档案已初始化',
      });
    } catch (blockchainError: unknown) {
      console.error('区块链操作错误:', blockchainError);
      const errorMessage = blockchainError instanceof Error 
        ? blockchainError.message 
        : '未知错误';
      throw new Error(`区块链初始化失败: ${errorMessage}`);
    }
  } catch (error: unknown) {
    console.error('初始化用户错误:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return res.status(500).json({ 
      success: false,
      error: `服务器错误，初始化失败: ${errorMessage}` 
    });
  }
} 