import { useEffect, useState, useRef } from 'react';
import { useAccount, useChainId } from 'wagmi';
import axios, { AxiosError } from 'axios';
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
  const [isInitializing, setIsInitializing] = useState(false);
  const [initializeAttempts, setInitializeAttempts] = useState(0);
  const [accountNotActivated, setAccountNotActivated] = useState(false);
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
        // 如果是首次登录并且未初始化，先尝试初始化区块链资料
        if (response.data.isFirstLogin && !response.data.user.isInitialized && !isInitializing && initializeAttempts < 3) {
          const initResult = await initializeUser(address);
          // 如果初始化失败，直接结束流程
          if (!initResult) {
            return null;
          }
        }

        // 只有在不需要初始化或初始化成功后才设置用户状态
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

  // 初始化用户在区块链上的学习档案
  const initializeUser = async (walletAddress: string) => {
    // 如果已经在初始化中或尝试次数过多，则不再尝试
    if (isInitializing || initializeAttempts >= 3) return false;
    
    setIsInitializing(true);
    setInitializeAttempts(prev => prev + 1);
    
    try {
      const response = await axios.post('/api/initialize-user', {
        walletAddress,
      });

      if (response.data.success) {
        toast.success('学习档案初始化成功！');
        setIsInitializing(false);
        return true;
      } else {
        // 处理业务逻辑错误
        toast.error(response.data.error);
        if (response.data.details) {
          toast(response.data.details, {
            duration: 6000,
            icon: '📝',
          });
        }
        resetAuthState();
        return false;
      }
    } catch (err) {
      console.error('初始化用户错误:', err);
      
      // 处理不同类型的错误
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<any>;
        if (axiosError.response?.status === 400) {
          // 检查是否是余额不足的错误
          if (axiosError.response.data.code === 'INSUFFICIENT_BALANCE') {
            try {
              // 尝试发放测试币
              const faucetResponse = await axios.post('/api/faucet', {
                walletAddress,
              });
              
              if (faucetResponse.data.success) {
                toast.success('已为您发放测试币，请稍后重试初始化');
                // 等待几秒钟让交易确认
                await new Promise(resolve => setTimeout(resolve, 5000));
                // 重新尝试初始化
                return await initializeUser(walletAddress);
              } else {
                toast.error('发放测试币失败，请联系管理员');
              }
            } catch (faucetError) {
              console.error('发放测试币错误:', faucetError);
              toast.error('发放测试币时发生错误');
            }
          } else {
            // 处理其他400错误
            toast.error(axiosError.response.data.error);
            if (axiosError.response.data.details) {
              toast(axiosError.response.data.details, {
                duration: 6000,
                icon: '📝',
              });
            }
          }
        } else {
          toast.error('初始化失败，请稍后重试');
        }
      } else {
        toast.error('初始化过程中发生错误');
      }
      resetAuthState();
      return false;
    }
  };

  // 重置所有认证状态
  const resetAuthState = () => {
    setUser(null);
    setAccountNotActivated(false);
    setInitializeAttempts(0);
    setIsInitializing(false);
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
    isInitializing,
    isLoggedIn: !!user,
    accountNotActivated,
    handleLogin,
    initializeUser,
  };
}; 