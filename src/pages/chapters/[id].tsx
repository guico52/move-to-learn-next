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
          {chapter.nextChapterId ? (
            <Link href={`/chapters/${chapter.nextChapterId}`}>
              <button className={styles.nextButton}>下一章</button>
            </Link>
          ) : (
            <Link href={`/courses/${chapter.courseId}`}>
              <button className={styles.nextButton}>返回课程</button>
            </Link>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChapterPage; 