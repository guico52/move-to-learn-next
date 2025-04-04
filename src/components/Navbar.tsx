import { useAccount, useDisconnect } from 'wagmi';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import { 
  Account, 
  Aptos, 
  AptosConfig, 
  Network, 
  Ed25519PrivateKey, 
  InputViewFunctionData,
  AccountAddress,
  InputEntryFunctionData,
  TransactionBuilder
} from "@aptos-labs/ts-sdk";
import { aptosConfig } from '@/config';

const navLinks = [
  { href: '/courses', label: '课程' },
  { href: '/community', label: '社区' },
  { href: '/ecosystem', label: '生态系统' },
  { href: '/dashboard', label: '我的学习' },
];

const Navbar = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDisconnect = async () => {
    await disconnect();
    router.push('/');
  };

  const isDashboard = router.pathname.startsWith('/dashboard');

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
        <div className={styles.navLeft}>
          <Link href="/" className={styles.logo}>
            Move To Learn
          </Link>
          {isDashboard && (
            <Link href="/" className={styles.backHomeButton}>
              返回首页
            </Link>
          )}
        </div>
        <div className={styles.navCenter}>
          <Link href="/courses" className={`${styles.navLink} ${router.pathname === '/courses' ? styles.active : ''}`}>
            课程
          </Link>
          <span className={`${styles.navLink} ${styles.disabled}`}>
            社区
          </span>
          <span className={`${styles.navLink} ${styles.disabled}`}>
            生态系统
          </span>
          <Link href="/dashboard" className={`${styles.navLink} ${router.pathname === '/dashboard' ? styles.active : ''}`}>
            我的学习
          </Link>
        </div>
        <div className={styles.navRight}>
          {mounted && (
            <>
              <Link href="/login" className={styles.loginButton}>
                连接钱包
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

// 初始化 Aptos 客户端
const aptosClientConfig = new AptosConfig({ network: aptosConfig.network });
const aptos = new Aptos(aptosClientConfig);

// 创建账户辅助函数
export const createAccount = async (privateKeyHex?: string) => {
  if (privateKeyHex) {
    const privateKey = new Ed25519PrivateKey(privateKeyHex);
    return Account.fromPrivateKey({ privateKey });
  }
  return Account.generate();
};

// 初始化学生档案
export const initializeStudent = async (account: Account) => {
  try {
    const builder = new TransactionBuilder(aptos);
    const rawTxn = await builder.build({
      sender: AccountAddress.from(account.accountAddress),
      data: {
        function: `${aptosConfig.contract.address}::${aptosConfig.contract.moduleName}::initialize_student`,
        typeArguments: [],
        functionArguments: []
      }
    });

    const signedTxn = await builder.sign({ signer: account, transaction: rawTxn });
    const pendingTxn = await aptos.transaction.submit({ transaction: signedTxn });
    
    return pendingTxn;
  } catch (error) {
    console.error("初始化学生档案失败:", error);
    throw error;
  }
};

// 颁发证书
export const issueCertificate = async (
  adminAccount: Account,
  studentAddress: string,
  courseId: string,
  certificateHash: Uint8Array,
  credits: number
) => {
  try {
    const builder = new TransactionBuilder(aptos);
    const rawTxn = await builder.build({
      sender: AccountAddress.from(adminAccount.accountAddress),
      data: {
        function: `${aptosConfig.contract.address}::${aptosConfig.contract.moduleName}::issue_certificate`,
        typeArguments: [],
        functionArguments: [
          studentAddress,
          courseId,
          Array.from(certificateHash),
          credits,
        ]
      }
    });

    const signedTxn = await builder.sign({ signer: adminAccount, transaction: rawTxn });
    const pendingTxn = await aptos.transaction.submit({ transaction: signedTxn });
    
    return pendingTxn;
  } catch (error) {
    console.error("颁发证书失败:", error);
    throw error;
  }
};

// 查询学生证书
export const getCertificates = async (studentAddress: string) => {
  try {
    const payload: InputViewFunctionData = {
      function: `${aptosConfig.contract.address}::${aptosConfig.contract.moduleName}::get_certificates`,
      typeArguments: [],
      functionArguments: [studentAddress],
    };
    const resource = await aptos.view({ payload });
    return resource;
  } catch (error) {
    console.error("获取证书失败:", error);
    throw error;
  }
};

// 查询总学分
export const getTotalCredits = async (studentAddress: string) => {
  try {
    const payload: InputViewFunctionData = {
      function: `${aptosConfig.contract.address}::${aptosConfig.contract.moduleName}::get_total_credits`,
      typeArguments: [],
      functionArguments: [studentAddress],
    };
    const resource = await aptos.view({ payload });
    return resource;
  } catch (error) {
    console.error("获取总学分失败:", error);
    throw error;
  }
}; 