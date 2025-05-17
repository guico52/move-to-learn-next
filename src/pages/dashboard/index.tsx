import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import styles from '../../styles/Dashboard.module.css';
import { 
  WalletOutlined, 
  TrophyOutlined,
  FireOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const Dashboard: NextPage = () => {
  const router = useRouter();

  const stats = [
    { 
      label: 'MTL 代币', 
      value: '738',
      icon: <WalletOutlined className={styles.statIcon} />,
      color: '#1890ff'
    },
    { 
      label: '本月 MTL 奖励', 
      value: '142',
      icon: <TrophyOutlined className={styles.statIcon} />,
      color: '#52c41a'
    },
    { 
      label: '连续学习天数', 
      value: '14',
      icon: <FireOutlined className={styles.statIcon} />,
      color: '#fa8c16'
    },
    { 
      label: '已学习课时', 
      value: '127',
      icon: <ClockCircleOutlined className={styles.statIcon} />,
      color: '#722ed1'
    },
  ];

  const tasks = [
    { name: '完成今日课程单元 (1/1)', reward: '+15 MTL', completed: true },
    { name: '完成练习题题 (5/5)', reward: '+10 MTL', completed: true },
    { name: '分享学习笔记 (0/1)', reward: '+5 MTL', completed: false },
  ];

  const badges = [
    { title: '初学者', icon: '🚀' },
    { title: '连续7天', icon: '⚡' },
    { title: 'Move达人', icon: '🏆' },
    { title: '代码贡献者', icon: '💻' },
    { title: 'NFT创作者', icon: '🔒' },
    { title: '安全专家', icon: '🔒' },
  ];


  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  return (
    <div className={styles.container}>
      <Head>
        <title>我的信息 - Move To Learn</title>
        <meta content="Move To Learn 我的信息" name="description" />
      </Head>

      <Navbar />
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.pageTitle}>我的信息</h1>
          
          <div className={styles.statsContainer}>
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={styles.statCard}
                style={{ borderTop: `3px solid ${stat.color}` }}
              >
                <div className={styles.statIconWrapper} style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div className={styles.statValue} style={{ color: stat.color }}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div className={styles.rewardsSection}>
            <div className={styles.dailyTasks}>
              <h2 className={styles.sectionTitle}>
                <TrophyOutlined /> 每日任务
              </h2>
              <div className={styles.taskProgress}>
                <div className={styles.taskProgressBar}>
                  <div 
                    className={styles.taskProgressFill} 
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className={styles.taskProgressText}>
                  {completedTasks}/{totalTasks} 已完成
                </div>
              </div>
              <div className={styles.taskList}>
                {tasks.map((task, index) => (
                  <div key={index} className={styles.taskItem}>
                    <div className={styles.taskLeft}>
                      <div className={`${styles.taskStatus} ${task.completed ? styles.completed : ''}`}>
                        {task.completed && <CheckCircleOutlined />}
                      </div>
                      <span className={styles.taskName}>{task.name}</span>
                    </div>
                    <span className={styles.taskReward}>{task.reward}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.achievementBadges}>
              <h2 className={styles.sectionTitle}>
                <TrophyOutlined /> 成就徽章
              </h2>
              <div className={styles.badgeGrid}>
                {badges.map((badge, index) => (
                  <div key={index} className={styles.badgeItem}>
                    <div className={styles.badgeIcon}>{badge.icon}</div>
                    <div className={styles.badgeTitle}>{badge.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 