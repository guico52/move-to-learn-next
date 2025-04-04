import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import styles from '../../styles/Dashboard.module.css';
import { useAuth } from '../../hooks/useAuth';
import Link from 'next/link';

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { user, loading, isLoggedIn } = useAuth();


  // 在加载状态时显示加载界面
  if (loading) {
    return (
      <div className={styles.container}>
        <Head>
          <title>加载中 - Move To Learn</title>
        </Head>
        <div className={styles.loading}>
          <span>加载中...</span>
        </div>
      </div>
    );
  }

  // 未登录时不渲染内容
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>我的学习 - Move To Learn</title>
        <meta content="Move To Learn 学习中心" name="description" />
      </Head>

      <Navbar />
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.content}>
          <section className={styles.overview}>
            <div className={styles.titleContainer}>
              <h1 className={styles.title}>我的学习中心</h1>
            </div>
            <div className={styles.stats}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>3</span>
                <span className={styles.statLabel}>进行中的课程</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>12</span>
                <span className={styles.statLabel}>已获得证书</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>80%</span>
                <span className={styles.statLabel}>平均完成率</span>
              </div>
            </div>
          </section>

          <section className={styles.courses}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>进行中的课程</h2>
              <button className={styles.viewAllButton}>查看全部</button>
            </div>
            <div className={styles.courseGrid}>
              <div className={styles.courseCard}>
                <div className={styles.courseProgress}>
                  <div 
                    className={styles.progressBar} 
                    style={{ width: '60%' }}
                  ></div>
                </div>
                <h3 className={styles.courseTitle}>Move 智能合约开发入门</h3>
                <p className={styles.courseInfo}>已完成 6/10 课时</p>
                <button className={styles.continueButton}>继续学习</button>
              </div>
              <div className={styles.courseCard}>
                <div className={styles.courseProgress}>
                  <div 
                    className={styles.progressBar} 
                    style={{ width: '30%' }}
                  ></div>
                </div>
                <h3 className={styles.courseTitle}>Web3 DApp 实战开发</h3>
                <p className={styles.courseInfo}>已完成 3/10 课时</p>
                <button className={styles.continueButton}>继续学习</button>
              </div>
              <div className={styles.courseCard}>
                <div className={styles.courseProgress}>
                  <div 
                    className={styles.progressBar} 
                    style={{ width: '80%' }}
                  ></div>
                </div>
                <h3 className={styles.courseTitle}>区块链基础理论</h3>
                <p className={styles.courseInfo}>已完成 8/10 课时</p>
                <button className={styles.continueButton}>继续学习</button>
              </div>
            </div>
          </section>

          <section className={styles.certificates}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>最近获得的证书</h2>
              <button className={styles.viewAllButton}>查看全部</button>
            </div>
            <div className={styles.certificateGrid}>
              <div className={styles.certificateCard}>
                <div className={styles.certificateIcon}>🏆</div>
                <div className={styles.certificateInfo}>
                  <h3>Move 语言基础</h3>
                  <p>获得时间：2024-03-28</p>
                </div>
              </div>
              <div className={styles.certificateCard}>
                <div className={styles.certificateIcon}>🏆</div>
                <div className={styles.certificateInfo}>
                  <h3>区块链原理与应用</h3>
                  <p>获得时间：2024-03-15</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 