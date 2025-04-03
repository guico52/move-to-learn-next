import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/Chapter.module.css';

interface Chapter {
  id: string;
  title: string;
  description: string;
  content: string | null;
  order: number;
  courseId: string;
  nextChapterId: string | null;
  course: {
    id: string;
    title: string;
    type: 'AI' | 'WEB3';
  };
}

const ChapterDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, isLoggedIn } = useAuth();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  // 检查用户登录状态
  useEffect(() => {
    if (!isLoggedIn && !user) {
      // 保存当前URL用于登录后重定向
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      router.push('/login');
    }
  }, [isLoggedIn, user, router]);

  // 获取章节详情
  useEffect(() => {
    const fetchChapter = async () => {
      if (!id || !user) return;

      try {
        setLoading(true);
        
        // 在请求头中添加用户ID，用于后端验证权限
        const config = {
          headers: {
            'user-id': user.id
          }
        };
        
        // 获取章节详情
        const response = await axios.get(`/api/chapters/${id}`, config);
        
        if (response.data.success) {
          setChapter(response.data.chapter);
          
          // 标记章节为已完成（在实际场景中，可能需要等待用户完成某些操作）
          await markChapterAsCompleted(response.data.chapter);
          setCompleted(true);
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          setError('您需要完成前置章节才能访问此内容');
        } else {
          setError('加载章节失败，请稍后重试');
        }
        console.error('获取章节详情失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [id, user]);

  // 标记章节为已完成
  const markChapterAsCompleted = async (chapter: Chapter) => {
    if (!user) return;
    
    try {
      await axios.post('/api/progress/update', {
        userId: user.id,
        courseId: chapter.courseId,
        chapterId: chapter.id
      });
    } catch (err) {
      console.error('更新学习进度失败:', err);
    }
  };

  // 继续下一章节
  const continueToNextChapter = () => {
    if (chapter?.nextChapterId) {
      router.push(`/chapters/${chapter.nextChapterId}`);
    } else {
      // 如果没有下一章，返回课程页面
      router.push(`/courses/${chapter?.courseId}`);
    }
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

  if (error || !chapter) {
    return (
      <div className={styles.container}>
        <Head>
          <title>章节加载失败 - Move To Learn</title>
        </Head>
        <Navbar />
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.error}>
            {error || '章节不存在'}
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
        <title>{chapter.title} - Move To Learn</title>
        <meta content={chapter.description} name="description" />
      </Head>

      <Navbar />
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.chapterHeader}>
          <div className={styles.breadcrumb}>
            <Link href="/dashboard">主页</Link> &gt; 
            <Link href="/dashboard/courses">课程</Link> &gt; 
            <Link href={`/courses/${chapter.courseId}`}>{chapter.course.title}</Link> &gt; 
            <span>第 {chapter.order} 章</span>
          </div>
          <h1 className={styles.title}>{chapter.title}</h1>
          <p className={styles.description}>{chapter.description}</p>
        </div>

        <div className={styles.content}>
          {chapter.content ? (
            <div className={styles.chapterContent} dangerouslySetInnerHTML={{ __html: chapter.content }} />
          ) : (
            <div className={styles.placeholder}>
              <p>章节内容将在这里显示（这是一个演示）</p>
              <p>在实际应用中，这里将展示各种富媒体内容、交互式练习等</p>
            </div>
          )}
        </div>

        <div className={styles.chapterFooter}>
          <div className={styles.completionStatus}>
            {completed ? (
              <div className={styles.completed}>
                <span className={styles.checkmark}>✓</span> 已完成本章节
              </div>
            ) : (
              <div className={styles.inProgress}>正在学习中...</div>
            )}
          </div>

          <div className={styles.navigation}>
            <Link href={`/courses/${chapter.courseId}`} className={styles.backToCourse}>
              返回课程
            </Link>
            
            <button 
              onClick={continueToNextChapter} 
              className={styles.nextButton}
            >
              {chapter.nextChapterId ? '下一章' : '完成课程'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChapterDetail; 