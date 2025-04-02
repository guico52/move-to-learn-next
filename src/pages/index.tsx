import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Move To Learn - Web3 教育公益平台</title>
        <meta
          content="基于 Web3 和 Move 的免费教育公益平台"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Navbar />

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>
            让知识触手可及
            <br />
            让教育更加公平
          </h1>
          <p className={styles.subtitle}>
            Move To Learn 是一个基于区块链技术的开源教育公益平台，
            致力于为所有人提供优质的免费教育资源
          </p>
          <Link href="/login" className={styles.ctaButton}>
            立即加入学习
          </Link>
        </section>

        <section className={styles.features}>
          <h2 className={styles.sectionTitle}>为什么选择 Move To Learn？</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <h3>💡 开源免费</h3>
              <p>所有课程资源完全开源免费，人人都能平等获取优质教育</p>
            </div>
            <div className={styles.featureCard}>
              <h3>🔗 区块链赋能</h3>
              <p>利用 Move 智能合约，确保学习证明和认证的可信度</p>
            </div>
            <div className={styles.featureCard}>
              <h3>🤝 社区共建</h3>
              <p>教育者与学习者共同参与治理，打造可持续发展的生态系统</p>
            </div>
            <div className={styles.featureCard}>
              <h3>🎯 激励机制</h3>
              <p>创新的 Web3 激励模式，鼓励优质教育内容的创作与分享</p>
            </div>
          </div>
        </section>

        <section className={styles.mission}>
          <h2 className={styles.sectionTitle}>我们的使命</h2>
          <div className={styles.missionContent}>
            <p>
              Move To Learn 致力于消除教育资源获取的壁垒，让每个人都能享有平等的学习机会。
              我们相信，教育是改变命运的力量，通过区块链技术的创新应用，
              我们能够建立一个更加开放、透明、高效的教育生态系统。
            </p>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>100%</span>
                <span className={styles.statLabel}>免费课程</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>Web3</span>
                <span className={styles.statLabel}>技术支持</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>DAO</span>
                <span className={styles.statLabel}>社区治理</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>Move To Learn</h4>
            <p>用区块链技术助力教育公平</p>
          </div>
          <div className={styles.footerSection}>
            <h4>快速链接</h4>
            <Link href="/login">开始学习</Link>
            <Link href="#">关于我们</Link>
            <Link href="#">帮助中心</Link>
          </div>
          <div className={styles.footerSection}>
            <h4>社区</h4>
            <Link href="#">Discord</Link>
            <Link href="#">Twitter</Link>
            <Link href="#">GitHub</Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2024 Move To Learn. 保留所有权利。</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
