import { prisma } from './prisma';

// 获取所有课程
export const getAllCourses = async () => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        chapters: {
          orderBy: {
            order: 'asc',
          },
          select: {
            id: true,
            title: true,
            description: true,
            order: true,
          },
        },
      },
    });
    return courses;
  } catch (error) {
    console.error('获取所有课程失败:', error);
    throw error;
  }
};

// 获取特定类型的课程
export const getCoursesByType = async (type: 'AI' | 'WEB3') => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        type,
      },
      include: {
        chapters: {
          orderBy: {
            order: 'asc',
          },
          select: {
            id: true,
            title: true,
            description: true,
            order: true,
          },
        },
      },
    });
    return courses;
  } catch (error) {
    console.error(`获取${type}类型课程失败:`, error);
    throw error;
  }
};

// 获取课程详情（包括章节）
export const getCourseById = async (courseId: string) => {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        chapters: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
    return course;
  } catch (error) {
    console.error('获取课程详情失败:', error);
    throw error;
  }
};

// 获取章节详情
export const getChapterById = async (chapterId: string) => {
  try {
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
    });
    return chapter;
  } catch (error) {
    console.error('获取章节详情失败:', error);
    throw error;
  }
};

// 更新用户学习进度
export const updateUserProgress = async (userId: string, chapterId: string, courseId: string) => {
  try {
    // 使用upsert确保不会重复创建记录
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        courseId,
        chapterId,
        completed: true,
        completedAt: new Date(),
      },
    });
    return progress;
  } catch (error) {
    console.error('更新学习进度失败:', error);
    throw error;
  }
};

// 获取用户的课程学习进度
export const getUserCourseProgress = async (userId: string, courseId: string) => {
  try {
    // 获取课程所有章节
    const chapters = await prisma.chapter.findMany({
      where: {
        courseId,
      },
      orderBy: {
        order: 'asc',
      },
    });

    // 获取用户已完成的章节
    const completedChapters = await prisma.userProgress.findMany({
      where: {
        userId,
        courseId,
        completed: true,
      },
      select: {
        chapterId: true,
      },
    });

    const completedChapterIds = completedChapters.map(cp => cp.chapterId);

    // 计算完成比例
    const totalChapters = chapters.length;
    const completedCount = completedChapterIds.length;
    const progressPercentage = totalChapters > 0 ? (completedCount / totalChapters) * 100 : 0;

    // 找出下一个未完成的章节
    const nextChapter = chapters.find(chapter => !completedChapterIds.includes(chapter.id));

    return {
      totalChapters,
      completedCount,
      progressPercentage,
      nextChapter,
      completedChapterIds,
    };
  } catch (error) {
    console.error('获取用户课程进度失败:', error);
    throw error;
  }
};

// 检查用户是否可以访问特定章节
export const canAccessChapter = async (userId: string, chapterId: string) => {
  try {
    // 获取章节信息
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
      include: {
        course: {
          include: {
            chapters: {
              orderBy: {
                order: 'asc',
              },
              select: {
                id: true,
                order: true,
              },
            },
          },
        },
      },
    });

    if (!chapter) {
      return false;
    }

    // 如果是第一章，总是可以访问
    if (chapter.order === 1) {
      return true;
    }

    // 找出前一章节
    const courseChapters = chapter.course.chapters;
    const currentChapterIndex = courseChapters.findIndex(ch => ch.id === chapterId);
    
    if (currentChapterIndex <= 0) {
      return true; // 如果是第一章或出现错误，允许访问
    }

    const previousChapterId = courseChapters[currentChapterIndex - 1].id;

    // 检查用户是否完成了前一章
    const previousChapterCompleted = await prisma.userProgress.findFirst({
      where: {
        userId,
        chapterId: previousChapterId,
        completed: true,
      },
    });

    return !!previousChapterCompleted;
  } catch (error) {
    console.error('检查章节访问权限失败:', error);
    throw error;
  }
}; 