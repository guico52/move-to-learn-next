import { useEffect, useState, useRef } from 'react';
import { useAccount } from 'wagmi';
import axios from 'axios';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { api } from '../utils/executor';
import { setTokenName, setTokenValue, setWalletAddress } from '@/utils/storeUtil';

export interface User {
  id: string;
  walletAddress: string;
  isInitialized: boolean;
  profileId?: string | null;
}

export interface UserStore {
  walletAddress: string;
  tokenName: string;
  tokenValue: string;
}

export const  = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  
  // 从localStorage初始化状态
  const [{ walletAddress, tokenName, tokenValue }, setState] = useState<UserStore>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('userData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // 只验证钱包地址是否匹配
        if (parsedData.walletAddress && (!address || parsedData.walletAddress === address)) {
          return parsedData;
        }
        // 如果钱包地址不匹配，清除存储的数据
        localStorage.removeItem('userData');
      }
    }
    return { walletAddress: '', tokenName: '', tokenValue: '' };
  });

  const [loading, setLoading] = useState(false);
  
  // 更新状态时同步到localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (walletAddress) {
        setTokenName(tokenName);
        setTokenValue(tokenValue);
        setWalletAddress(walletAddress);
      } else {
        clearAll();
      }
    }
  }, [walletAddress, tokenName, tokenValue]);

  // 处理用户登录
  const handleLogin = async () => {
    if (!isConnected || !address) return;
    setLoading(true);

    try {
      const response = await api.authController.login({
        body: {
          walletAddress: address,
        },
      });
      console.log("userLogin", response)
      if (response.data.success) {
        setState({
          walletAddress: address,
          tokenName: response.data.data.tokenName,
          tokenValue: response.data.data.tokenValue
        });
        console.log("userLogin", response)
        // 跳转页面
        router.push('/');
        return response.data;
      } else {
        toast.error(response.data.message || '登录失败');
        resetAuthState();
        return null;
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || '登录失败');
      resetAuthState();
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 重置所有认证状态
  const resetAuthState = () => {
    setState({ walletAddress: '', tokenName: '', tokenValue: '' });
    localStorage.removeItem('userData');
  };

  // 检查钱包地址是否匹配
  useEffect(() => {
    if (walletAddress && address && walletAddress !== address) {
      // 如果钱包地址不匹配，重置所有状态
      resetAuthState();
    }
  }, [walletAddress, address]);

  // 当用户连接钱包时自动登录
  useEffect(() => {
    const checkAndLogin = async () => {
      // 只在连接钱包且没有用户信息时尝试登录
      if (isConnected && address && !walletAddress) {
        await handleLogin();
      }
    };

    checkAndLogin();
  }, [isConnected, address, walletAddress]);

  // 当用户断开连接时重置状态
  useEffect(() => {
    if (!isConnected) {
      resetAuthState();
    }
  }, [isConnected]);

  return {
    walletAddress,
    tokenName,
    tokenValue,
    loading,
    isLoggedIn: !!walletAddress && (!address || walletAddress === address),
    handleLogin,
    resetAuthState,
  };
}; 