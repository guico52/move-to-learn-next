import type {Dynamic_Course, Dynamic_User} from './';

/**
 * <p>
 *  user_course_buy
 * 
 * </p>
 * 
 */
export interface Dynamic_UserCourseBuy {
    /**
     * id
     */
    readonly id?: string;
    /**
     * course_id
     */
    readonly courseId?: string | undefined;
    readonly course?: Dynamic_Course | undefined;
    /**
     * user_id
     */
    readonly userId?: string | undefined;
    readonly user?: Dynamic_User | undefined;
    /**
     * create_at
     */
    readonly createAt?: string | undefined;
    /**
     * is_finished
     */
    readonly isFinished?: boolean | undefined;
}
