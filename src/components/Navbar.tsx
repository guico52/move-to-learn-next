import { useAccount, useDisconnect } from 'wagmi';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

const Navbar = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDisconnect = async () => {
    await disconnect();
    router.push('/');
  };

  // 在客户端渲染之前返回一个占位导航栏
  if (!mounted) {
    return (
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            Move To Learn
          </Link>
          <div className={styles.navRight}>
            <div className={styles.placeholder}></div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          Move To Learn
        </Link>
        <div className={styles.navRight}>
          {isConnected ? (
            <div className={styles.userInfo}>
              <Link href="/dashboard" className={styles.address}>
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </Link>
              <button onClick={handleDisconnect} className={styles.logoutButton}>
                退出登录
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.loginButton}>
              登录
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar; 