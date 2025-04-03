import { useEffect, useState, useRef } from 'react';
import { useAccount, useChainId } from 'wagmi';
import axios from 'axios';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

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
  const [user, setUser] = useState<User | null>(() => {
    // 从localStorage初始化用户状态
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const loginAttemptedRef = useRef(false);
  const isAuthenticatingRef = useRef(false);
  
  // 更新用户状态时同步到localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }
  }, [user]);

  // 处理用户登录
  const handleLogin = async () => {
    if (!isConnected || !address || !chainId) return;

    // 避免重复请求
    if (loading || isAuthenticatingRef.current) return;

    isAuthenticatingRef.current = true;
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        walletAddress: address,
        chainId,
      });

      if (response.data.success) {
        setUser(response.data.user);
        loginAttemptedRef.current = true;

        // 检查是否有需要重定向的URL
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
          localStorage.removeItem('redirectAfterLogin');
          router.push(redirectUrl);
        }

        return response.data;
      } else {
        toast.error(response.data.error || '登录失败');
        resetAuthState();
        return null;
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || '登录失败');
      resetAuthState();
      return null;
    } finally {
      setLoading(false);
      isAuthenticatingRef.current = false;
    }
  };

  // 重置所有认证状态
  const resetAuthState = () => {
    setUser(null);
    loginAttemptedRef.current = false;
    isAuthenticatingRef.current = false;
    localStorage.removeItem('user');
  };

  // 检查钱包地址是否匹配
  useEffect(() => {
    if (user && address && user.walletAddress !== address) {
      // 如果钱包地址不匹配，重置所有状态
      resetAuthState();
    }
  }, [user, address]);

  // 当用户连接钱包时自动登录
  useEffect(() => {
    const checkAndLogin = async () => {
      // 只在连接钱包且没有用户信息时尝试登录
      if (isConnected && address && chainId && !user && !isAuthenticatingRef.current) {
        await handleLogin();
      }
    };

    checkAndLogin();
  }, [isConnected, address, chainId, user]);

  // 当用户断开连接时重置状态
  useEffect(() => {
    if (!isConnected) {
      resetAuthState();
    }
  }, [isConnected]);

  return {
    user,
    loading,
    isLoggedIn: !!user,
    handleLogin,
  };
}; 