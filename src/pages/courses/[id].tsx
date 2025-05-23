import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import CourseBadge from '../../components/CourseBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import styles from '../../styles/Course.module.css';
import { CourseDto, CourseTypeDto } from '@/api/model/dto';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/utils/executor';
import { ApiResponse } from '@/api/model/static/ApiResponse';


interface Progress {
  totalChapters: number;
  completedCount: number;
  progressPercentage: number;
  nextChapter: CourseDto['CourseController/COURSE_DETAIL']['chapters'][number] | null;
  completedChapterIds: string[];
}

const CourseDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [course, setCourse] = useState<CourseDto['CourseController/COURSE_DETAIL'] | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  // 获取课程详情和学习进度
  const fetchCourseAndProgress = async () => {
    if (!id) return;
    try {
      setLoading(true);
      // 获取课程详情
      const response = await api.courseController.getCourseById({
        id: id as string
      });
      
      const result = response as any;
      console.log("result", result);
      if (result.data) {
        const courseData = result.data.data;
        console.log("courseData", courseData);
        setCourse(courseData);
        
        // 如果用户已购买，计算进度
        if (courseData.userCourseBuy) {
          const newProgress = {
            totalChapters: courseData.chapters.length,
            completedCount: courseData.userProgressLength || 0,
            progressPercentage: ((courseData.userProgressLength || 0) / courseData.chapters.length) * 100,
            nextChapter: courseData.chapters.find((ch: any) => 
              !(courseData.userProgress || []).some((p: any) => p.completed && p.id === ch.id)
            ) || null,
            completedChapterIds: (courseData.userProgress || [])
              .filter((p: any) => p.completed)
              .map((p: any) => p.id)
          };
          setProgress(newProgress);
        }
      }
    } catch (err) {
      setError('加载课程失败，请稍后重试');
      console.error('获取课程详情失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseAndProgress();
  }, [id]);

  // 购买课程
  const handlePurchase = async () => {
    if (!course || purchasing) return;
    
    try {
      setPurchasing(true);
      // 调用购买API
      const response = await api.courseController.buyCourse({
        id: course.id
      });
      
      const result = (await response) as any;
      
      console.log("result", result);
      if (result.success) {
        // 更新课程状态
        console.log("result.data", result.data);
        setCourse(prev => ({...prev, ...result.data}));
        
        // 显示成功消息
        alert('购买成功！');
      }
    } catch (err) {
      console.error('购买失败:', err);
      alert('购买失败，请稍后重试');
    } finally {
      setPurchasing(false);
    }
  };

  // 判断章节是否可访问
  const isChapterAccessible = (chapterOrder: number) => {
    if (!course) return false;
    
    // 第一章总是可访问的
    if (chapterOrder === 1) return true;
    
    // 如果前一章节已完成，则当前章节可访问
    return course.userProgressLength >= chapterOrder - 1;
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
    console.log("error", error);
    console.log("course", course);
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
            <div className={styles.courseType}>
              {course.type && typeof course.type === 'object' && course.type.name ? course.type.name : '未分类'} 课程
            </div>
            {!course.userBrought && (
              <button 
                className={styles.purchaseButton}
                onClick={handlePurchase}
                disabled={purchasing}
              >
                {purchasing ? (
                  <span className={styles.purchaseLoading}>
                    <LoadingSpinner size="small" color="white" />
                    <span>购买中...</span>
                  </span>
                ) : '免费获取'}
              </button>
            )}
            {course.userBrought && (
              <div className={styles.purchaseStatus}>
                已获得课程访问权限
              </div>
            )}
          </div>
          
          <div className={styles.courseProgress}>
            {course.userBrought && progress && (
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
            
            {/* <div className={styles.badgeContainer}>
              <div className={styles.badgeWrapper}>
                <CourseBadge 
                  type={course.type} 
                  isEarned={progress?.progressPercentage === 100}
                  size={80}
                />
                <div className={styles.badgeInfo}>
                  <h3>课程徽章</h3>
                  <p>{progress?.progressPercentage === 100 ? '恭喜获得课程徽章！' : '完成所有章节即可获得徽章'}</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        <div className={styles.chaptersContainer}>
          <h2 className={styles.chaptersTitle}>课程章节</h2>
          <div className={styles.chaptersList}>
            {course.chapters.map((chapter) => {
              // chapter.id 在 course.userProgress 中
              const isCompleted = course.userProgress.some(p => p.chapter.id === chapter.id);
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