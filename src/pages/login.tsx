import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import WalletConnect from '../components/WalletConnect';
import styles from '../styles/Login.module.css';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/utils/executor';

const Login: NextPage = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { isLoggedIn } = useAuthStore();


  useEffect(() => {
    if (isConnected) {
      if (isLoggedIn) {
        // 获取重定向地址或默认跳转到 dashboard
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get('redirect') || '/dashboard';
        router.push(redirectPath);
      } else {
        // 如果没有登录，获取钱包地址 
        if (address) {
          api.authController.login({
            body: {
              walletAddress: address,
            },
          }).then((res: any) => {
            if (res.data?.success) {
              const data = res.data?.data;
              const walletAddress = address;
              const tokenName = data.tokenName;
              const tokenValue = data.tokenValue;
              
              // 设置 cookie，添加更多安全选项
              const cookieValue = encodeURIComponent(tokenValue);
              console.log('登录成功，设置cookie:', tokenValue);

              useAuthStore.setState({
                walletAddress,
                tokenName,
                tokenValue,
                isLoggedIn: true,
              });

              // 获取重定向地址或默认跳转到 dashboard
              const urlParams = new URLSearchParams(window.location.search);
              const redirectPath = urlParams.get('redirect') || '/dashboard';
              router.push(redirectPath);
            }
          }).catch(error => {
            console.error('登录失败:', error);
          });
        }
      }
    }
  }, [isConnected, router, address, isLoggedIn]);

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


          {/* {loginStatus && (
            <div className={styles.statusMessage}>
              {loginStatus}
            </div>
          )} */}

          <div className={styles.connectWrapper}>
            <WalletConnect />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login; 