import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/CourseCard.module.css';
import { FiBook, FiClock, FiStar, FiUsers } from 'react-icons/fi';

interface CourseCardProps {
  course: {
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
  };
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link href={`/courses/${course.id}`}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <Image
            src={course.image}
            alt={course.title}
            className={styles.image}
            layout="fill"
            priority
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{course.title}</h3>
          <p className={styles.description}>{course.description}</p>
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <FiBook className={styles.icon} />
              <span>{course.chapters}章节</span>
            </div>
            <div className={styles.metaItem}>
              <FiClock className={styles.icon} />
              <span>{course.duration}</span>
            </div>
            <div className={styles.metaItem}>
              <FiUsers className={styles.icon} />
              <span>{course.students}</span>
            </div>
          </div>
          <div className={styles.footer}>
            <div className={styles.price}>
              {course.price === 0 ? (
                <span className={styles.free}>免费</span>
              ) : (
                <span>￥{course.price}</span>
              )}
            </div>
            <div className={styles.rating}>
              <FiStar className={styles.icon} style={{ color: '#f59e0b' }} />
              <span className={styles.ratingValue}>{course.rating}</span>
            </div>
          </div>
          {course.tags.length > 0 && (
            <div className={styles.tags}>
              {course.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard; 