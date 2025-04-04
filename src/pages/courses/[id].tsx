import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/Course.module.css';

interface Chapter {
  id: string;
  title: string;
  description: string;
  order: number;
  content: string | null;
}

interface Course {
  id: string;
  title: string;
  description: string;
  image: string | null;
  type: 'AI' | 'WEB3';
  chapters: Chapter[];
}

interface Progress {
  totalChapters: number;
  completedCount: number;
  progressPercentage: number;
  nextChapter: Chapter | null;
  completedChapterIds: string[];
}

const CourseDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, isLoggedIn } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取课程详情和学习进度
  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      if (!id || !user) return;

      try {
        setLoading(true);
        
        // 获取课程详情
        const courseResponse = await axios.get(`/api/courses/${id}`);
        
        if (courseResponse.data.success) {
          setCourse(courseResponse.data.course);
          
          // 获取学习进度
          const progressResponse = await axios.get(`/api/progress/${user.id}/${id}`);
          
          if (progressResponse.data.success) {
            setProgress(progressResponse.data.progress);
          }
        }
      } catch (err) {
        setError('加载课程失败，请稍后重试');
        console.error('获取课程详情失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndProgress();
  }, [id, user]);

  // 判断章节是否可访问
  const isChapterAccessible = (chapterOrder: number) => {
    if (!progress) return chapterOrder === 1; // 如果没有进度数据，只允许访问第一章
    
    // 第一章总是可访问的
    if (chapterOrder === 1) return true;
    
    // 如果前一章节已完成，则当前章节可访问
    const previousChapter = course?.chapters.find(ch => ch.order === chapterOrder - 1);
    return previousChapter ? progress.completedChapterIds.includes(previousChapter.id) : false;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Head>
          <title>加载中... - Move To Learn</title>
        </Head>
        <Navbar />
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.loading}>加载中...</div>
        </main>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className={styles.container}>
        <Head>
          <title>课程加载失败 - Move To Learn</title>
        </Head>
        <Navbar />
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.error}>
            {error || '课程不存在'}
            <Link href="/dashboard/courses" className={styles.backLink}>
              返回课程列表
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{course.title} - Move To Learn</title>
        <meta content={course.description} name="description" />
      </Head>

      <Navbar />
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <Link href="/dashboard">主页</Link> &gt; 
          <Link href="/dashboard/courses">课程</Link> &gt; 
          <span>{course.title}</span>
        </div>
        
        <div className={styles.courseHeader}>
          <div className={styles.courseInfo}>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <div className={styles.courseType}>{course.type === 'AI' ? 'AI' : 'Web3'} 课程</div>
          </div>
          
          {progress && (
            <div className={styles.progressCard}>
              <div className={styles.progressTitle}>学习进度</div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${progress.progressPercentage}%` }}
                ></div>
              </div>
              <div className={styles.progressStats}>
                <div>已完成: {progress.completedCount}/{progress.totalChapters} 章节</div>
                <div>{Math.round(progress.progressPercentage)}%</div>
              </div>
              {progress.nextChapter && (
                <Link href={`/chapters/${progress.nextChapter.id}`} className={styles.continueButton}>
                  继续学习
                </Link>
              )}
            </div>
          )}
        </div>

        <div className={styles.chaptersContainer}>
          <h2 className={styles.chaptersTitle}>课程章节</h2>
          <div className={styles.chaptersList}>
            {course.chapters.map((chapter) => {
              const isCompleted = progress?.completedChapterIds.includes(chapter.id);
              const isAccessible = isChapterAccessible(chapter.order);
              
              return (
                <div key={chapter.id} className={`${styles.chapterItem} ${isCompleted ? styles.completed : ''}`}>
                  <div className={styles.chapterOrder}>{chapter.order}</div>
                  <div className={styles.chapterContent}>
                    <h3>{chapter.title}</h3>
                    <p>{chapter.description}</p>
                  </div>
                  <div className={styles.chapterActions}>
                    {isAccessible ? (
                      <Link href={`/chapters/${chapter.id}`} className={styles.startButton}>
                        {isCompleted ? '复习' : '开始学习'}
                      </Link>
                    ) : (
                      <span className={styles.lockedButton}>请先完成前置章节</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetail; 