import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { useEffect, useState, useRef } from 'react';
import WalletConnect from '../components/WalletConnect';
import styles from '../styles/Login.module.css';
import { useAuth } from '../hooks/useAuth';

const Login: NextPage = () => {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { user, loading, error, isInitializing, handleLogin } = useAuth();
  const [loginStatus, setLoginStatus] = useState<string | null>(null);
  const loginAttemptedRef = useRef(false);

  useEffect(() => {
    // 只有在连接钱包后且未尝试过登录时，才执行登录操作
    if (isConnected && !loginAttemptedRef.current && !loading) {
      const doLogin = async () => {
        setLoginStatus('正在验证用户信息...');
        loginAttemptedRef.current = true;
        await handleLogin();
      };
      
      doLogin();
    } else if (!isConnected) {
      // 重置登录状态
      loginAttemptedRef.current = false;
    }
  }, [isConnected, handleLogin, loading]);

  useEffect(() => {
    // 登录成功后跳转到 dashboard
    if (user && !isInitializing) {
      router.push('/dashboard');
    }
  }, [user, isInitializing, router]);

  // 显示错误信息
  useEffect(() => {
    if (error) {
      setLoginStatus(`登录失败: ${error}`);
    } else if (isInitializing) {
      setLoginStatus('正在初始化学习档案...');
    } else if (loading) {
      setLoginStatus('正在登录...');
    } else if (!isConnected) {
      setLoginStatus(null);
    }
  }, [error, loading, isInitializing, isConnected]);

  return (
    <div className={styles.container}>
      <Head>
        <title>登录 - Move To Learn</title>
        <meta content="连接钱包开始学习" name="description" />
      </Head>

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>欢迎加入 Move To Learn</h1>
          <p className={styles.subtitle}>连接钱包，开启您的学习之旅</p>
          
          <div className={styles.benefits}>
            <div className={styles.benefitItem}>
              <span className={styles.icon}>🎓</span>
              <span>免费优质课程</span>
            </div>
            <div className={styles.benefitItem}>
              <span className={styles.icon}>🏆</span>
              <span>学习证明 NFT</span>
            </div>
            <div className={styles.benefitItem}>
              <span className={styles.icon}>🌟</span>
              <span>社区治理权限</span>
            </div>
          </div>

          {loginStatus && (
            <div className={styles.statusMessage}>
              {loginStatus}
            </div>
          )}

          <div className={styles.connectWrapper}>
            <WalletConnect />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login; 