import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import WalletConnect from '../components/WalletConnect';
import styles from '../styles/Login.module.css';
import { useAuth } from '../hooks/useAuth';

const Login: NextPage = () => {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { user, loading, error, isInitializing } = useAuth();
  const [loginStatus, setLoginStatus] = useState<string | null>(null);

  // 监听登录状态变化
  useEffect(() => {
    if (error) {
      setLoginStatus(`登录失败: ${error}`);
    } else if (isInitializing) {
      setLoginStatus('正在初始化学习档案...');
    } else if (loading) {
      setLoginStatus('正在登录...');
    } else if (!isConnected) {
      setLoginStatus(null);
    } else if (isConnected && !loading && !error) {
      setLoginStatus('正在验证用户信息...');
    }
  }, [error, loading, isInitializing, isConnected]);

  // 登录成功后的重定向
  useEffect(() => {
    if (user && !isInitializing) {
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, isInitializing, router]);

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