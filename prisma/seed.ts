const { PrismaClient, CourseType } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // 清理现有数据
  await prisma.userProgress.deleteMany({});
  await prisma.chapter.deleteMany({});
  await prisma.course.deleteMany({});

  // 创建AI课程
  const aiCourse = await prisma.course.create({
    data: {
      title: 'AI基础与应用',
      description: '了解人工智能的基本概念、工作原理及其在各个领域的应用',
      image: '/images/courses/ai-basics.jpg',
      type: CourseType.AI,
    },
  });

  // 创建AI课程章节
  const aiChapter1 = await prisma.chapter.create({
    data: {
      title: '人工智能概述',
      description: '介绍人工智能的历史、定义、类型和基本原理',
      order: 1,
      courseId: aiCourse.id,
      content: 'AI概述章节内容将在这里展示...',
    },
  });

  const aiChapter2 = await prisma.chapter.create({
    data: {
      title: '机器学习基础',
      description: '机器学习的基本概念、算法类型及其应用场景',
      order: 2,
      courseId: aiCourse.id,
      content: '机器学习基础章节内容将在这里展示...',
    },
  });

  const aiChapter3 = await prisma.chapter.create({
    data: {
      title: '深度学习入门',
      description: '神经网络原理及深度学习基础知识',
      order: 3,
      courseId: aiCourse.id,
      content: '深度学习入门章节内容将在这里展示...',
    },
  });

  const aiChapter4 = await prisma.chapter.create({
    data: {
      title: 'AI应用案例分析',
      description: '探讨AI在各行业的实际应用及案例研究',
      order: 4,
      courseId: aiCourse.id,
      content: 'AI应用案例分析章节内容将在这里展示...',
    },
  });

  // 更新章节之间的关联关系
  await prisma.chapter.update({
    where: { id: aiChapter1.id },
    data: { nextChapterId: aiChapter2.id },
  });

  await prisma.chapter.update({
    where: { id: aiChapter2.id },
    data: { nextChapterId: aiChapter3.id },
  });

  await prisma.chapter.update({
    where: { id: aiChapter3.id },
    data: { nextChapterId: aiChapter4.id },
  });

  // 创建Web3课程
  const web3Course = await prisma.course.create({
    data: {
      title: '区块链与Web3入门',
      description: '了解区块链技术原理及其在Web3领域的应用',
      image: '/images/courses/web3-basics.jpg',
      type: CourseType.WEB3,
    },
  });

  // 创建Web3课程章节
  const web3Chapter1 = await prisma.chapter.create({
    data: {
      title: '区块链基础',
      description: '区块链的定义、工作原理和关键特性',
      order: 1,
      courseId: web3Course.id,
      content: '区块链基础章节内容将在这里展示...',
    },
  });

  const web3Chapter2 = await prisma.chapter.create({
    data: {
      title: '智能合约开发',
      description: '智能合约的概念、编写及部署',
      order: 2,
      courseId: web3Course.id,
      content: '智能合约开发章节内容将在这里展示...',
    },
  });

  const web3Chapter3 = await prisma.chapter.create({
    data: {
      title: 'DApp开发入门',
      description: '去中心化应用程序的基本架构和开发流程',
      order: 3,
      courseId: web3Course.id,
      content: 'DApp开发入门章节内容将在这里展示...',
    },
  });

  const web3Chapter4 = await prisma.chapter.create({
    data: {
      title: 'Web3生态系统',
      description: '探索Web3的生态系统和未来发展趋势',
      order: 4,
      courseId: web3Course.id,
      content: 'Web3生态系统章节内容将在这里展示...',
    },
  });

  // 更新章节之间的关联关系
  await prisma.chapter.update({
    where: { id: web3Chapter1.id },
    data: { nextChapterId: web3Chapter2.id },
  });

  await prisma.chapter.update({
    where: { id: web3Chapter2.id },
    data: { nextChapterId: web3Chapter3.id },
  });

  await prisma.chapter.update({
    where: { id: web3Chapter3.id },
    data: { nextChapterId: web3Chapter4.id },
  });

  console.log('种子数据创建成功');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 