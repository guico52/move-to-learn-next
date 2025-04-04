import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MovePlayground from '@/components/MovePlayground';
import styles from '@/styles/Dashboard.module.css';

const PlaygroundPage: NextPage = () => {
  const router = useRouter();
  const { isConnected } = useAccount();

  console.log('Rendering PlaygroundPage');
  return (
    <div className={styles.container}>
      <Head>
        <title>代码操场 - Move To Learn</title>
        <meta content="Move To Learn 代码操场" name="description" />
      </Head>

      <Navbar />
      <Sidebar />

      <main className={styles.main}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '2rem'
          }}>
            Move 代码操场
          </h1>
          <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
            <MovePlayground />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlaygroundPage; 