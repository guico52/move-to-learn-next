import { useEffect, useState, useRef } from 'react';
import { useAccount, useChainId } from 'wagmi';
import axios from 'axios';
import { useRouter } from 'next/router';

export interface User {
  id: string;
  walletAddress: string;
  isInitialized: boolean;
  profileId?: string | null;
}

export const useAuth = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initializeAttempts, setInitializeAttempts] = useState(0);
  const loginAttemptedRef = useRef(false);
  
  // 处理用户登录
  const handleLogin = async () => {
    if (!isConnected || !address || !chainId) return;

    // 避免重复请求
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/auth/login', {
        walletAddress: address,
        chainId,
      });

      if (response.data.success) {
        setUser(response.data.user);
        loginAttemptedRef.current = true;

        // 如果是首次登录并且未初始化，自动初始化区块链资料
        // 只有当用户未初始化且未处于初始化过程中时才进行初始化
        if (response.data.isFirstLogin && !response.data.user.isInitialized && !isInitializing && initializeAttempts < 3) {
          initializeUser(address);
        }

        return response.data;
      } else {
        setError(response.data.error || '登录失败');
        loginAttemptedRef.current = true;
        return null;
      }
    } catch (err: any) {
      setError(err.response?.data?.error || '登录失败');
      loginAttemptedRef.current = true;
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 初始化用户在区块链上的学习档案
  const initializeUser = async (walletAddress: string) => {
    // 如果已经在初始化中或尝试次数过多，则不再尝试
    if (isInitializing || initializeAttempts >= 3) return;
    
    setIsInitializing(true);
    setInitializeAttempts(prev => prev + 1);
    
    try {
      const response = await axios.post('/api/initialize-user', {
        walletAddress,
      });

      if (response.data.success) {
        // 更新本地用户信息
        setUser((prev) => 
          prev ? {
            ...prev,
            isInitialized: true,
            profileId: response.data.profileId,
          } : null
        );
      } else {
        console.error('初始化用户失败:', response.data.error);
      }
    } catch (err) {
      console.error('初始化用户错误:', err);
    } finally {
      setIsInitializing(false);
    }
  };

  // 当用户连接钱包时自动登录 - 修改逻辑，避免重复登录
  useEffect(() => {
    // 只有当用户已连接且未尝试过登录时才自动登录
    if (isConnected && address && chainId && !user && !loginAttemptedRef.current && !loading) {
      handleLogin();
    } else if (!isConnected) {
      // 用户断开连接时，重置状态
      setUser(null);
      loginAttemptedRef.current = false;
    }
  }, [isConnected, address, chainId, user, loading]);

  return {
    user,
    loading,
    error,
    isInitializing,
    isLoggedIn: !!user,
    handleLogin,
    initializeUser,
  };
}; 