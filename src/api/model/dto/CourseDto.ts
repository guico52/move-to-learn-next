import type {ChapterTypeEnum} from '../enums/';

export type CourseDto = {
    'CourseController/COURSE': {
        /**
         * id
         */
        readonly id: string;
        /**
         * title
         */
        readonly title: string;
        /**
         * description
         */
        readonly description: string;
        /**
         * image
         */
        readonly image?: string | undefined;
        /**
         * createdAt
         */
        readonly createdAt: string;
        /**
         * updatedAt
         */
        readonly updatedAt: string;
        readonly price: number;
        readonly finishReward: number;
        /**
         * type
         */
        readonly type?: {
            /**
             * id
             */
            readonly id: string;
            /**
             * name
             */
            readonly name?: string | undefined;
        } | undefined;
        readonly courseLength: number;
        readonly userProgressLength: number;
        readonly userBrought: boolean;
    }, 
    'CourseController/COURSE_DETAIL': {
        /**
         * id
         */
        readonly id: string;
        /**
         * title
         */
        readonly title: string;
        /**
         * description
         */
        readonly description: string;
        /**
         * image
         */
        readonly image?: string | undefined;
        /**
         * createdAt
         */
        readonly createdAt: string;
        /**
         * updatedAt
         */
        readonly updatedAt: string;
        readonly price: number;
        readonly finishReward: number;
        readonly courseLength: number;
        readonly userProgressLength: number;
        readonly userBrought: boolean;
        /**
         * type
         */
        readonly type?: {
            /**
             * id
             */
            readonly id: string;
            /**
             * name
             */
            readonly name?: string | undefined;
        } | undefined;
        readonly chapters: ReadonlyArray<{
            /**
             * id
             */
            readonly id: string;
            /**
             * title
             */
            readonly title: string;
            /**
             * description
             */
            readonly description: string;
            /**
             * content
             */
            readonly content?: string | undefined;
            /**
             * order
             */
            readonly order: number;
            /**
             * createdAt
             */
            readonly createdAt: string;
            /**
             * updatedAt
             */
            readonly updatedAt: string;
            readonly type?: ChapterTypeEnum | undefined;
        }>;
        readonly userProgress: ReadonlyArray<{
            /**
             * id
             */
            readonly id: string;
            /**
             * completed
             */
            readonly completed: boolean;
            /**
             * completedAt
             */
            readonly completedAt: string;
            /**
             * createdAt
             */
            readonly createdAt: string;
            /**
             * updatedAt
             */
            readonly updatedAt: string;
            /**
             * chapterId
             */
            readonly chapter: {
                /**
                 * id
                 */
                readonly id: string;
            };
        }>;
        readonly userCourseBuy: ReadonlyArray<{
            /**
             * id
             */
            readonly id: string;
            /**
             * is_finished
             */
            readonly isFinished?: boolean | undefined;
        }>;
    }, 
    'CourseController/COURSE_WITH_CHAPTER': {
        /**
         * id
         */
        readonly id: string;
        readonly chapters: ReadonlyArray<{
            /**
             * id
             */
            readonly id: string;
        }>;
    }
}
