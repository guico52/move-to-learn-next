import { NextApiRequest, NextApiResponse } from 'next';
import { updateUserProgress } from '../../../utils/courseService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  const { userId, chapterId, courseId } = req.body;

  if (!userId || !chapterId || !courseId) {
    return res.status(400).json({ error: '缺少必要参数' });
  }

  try {
    const progress = await updateUserProgress(userId, chapterId, courseId);

    return res.status(200).json({
      success: true,
      progress,
      message: '学习进度已更新',
    });
  } catch (error) {
    console.error('更新学习进度失败:', error);
    return res.status(500).json({
      success: false,
      error: '服务器错误，无法更新学习进度',
    });
  }
} 