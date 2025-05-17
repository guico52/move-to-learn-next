import React from 'react';
import { CourseTypeDto } from '@/api/model/dto';
import { FiAward, FiCode, FiDatabase, FiLock, FiShield, FiStar, FiTrendingUp } from 'react-icons/fi';
import styles from '../styles/CourseBadge.module.css';

interface CourseBadgeProps {
  type: CourseTypeDto['CourseController/COURSE_TYPE'];
  isEarned: boolean;
  size?: number;
}

// 课程类型对应的图标和颜色
const badgeConfig: Record<CourseTypeDto['CourseController/COURSE_TYPE']['name'], { icon: React.ElementType; color: string }> = {
  AI: { icon: FiDatabase, color: '#10b981' },
  WEB3: { icon: FiCode, color: '#3b82f6' },
  MOVE: { icon: FiStar, color: '#8b5cf6' },
  SMART_CONTRACT: { icon: FiLock, color: '#ec4899' },
  DEFI: { icon: FiTrendingUp, color: '#f59e0b' },
  NFT: { icon: FiAward, color: '#6366f1' },
  SECURITY: { icon: FiShield, color: '#ef4444' },
};

const CourseBadge: React.FC<CourseBadgeProps> = ({ type, isEarned, size = 64 }) => {
  const config = badgeConfig[type.name];
  const Icon = config.icon;

  return (
    <div 
      className={`${styles.badge} ${isEarned ? styles.earned : ''}`}
      style={{ 
        width: size, 
        height: size,
        color: isEarned ? config.color : '#94a3b8'
      }}
    >
      <Icon size={size * 0.5} />
      {isEarned && (
        <div className={styles.earnedOverlay}>
          <span className={styles.earnedText}>已获得</span>
        </div>
      )}
    </div>
  );
};

export default CourseBadge; 