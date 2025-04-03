import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../utils/prisma';
import { 
  Aptos, 
  AptosConfig, 
  Network, 
  AccountAddress,
  InputGenerateTransactionPayloadData,
  AptosApiError
} from '@aptos-labs/ts-sdk';

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

// 格式化钱包地址
const formatAddress = (address: string): string => {
  // 移除 0x 前缀
  const cleanAddress = address.startsWith('0x') ? address.slice(2) : address;
  // 补齐到64位（不包括0x前缀）
  const paddedAddress = cleanAddress.toLowerCase().padStart(64, '0');
  console.log('原始地址:', address);
  console.log('格式化后地址:', '0x' + paddedAddress);
  return '0x' + paddedAddress;
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
    // 格式化钱包地址
    const formattedAddress = formatAddress(walletAddress);
    console.log(`正在为钱包 ${formattedAddress} 初始化用户...`);
    
    // 检查用户是否已经在数据库中
    const existingUser = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!existingUser) {
      console.log(`钱包 ${formattedAddress} 的用户不存在`);
      return res.status(404).json({ error: '用户不存在' });
    }

    // 如果用户已初始化，直接返回成功
    if (existingUser.isInitialized && existingUser.profileId) {
      console.log(`钱包 ${formattedAddress} 的用户已初始化，profileId: ${existingUser.profileId}`);
      return res.status(200).json({
        success: true,
        profileId: existingUser.profileId,
        message: '用户已初始化',
      });
    }

    console.log(`开始为钱包 ${formattedAddress} 创建学习档案...`);
    
    try {
      // 获取Aptos客户端实例
      const aptos = getAptosClient();
      console.log(`成功连接到${NETWORK}网络`);

      // 使用格式化后的地址
      const sender = AccountAddress.fromString(formattedAddress);
      console.log(`交易发送者: ${sender}`);

      try {
        // 检查账户是否存在
        await aptos.getAccountInfo({ accountAddress: sender });
      } catch (accountError) {
        if (accountError instanceof AptosApiError && accountError.data?.error_code === 'account_not_found') {
          return res.status(400).json({
            success: false,
            error: '您的钱包地址尚未在链上激活，请先在 Aptos 链上进行一笔交易以激活账户',
            details: '您可以通过以下方式激活账户：\n1. 从交易所转入一些 APT\n2. 使用水龙头获取测试币（如果在测试网）\n3. 让其他用户转账给您',
            formattedAddress
          });
        }
        throw accountError;
      }

      // 创建交易payload
      const payload: InputGenerateTransactionPayloadData = {
        function: `${CONTRACT_ADDRESS}::certificates::initialize_student`,
        typeArguments: [],
        functionArguments: []
      };

      // 生成交易
      const rawTxn = await aptos.transaction.build.simple({
        sender,
        data: payload
      });

      // 返回未签名的交易给前端
      return res.status(200).json({
        success: true,
        message: '请在钱包中确认交易以完成初始化',
        transaction: rawTxn,
        profileId: walletAddress,
        formattedAddress
      });

    } catch (blockchainError: unknown) {
      console.error('区块链操作错误:', blockchainError);
      const errorMessage = blockchainError instanceof Error 
        ? blockchainError.message 
        : '未知错误';
      
      // 如果是账户不存在错误，返回友好的错误信息
      if (blockchainError instanceof AptosApiError && 
          blockchainError.data?.error_code === 'account_not_found') {
        return res.status(400).json({
          success: false,
          error: '您的钱包地址尚未在链上激活',
          details: '请先在 Aptos 链上进行一笔交易以激活您的账户',
          formattedAddress
        });
      }

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