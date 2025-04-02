import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import styles from '../../styles/Dashboard.module.css';

const AIAssistant: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>AI助教 - Move To Learn</title>
        <meta content="Move To Learn AI助教" name="description" />
      </Head>

      <Navbar />
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>AI助教</h1>
          {/* AI助教功能将在这里实现 */}
        </div>
      </main>
    </div>
  );
};

export default AIAssistant; 