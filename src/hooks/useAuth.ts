import { useEffect, useState, useRef } from 'react';
import { useAccount } from 'wagmi';
import axios from 'axios';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export interface User {
  id: string;
  walletAddress: string;
  isInitialized: boolean;
  profileId?: string | null;
}

interface StoredUserData {
  user: User | null;
  isFirstLogin: boolean;
}

export const useAuth = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  
  // 从localStorage初始化状态
  const [{ user, isFirstLogin }, setState] = useState<StoredUserData>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('userData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // 只验证钱包地址是否匹配
        if (parsedData.user && (!address || parsedData.user.walletAddress === address)) {
          return parsedData;
        }
        // 如果钱包地址不匹配，清除存储的数据
        localStorage.removeItem('userData');
      }
    }
    return { user: null, isFirstLogin: false };
  });

  const [loading, setLoading] = useState(false);
  const loginAttemptedRef = useRef(false);
  const isAuthenticatingRef = useRef(false);
  
  // 更新状态时同步到localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('userData', JSON.stringify({ user, isFirstLogin }));
      } else {
        localStorage.removeItem('userData');
      }
    }
  }, [user, isFirstLogin]);

  // 处理用户登录
  const handleLogin = async () => {
    if (!isConnected || !address) return;

    // 避免重复请求
    if (loading || isAuthenticatingRef.current) return;

    isAuthenticatingRef.current = true;
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        walletAddress: address,
      });

      if (response.data.success) {
        setState({
          user: response.data.user,
          isFirstLogin: response.data.isFirstLogin || false
        });
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
    setState({ user: null, isFirstLogin: false });
    loginAttemptedRef.current = false;
    isAuthenticatingRef.current = false;
    localStorage.removeItem('userData');
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
      if (isConnected && address && !user && !isAuthenticatingRef.current) {
        await handleLogin();
      }
    };

    checkAndLogin();
  }, [isConnected, address, user]);

  // 当用户断开连接时重置状态
  useEffect(() => {
    if (!isConnected) {
      resetAuthState();
    }
  }, [isConnected]);

  return {
    user,
    loading,
    isLoggedIn: !!user && (!address || user.walletAddress === address),
    isFirstLogin,
    handleLogin,
    resetAuthState,
  };
}; 