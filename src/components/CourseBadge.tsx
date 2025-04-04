import React from 'react';
import { CourseType } from '@prisma/client';
import { FiAward, FiCode, FiDatabase, FiLock, FiShield, FiStar, FiTrendingUp } from 'react-icons/fi';
import styles from '../styles/CourseBadge.module.css';

interface CourseBadgeProps {
  type: CourseType;
  isEarned: boolean;
  size?: number;
}

// 课程类型对应的图标和颜色
const badgeConfig: Record<CourseType, { icon: React.ElementType; color: string }> = {
  AI: { icon: FiDatabase, color: '#10b981' },
  WEB3: { icon: FiCode, color: '#3b82f6' },
  MOVE: { icon: FiStar, color: '#8b5cf6' },
  SMART_CONTRACT: { icon: FiLock, color: '#ec4899' },
  DEFI: { icon: FiTrendingUp, color: '#f59e0b' },
  NFT: { icon: FiAward, color: '#6366f1' },
  SECURITY: { icon: FiShield, color: '#ef4444' },
};

const CourseBadge: React.FC<CourseBadgeProps> = ({ type, isEarned, size = 64 }) => {
  const config = badgeConfig[type];
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