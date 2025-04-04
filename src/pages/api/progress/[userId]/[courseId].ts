import { NextApiRequest, NextApiResponse } from 'next';
import { getUserCourseProgress } from '../../../../services/courseService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }

  const { userId, courseId } = req.query;

  if (!userId || !courseId || typeof userId !== 'string' || typeof courseId !== 'string') {
    return res.status(400).json({ error: '缺少必要参数' });
  }

  try {
    const progress = await getUserCourseProgress(userId, courseId);

    return res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error('获取学习进度失败:', error);
    return res.status(500).json({
      success: false,
      error: '服务器错误，无法获取学习进度',
    });
  }
} 