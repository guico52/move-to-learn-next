import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import styles from '../../styles/Dashboard.module.css';

const Playground: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>沙盘演练 - Move To Learn</title>
        <meta content="Move To Learn 代码演练场" name="description" />
      </Head>

      <Navbar />
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>Move 代码演练场</h1>
          {/* 代码演练功能将在这里实现 */}
        </div>
      </main>
    </div>
  );
};

export default Playground; 