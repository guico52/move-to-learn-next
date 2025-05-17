import type {ChapterTypeEnum} from '../enums/';
import type {Dynamic_Course, Dynamic_UserProgress} from './';

/**
 * <p>
 *  Chapter
 * 
 * </p>
 * 
 */
export interface Dynamic_Chapter {
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
     * content
     */
    readonly content?: string | undefined;
    /**
     * order
     */
    readonly order?: number;
    /**
     * courseId
     */
    readonly courseId?: string;
    readonly course?: Dynamic_Course;
    readonly nextChapterId?: string | undefined;
    /**
     * nextChapterId
     */
    readonly nextChapter?: Dynamic_Chapter | undefined;
    /**
     * createdAt
     */
    readonly createdAt?: string;
    /**
     * updatedAt
     */
    readonly updatedAt?: string;
    readonly progress?: Dynamic_UserProgress | undefined;
    readonly type?: ChapterTypeEnum | undefined;
}
