import type {
    Dynamic_Chapter, 
    Dynamic_CourseType, 
    Dynamic_UserCourseBuy, 
    Dynamic_UserProgress
} from './';

/**
 * <p>
 *  Course
 * 
 * </p>
 * 
 */
export interface Dynamic_Course {
    /**
     * id
     */
    readonly id?: string;
    /**
     * title
     */
    readonly title?: string;
    /**
     * description
     */
    readonly description?: string;
    /**
     * image
     */
    readonly image?: string | undefined;
    /**
     * createdAt
     */
    readonly createdAt?: string;
    /**
     * updatedAt
     */
    readonly updatedAt?: string;
    readonly price?: number;
    readonly finishReward?: number;
    /**
     * type
     */
    readonly type?: Dynamic_CourseType | undefined;
    readonly chapters?: ReadonlyArray<Dynamic_Chapter>;
    readonly userCourseBuy?: ReadonlyArray<Dynamic_UserCourseBuy>;
    readonly userProgress?: ReadonlyArray<Dynamic_UserProgress>;
    readonly courseLength?: number;
    readonly userProgressLength?: number;
    readonly userBrought?: boolean;
}
