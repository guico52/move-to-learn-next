import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

// 配置常量
const FAUCET_PRIVATE_KEY = process.env.FAUCET_PRIVATE_KEY;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;
const FAUCET_AMOUNT = ethers.parseEther('0.05'); // 发放 0.05 ETH

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: '方法不允许' });
  }

  try {
    const { walletAddress } = req.body;

    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      return res.status(400).json({ success: false, error: '无效的钱包地址' });
    }

    if (!FAUCET_PRIVATE_KEY || !RPC_URL) {
      console.error('缺少必要的环境变量');
      return res.status(500).json({ success: false, error: '服务器配置错误' });
    }

    // 创建 provider 和 wallet 实例
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(FAUCET_PRIVATE_KEY, provider);

    // 检查水龙头账户余额
    const faucetBalance = await wallet.provider.getBalance(wallet.address);
    if (faucetBalance < FAUCET_AMOUNT) {
      console.error('水龙头余额不足');
      return res.status(500).json({ success: false, error: '水龙头余额不足' });
    }

    // 检查目标地址是否已经有足够的余额
    const targetBalance = await provider.getBalance(walletAddress);
    if (targetBalance >= FAUCET_AMOUNT) {
      return res.status(400).json({ 
        success: false, 
        error: '该地址已有足够的测试币' 
      });
    }

    // 发送交易
    const tx = await wallet.sendTransaction({
      to: walletAddress,
      value: FAUCET_AMOUNT,
      gasLimit: 21000, // 标准转账的 gas 限制
    });

    // 等待交易被确认
    const receipt = await tx.wait();

    return res.status(200).json({
      success: true,
      txHash: receipt?.hash,
      message: '测试币发放成功'
    });

  } catch (error) {
    console.error('发放测试币时出错:', error);
    return res.status(500).json({
      success: false,
      error: '发放测试币失败，请稍后重试'
    });
  }
} 