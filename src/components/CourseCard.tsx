import React from 'react';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

interface Course {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  chapters: number;
  rating: number;
  duration: string;
  price: number;
  students: string;
  image: string;
  tags: string[];
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className={styles.courseCard}>
      <div className={styles.courseImageWrapper}>
        <Image
          src={course.image}
          alt={course.title}
          width={400}
          height={250}
          className={styles.courseImage}
        />
      </div>
      <div className={styles.courseInfo}>
        <div className={styles.courseHeader}>
          <h3 className={styles.courseTitle}>{course.title}</h3>
          <div className={styles.courseTags}>
            <span className={styles.difficultyTag}>{course.difficulty}</span>
            {course.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <p className={styles.courseDescription}>{course.description}</p>
        <div className={styles.courseMeta}>
          <span className={styles.metaItem}>
            <span className={styles.metaIcon}>📚</span>
            {course.chapters}课时
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaIcon}>⭐</span>
            {course.rating.toFixed(1)}
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaIcon}>👥</span>
            {course.students}
          </span>
        </div>
        <div className={styles.courseFooter}>
          <span className={styles.coursePrice}>
            {course.price === 0 ? '免费' : `${course.price} MTL`}
          </span>
          <button className={styles.startButton}>开始学习</button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard; 