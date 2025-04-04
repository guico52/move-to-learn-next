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
          <Link href="/courses" className={styles.ctaButton}>
            立即开始学习
          </Link>
        </section>

        <section className={styles.features}>
          <h2 className={styles.sectionTitle}>为什么选择 Move To Learn</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <h3>系统化课程</h3>
              <p>从入门到进阶的完整学习路径，帮助您循序渐进地掌握区块链开发技能</p>
            </div>
            <div className={styles.featureCard}>
              <h3>实践导向</h3>
              <p>大量实战项目和练习，让您在动手实践中巩固所学知识</p>
            </div>
            <div className={styles.featureCard}>
              <h3>社区互动</h3>
              <p>活跃的开发者社区，与同行交流学习，共同成长</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
