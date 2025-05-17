import type {Dynamic_Chapter, Dynamic_Course, Dynamic_User} from './';

/**
 * <p>
 *  UserProgress
 * 
 * </p>
 * 
 */
export interface Dynamic_UserProgress {
    /**
     * id
     */
    readonly id?: string;
    /**
     * userId
     */
    readonly userId?: string;
    readonly user?: Dynamic_User;
    readonly courseId?: string;
    /**
     * courseId
     */
    readonly course?: Dynamic_Course;
    /**
     * chapterId
     */
    readonly chapter?: Dynamic_Chapter;
    /**
     * completed
     */
    readonly completed?: boolean;
    /**
     * completedAt
     */
    readonly completedAt?: string;
    /**
     * createdAt
     */
    readonly createdAt?: string;
    /**
     * updatedAt
     */
    readonly updatedAt?: string;
}
