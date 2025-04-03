import { NextApiRequest, NextApiResponse } from 'next';
import { getChapterById, canAccessChapter } from '../../../utils/courseService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }

  const { id } = req.query;
  const userId = req.headers['user-id'] as string;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: '缺少有效的章节ID' });
  }

  if (!userId) {
    return res.status(401).json({ error: '用户未认证' });
  }

  try {
    // 检查用户是否可以访问该章节
    const canAccess = await canAccessChapter(userId, id);

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        error: '请先完成前置章节',
      });
    }

    const chapter = await getChapterById(id);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        error: '章节不存在',
      });
    }

    return res.status(200).json({
      success: true,
      chapter,
    });
  } catch (error) {
    console.error('获取章节详情失败:', error);
    return res.status(500).json({
      success: false,
      error: '服务器错误，无法获取章节详情',
    });
  }
} 