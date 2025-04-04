import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import DashboardTitle from '../../components/DashboardTitle';
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
          <DashboardTitle title="AI助教" />
          {/* AI助教功能将在这里实现 */}
        </div>
      </main>
    </div>
  );
};

export default AIAssistant; 