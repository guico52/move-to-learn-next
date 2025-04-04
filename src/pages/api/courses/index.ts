import { NextApiRequest, NextApiResponse } from 'next';
import { getAllCourses, getCoursesByType } from '../../../services/courseService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    const { type } = req.query;
    let courses;

    if (type === 'AI' || type === 'WEB3') {
      courses = await getCoursesByType(type);
    } else {
      courses = await getAllCourses();
    }

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error('获取课程列表失败:', error);
    return res.status(500).json({
      success: false,
      error: '服务器错误，无法获取课程列表',
    });
  }
} 