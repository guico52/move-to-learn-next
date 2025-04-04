import { NextApiRequest, NextApiResponse } from 'next';
import { findOrCreateUser } from '../../../utils/userService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: '缺少必要参数' });
  }

  try {
    // 查找或创建用户
    const result = await findOrCreateUser({
      walletAddress,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        details: result.details
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: result.user?.id,
        walletAddress: result.user?.walletAddress,
        isInitialized: result.user?.isInitialized,
        profileId: result.user?.profileId,
      },
      isFirstLogin: result.isFirstLogin,
    });
  } catch (error) {
    console.error('登录错误:', error);
    return res.status(500).json({ 
      success: false,
      error: '登录处理失败' 
    });
  }
} 