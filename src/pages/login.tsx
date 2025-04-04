import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import WalletConnect from '../components/WalletConnect';
import styles from '../styles/Login.module.css';
import { useAuth } from '../hooks/useAuth';
import Image from 'next/image';

const Login: NextPage = () => {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { user, loading, isLoggedIn } = useAuth();
  const [loginStatus, setLoginStatus] = useState<string | null>(null);

  // 监听登录状态变化
  useEffect(() => {
    if (isLoggedIn) {
      setLoginStatus('登录成功');
    } else if (loading) {
      setLoginStatus('正在登录...');
    } else if (!isConnected) {
      setLoginStatus(null);
    } else if (isConnected && !loading) {
      setLoginStatus('正在验证用户信息...');
    }
  }, [isLoggedIn, loading, isConnected]);

  // 登录成功后的重定向
  useEffect(() => {
    if (user && !loading) {
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, isLoggedIn, router]);

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
          <div className={styles.benefitsContainer}>
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
            <div className={styles.logoContainer}>
              <Image
                src="/assets/logo_color.png"
                alt="Move To Learn Logo"
                width={400}
                height={133}
                priority
                className={styles.colorLogo}
              />
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