import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import styles from '../../styles/Dashboard.module.css';

const Courses: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>我的课程 - Move To Learn</title>
        <meta content="Move To Learn 课程中心" name="description" />
      </Head>

      <Navbar />
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>我的课程</h1>
          {/* 课程内容将在这里实现 */}
        </div>
      </main>
    </div>
  );
};

export default Courses; 