import { NextApiRequest, NextApiResponse } from 'next';
import { getCourseById } from '../../../utils/courseService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: '缺少有效的课程ID' });
  }

  try {
    const course = await getCourseById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: '课程不存在',
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error('获取课程详情失败:', error);
    return res.status(500).json({
      success: false,
      error: '服务器错误，无法获取课程详情',
    });
  }
} 