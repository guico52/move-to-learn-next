import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/Dashboard.module.css';

// 定义课程类型接口
interface Chapter {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  image: string | null;
  type: 'AI' | 'WEB3';
  chapters: Chapter[];
}

const Courses: NextPage = () => {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [aiCourses, setAiCourses] = useState<Course[]>([]);
  const [web3Courses, setWeb3Courses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'ai' | 'web3'>('all');

  // 检查用户登录状态
  useEffect(() => {
    if (!isLoggedIn && !user) {
      // 保存当前URL用于登录后重定向
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      router.push('/login');
      return;
    }

    // 获取课程数据
    if (user) {
      fetchCourses();
    }
  }, [isLoggedIn, user, router]);

  // 获取课程数据
  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // 获取所有课程
      const response = await axios.get('/api/courses');
      
      if (response.data.success) {
        const allCourses = response.data.courses;
        setCourses(allCourses);
        
        // 筛选AI和Web3课程
        setAiCourses(allCourses.filter((course: Course) => course.type === 'AI'));
        setWeb3Courses(allCourses.filter((course: Course) => course.type === 'WEB3'));
      }
    } catch (err) {
      setError('加载课程失败，请稍后重试');
      console.error('获取课程失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 筛选当前显示的课程
  const displayedCourses = activeTab === 'all' 
    ? courses 
    : activeTab === 'ai' 
      ? aiCourses 
      : web3Courses;

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
          
          {/* 课程类型选择标签 */}
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('all')}
            >
              全部课程
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'ai' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('ai')}
            >
              AI课程
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'web3' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('web3')}
            >
              Web3课程
            </button>
          </div>
          
          {loading ? (
            <div className={styles.loading}>加载中...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <div className={styles.courseGrid}>
              {displayedCourses.length > 0 ? (
                displayedCourses.map((course) => (
                  <Link href={`/courses/${course.id}`} key={course.id} className={styles.courseCard}>
                    <div className={styles.courseImage}>
                      {course.image ? (
                        <img src={course.image} alt={course.title} />
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          {course.type === 'AI' ? '🤖' : '🔗'}
                        </div>
                      )}
                      <span className={styles.courseType}>{course.type}</span>
                    </div>
                    <div className={styles.courseInfo}>
                      <h3>{course.title}</h3>
                      <p>{course.description}</p>
                      <div className={styles.chapterCount}>
                        {course.chapters.length} 章节
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className={styles.emptyCourses}>
                  当前没有可用的{activeTab === 'all' ? '' : activeTab === 'ai' ? 'AI' : 'Web3'}课程
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Courses; 