import { prisma } from './prisma';
import axios from 'axios';

export interface UserLoginData {
  walletAddress: string;
  chainId: number;
}

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

    // 如果用户不存在，创建新用户
    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress,
          chainId,
          isInitialized: false,
        },
      });
      
      // 这是首次登录，需要在区块链上初始化用户
      return {
        user,
        isFirstLogin: true,
      };
    } 
    
    // 更新最后登录时间
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLogin: new Date(),
        chainId, // 更新链ID，以防用户切换了网络
      },
    });

    return {
      user,
      isFirstLogin: false,
    };
  } catch (error) {
    console.error("用户登录处理错误:", error);
    throw new Error("用户登录处理失败");
  }
};

/**
 * 在区块链上初始化用户学习档案
 */
export const initializeUserOnBlockchain = async (walletAddress: string) => {
  try {
    // 调用API初始化用户
    const response = await axios.post('/api/initialize-user', {
      walletAddress,
    });

    // 如果初始化成功，更新数据库
    if (response.data.success) {
      await prisma.user.update({
        where: {
          walletAddress,
        },
        data: {
          isInitialized: true,
          profileId: response.data.profileId,
        },
      });

      return {
        success: true,
        profileId: response.data.profileId,
      };
    }

    return {
      success: false,
      error: response.data.error || '初始化失败',
    };
  } catch (error) {
    console.error("区块链初始化错误:", error);
    return {
      success: false,
      error: '区块链初始化失败',
    };
  }
}; 