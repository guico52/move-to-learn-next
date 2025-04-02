import type { NextPage } from 'next';
import Head from 'next/head';
import WalletConnect from '../components/WalletConnect';
import styles from '../styles/Login.module.css';

const Login: NextPage = () => {
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

          <div className={styles.connectWrapper}>
            <WalletConnect />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login; 