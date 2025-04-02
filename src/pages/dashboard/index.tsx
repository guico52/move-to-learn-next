import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import DashboardHome from '../../components/DashboardHome';
import styles from '../../styles/Dashboard.module.css';

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected) {
      router.push('/login');
    }
  }, [isConnected, router]);

  return (
    <div className={styles.container}>
      <Head>
        <title>我的学习 - Move To Learn</title>
        <meta content="Move To Learn 学习中心" name="description" />
      </Head>

      <Navbar />
      <Sidebar />

      <main className={styles.main}>
        <DashboardHome />
      </main>
    </div>
  );
};

export default Dashboard; 