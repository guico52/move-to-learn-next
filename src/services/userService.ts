import { prisma } from '@/utils/prisma';
import type { User } from '@prisma/client';

const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'testnet';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
const NEXT_FAUCET_URL = process.env.NEXT_FAUCET_URL as string;

export interface UserLoginData {
  walletAddress: string;
}

export interface UserData {
  walletAddress: string;
  profileId?: string;
}

type CreateUserInput = {
  walletAddress: string;
  profileId: string | null;
  firstLogin: Date;
  lastLogin: Date;
  isInitialized: boolean;
};    

type UpdateUserInput = {
  lastLogin: Date;
  name?: string;
  profileId?: string;
};

/**
 * 查找或创建用户
 */
export const findOrCreateUser = async (userData: UserData): Promise<{
  success: boolean;
  user: User | null;
  error?: string;
  details?: string;
  isFirstLogin?: boolean;
}> => {
  const { walletAddress, profileId } = userData;

  try {
    // 查找用户
    let user = await prisma.user.findUnique({
      where: {
        walletAddress,
      },
    });

    // 如果用户不存在，创建用户
    if (!user) {
      const createData: CreateUserInput = {
        walletAddress,
        profileId: profileId || null,
        firstLogin: new Date(),
        lastLogin: new Date(),
        isInitialized: false,
      };
      user = await prisma.user.create({
        data: {
          ...createData,
          chainId: 1, // 添加默认的chainId
        },
      });

      return {
        success: true,
        user,
        isFirstLogin: true,
      };
    } else {
      // 更新登录时间和可选字段
      const updateData: UpdateUserInput = {
        lastLogin: new Date(),
        ...(profileId ? { profileId } : {}),
      };

      user = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });

      return {
        success: true,
        user,
        isFirstLogin: false,
      };
    }
  } catch (error: any) {
    console.error("用户处理错误:", error);
    return {
      success: false,
      error: "用户处理失败",
      details: error.message,
      user: null,
    };
  }
}; 