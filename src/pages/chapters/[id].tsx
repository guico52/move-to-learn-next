import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import styles from '../../styles/Chapter.module.css';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/utils/executor';
import { AptosCertificates, aptosClient } from '@/utils/AptosCertificates';

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

const ChapterPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const { walletAddress } = useAuthStore();
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  useEffect(() => {
    const fetchChapter = async () => {
      if (!id || !walletAddress) return;

      try {
        const response = await api.chapterController.getChapterById({
          id: id as string
        });
        setChapter(response.data.data);
      } catch (error) {
        console.error('Error fetching chapter:', error);
      }
    };

    fetchChapter();
  }, [id, walletAddress]);

  const handleNextChapter = async () => {
    if (!chapter || isUpdatingProgress) return;

    try {
      setIsUpdatingProgress(true);
      

      // 如果有下一章，跳转到下一章
      if (chapter.nextChapterId) {
              // 更新当前章节的完成状态
      await api.progressController.updateProgress({
        chapterId: chapter.id,
        courseId: chapter.courseId
      });

        router.push(`/chapters/${chapter.nextChapterId}`);
      } else {
        // 更新当前章节的完成状态
        await api.progressController.finished({
          chapterId: chapter.id,
          courseId: chapter.courseId
        });
        // 如果没有下一章，签发给学生证书,返回课程页面
        await aptosClient.issueCertificate(walletAddress, chapter.courseId, 1);
        router.push(`/courses/${chapter.courseId}`);
      }
    } catch (error) {
      console.error('更新进度失败:', error);
      // 即使更新进度失败，也允许用户继续
      if (chapter.nextChapterId) {
        router.push(`/chapters/${chapter.nextChapterId}`);
      } else {
        router.push(`/courses/${chapter.courseId}`);
      }
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  if (!chapter) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{chapter.title} - Move To Learn</title>
      </Head>
      <Navbar />
      <div className={styles.content}>
        <Sidebar />
        <main className={styles.main}>
          <h1>{chapter.title}</h1>
          <div className={styles.chapterContent}>
            {chapter.content}
          </div>
          <button 
            onClick={handleNextChapter}
            className={styles.nextButton}
            disabled={isUpdatingProgress}
          >
            {isUpdatingProgress ? '更新进度中...' : chapter.nextChapterId ? '下一章' : '返回课程'}
          </button>
        </main>
      </div>
    </div>
  );
};

export default ChapterPage; 