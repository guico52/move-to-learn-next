import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import CourseCard from '../../components/CourseCard';
import styles from '../../styles/Courses.module.css';
import { api } from '@/utils/executor';
import { CourseDto, CourseTypeDto } from '@/api/model/dto';

// 筛选条件
const filters = [
  { id: 'difficulty', name: '难度', options: ['全部', '初级', '中级', '高级'] },
  { id: 'price', name: '价格', options: ['全部', '免费', '付费'] },
  { id: 'duration', name: '时长', options: ['全部', '1-5课时', '6-10课时', '10课时以上'] },
  { id: 'sort', name: '排序', options: ['最受欢迎', '最新', '评分最高'] },
];


// 课程数据

const CoursesPage: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [courses, setCourses] = useState<CourseDto['CourseController/COURSE'][]>([]);
  const [courseTypes, setCourseTypes] = useState<CourseTypeDto['CourseController/COURSE_TYPE'][]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>(
    Object.fromEntries(filters.map(filter => [filter.id, filter.options[0]]))
  );

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await api.courseController.getAllCourses({
        type: ''
      });
      console.log("response", response);
      setCourses(response.data.data);
      console.log("courses", courses);
    };
    const fetchCourseTypes = async () => {
      const response = await api.courseController.getCourseTypes();
      console.log("response", response);
      setCourseTypes(response.data);
      console.log("courseTypes", courseTypes);
    };
    fetchCourses();
    fetchCourseTypes();
  }, []);



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
          {courseTypes && courseTypes.length > 0 ? (
            courseTypes.map((category) => (
              <button
                key={category.id}
                className={`${styles.categoryButton} ${
                  activeCategory === category.id ? styles.categoryActive : ''
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name || '未分类'}
              </button>
            ))
          ) : (
            <div className={styles.noCategories}>暂无课程分类</div>
          )}
        </div>

        {/* 课程列表 */}
        <div className={styles.courseGrid}>
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default CoursesPage; 