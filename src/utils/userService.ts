import { prisma } from './prisma';
import axios from 'axios';
import { Aptos, AptosConfig, Network, AptosApiError } from '@aptos-labs/ts-sdk';
import { AccountAddress } from '@aptos-labs/ts-sdk';
import type { InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk';

const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'testnet';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
const NEXT_FAUCET_URL = process.env.NEXT_FAUCET_URL as string;

/**
 * 初始化 Aptos 账户
 * 通过发送一个0 APT到自己的地址来激活账户
 */
const initializeAccount = async (address: string): Promise<{ 
  success: boolean; 
  error?: string;
  transaction?: any;
}> => {
  try {
    const aptos = getAptosClient();
    const sender = AccountAddress.fromString(address);
    
    // 创建一个向自己发送0 APT的交易
    const payload: InputGenerateTransactionPayloadData = {
      function: "0x1::aptos_account::transfer",
      typeArguments: [],
      functionArguments: [sender, "0"] // 发送0 APT到自己的地址
    };

    // 生成交易
    const rawTxn = await aptos.transaction.build.simple({
      sender,
      data: payload
    });

    return {
      success: true,
      transaction: rawTxn
    };
  } catch (error: any) {
    console.error("账户初始化错误:", error);
    return {
      success: false,
      error: error.message || "账户初始化失败"
    };
  }
};

export interface UserLoginData {
  walletAddress: string;
  chainId: number;
}

interface BlockchainInitResult {
  success: boolean;
  profileId?: string;
  error?: string;
  details?: string;
  transaction?: any;
  formattedAddress?: string;
  message?: string;
}

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

/**
 * 在区块链上初始化用户学习档案
 */
const initializeUserOnBlockchain = async (walletAddress: string): Promise<BlockchainInitResult> => {
  try {
    // 格式化钱包地址
    const formattedAddress = formatAddress(walletAddress);
    console.log(`正在为钱包 ${formattedAddress} 初始化用户...`);

    // 获取Aptos客户端实例
    const aptos = getAptosClient();
    console.log(`成功连接到${NETWORK}网络`);

    // 使用格式化后的地址
    const sender = AccountAddress.fromString(formattedAddress);
    console.log(`交易发送者: ${sender}`);

    try {
      // 检查账户是否存在
      const accountInfo = await aptos.getAccountInfo({ accountAddress: sender });
      console.log('账户信息:', accountInfo);
    } catch (accountError) {
      if (accountError instanceof AptosApiError && accountError.data?.error_code === 'account_not_found') {
        console.log('账户不存在错误:', accountError);
        
        // 先使用水龙头获取测试币
        try {
          
          // 初始化账户
          const initResult = await initializeAccount(formattedAddress);
          if (!initResult.success) {
            return {
              success: false,
              error: '账户初始化失败',
              details: initResult.error
            };
          }
          
          return {
            success: true,
            message: '请在钱包中确认交易以激活账户',
            transaction: initResult.transaction,
            formattedAddress
          };
          
        } catch (faucetError) {
          console.error('水龙头请求失败:', faucetError);
          return {
            success: false,
            error: '获取测试币失败',
            details: '请确保水龙头服务正常运行'
          };
        }
      }
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

    return {
      success: true,
      message: '请在钱包中确认交易以完成初始化',
      transaction: rawTxn,
      profileId: walletAddress,
      formattedAddress
    };

  } catch (error: any) {
    console.error("区块链初始化错误:", error);
    
    // 如果是账户不存在错误，返回友好的错误信息
    if (error instanceof AptosApiError && error.data?.error_code === 'account_not_found') {
      console.log('账户不存在错误:', error);
      return {
        success: false,
        error: '您的钱包地址尚未在链上激活',
        details: '请先在 Aptos 链上进行一笔交易以激活您的账户'
      };
    }

    return {
      success: false,
      error: '区块链初始化失败',
      details: error.message || '未知错误'
    };
  }
};

/**
 * 查找或创建用户并处理登录
 */
export const findOrCreateUser = async (userData: UserLoginData) => {
  const { walletAddress, chainId } = userData;

  try {
    // 查找用户
    let user = await prisma.user.findUnique({
      where: {
        walletAddress,
      },
    });

    // 如果用户不存在，先初始化，再创建用户
    let isFirstLogin = true;
    if (!user) {
      const initResult = await initializeUserOnBlockchain(walletAddress);
      if (initResult.success) {
        // 插入用户
        user = await prisma.user.create({
          data: {
            walletAddress,
            chainId,
            isInitialized: true,
            profileId: initResult.profileId,
          },
        });
      } else {
        // 如果初始化失败，返回错误信息
        return {
          success: false,
          error: initResult.error,
          details: initResult.details,
          user: null,
          transaction: initResult.transaction,
          formattedAddress: initResult.formattedAddress
        };
      }
    }
    // 用户存在，查看其是否初始化
    else if (!user.isInitialized) {
      isFirstLogin = false;
      // 初始化用户
      const initResult = await initializeUserOnBlockchain(walletAddress); 
      if (initResult.success) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            isInitialized: true,
            profileId: initResult.profileId,
          },
        });
      } else {
        return {
          success: false,
          error: initResult.error,
          details: initResult.details,
          user: null,
          transaction: initResult.transaction,
          formattedAddress: initResult.formattedAddress
        };
      }
    } else {
      // 仅更新登录时间和链ID
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLogin: new Date(),
          chainId,
        },
      });
    }

    return {
      success: true,
      user,
      isFirstLogin,
    };
  } catch (error: any) {
    console.error("用户登录处理错误:", error);
    return {
      success: false,
      error: "用户登录处理失败",
      details: error.message,
      user: null,
    };
  }
}; 