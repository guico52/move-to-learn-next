import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import CourseCard from '../../components/CourseCard';
import styles from '../../styles/Home.module.css';

// 课程分类数据
const courseCategories = [
  { id: 'all', name: '全部课程' },
  { id: 'move', name: 'Move语言' },
  { id: 'smart-contract', name: '智能合约' },
  { id: 'defi', name: 'DeFi' },
  { id: 'nft', name: 'NFT' },
  { id: 'security', name: '安全审计' },
];

// 筛选条件
const filters = [
  { id: 'difficulty', name: '难度', options: ['全部', '初级', '中级', '高级'] },
  { id: 'price', name: '价格', options: ['全部', '免费', '付费'] },
  { id: 'duration', name: '时长', options: ['全部', '1-5课时', '6-10课时', '10课时以上'] },
  { id: 'sort', name: '排序', options: ['最受欢迎', '最新', '评分最高'] },
];

// 课程数据
const courses = [
  {
    id: '1',
    title: 'Move语言基础',
    description: '从零开始学习Move语言，掌握智能合约开发的基本概念。',
    type: 'move',
    difficulty: '初级',
    chapters: 6,
    rating: 4.8,
    duration: '6课时',
    price: 0,
    students: '3.2K',
    image: 'https://picsum.photos/400/250?random=1',
    tags: ['免费'],
  },
  {
    id: '2',
    title: 'DeFi应用开发',
    description: '学习构建去中心化金融应用，包括借贷、交易等核心功能。',
    type: 'defi',
    difficulty: '中级',
    chapters: 12,
    rating: 4.9,
    duration: '12课时',
    price: 120,
    students: '2.1K',
    image: 'https://picsum.photos/400/250?random=2',
    tags: [],
  },
  {
    id: '3',
    title: 'NFT市场开发',
    description: '掌握NFT智能合约开发，交易市场开发技术。',
    type: 'nft',
    difficulty: '中级',
    chapters: 10,
    rating: 4.7,
    duration: '10课时',
    price: 100,
    students: '1.8K',
    image: 'https://picsum.photos/400/250?random=3',
    tags: [],
  },
  {
    id: '4',
    title: '智能合约安全指南',
    description: '学习智能合约安全审计技术，发现漏洞并防范攻击。',
    type: 'security',
    difficulty: '高级',
    chapters: 8,
    rating: 4.9,
    duration: '8课时',
    price: 150,
    students: '1.5K',
    image: 'https://picsum.photos/400/250?random=4',
    tags: [],
  },
];

const CoursesPage: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>(
    Object.fromEntries(filters.map(filter => [filter.id, filter.options[0]]))
  );

  // 过滤课程
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || course.type === activeCategory;
    const matchesDifficulty = selectedFilters.difficulty === '全部' || course.difficulty === selectedFilters.difficulty;
    const matchesPrice = selectedFilters.price === '全部' || 
      (selectedFilters.price === '免费' ? course.price === 0 : course.price > 0);
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesPrice;
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>课程列表 - Move To Learn</title>
        <meta name="description" content="探索 Move To Learn 平台上的优质课程" />
      </Head>

      <Navbar />

      <main className={styles.main}>
        {/* 搜索栏 */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索区块链快链课程、教程、项目..."
            className={styles.searchInput}
          />
        </div>

        {/* 课程分类 */}
        <div className={styles.categoryContainer}>
          {courseCategories.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryButton} ${
                activeCategory === category.id ? styles.categoryActive : ''
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* 筛选条件 */}
        <div className={styles.filterContainer}>
          <div className={styles.filterWrapper}>
            <span className={styles.filterLabel}>难度：</span>
            <select
              value={selectedFilters.difficulty}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, difficulty: e.target.value }))}
              className={styles.filterSelect}
            >
              {filters.find(f => f.id === 'difficulty')?.options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterWrapper}>
            <span className={styles.filterLabel}>价格：</span>
            <select
              value={selectedFilters.price}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, price: e.target.value }))}
              className={styles.filterSelect}
            >
              {filters.find(f => f.id === 'price')?.options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterWrapper}>
            <span className={styles.filterLabel}>时长：</span>
            <select
              value={selectedFilters.duration}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, duration: e.target.value }))}
              className={styles.filterSelect}
            >
              {filters.find(f => f.id === 'duration')?.options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterWrapper}>
            <span className={styles.filterLabel}>排序：</span>
            <select
              value={selectedFilters.sort}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, sort: e.target.value }))}
              className={styles.filterSelect}
            >
              {filters.find(f => f.id === 'sort')?.options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 课程列表 */}
        <div className={styles.courseGrid}>
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default CoursesPage; 