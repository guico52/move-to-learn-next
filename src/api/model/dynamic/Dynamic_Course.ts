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
     * type
     */
    readonly type?: string;
    /**
     * createdAt
     */
    readonly createdAt?: string;
    /**
     * updatedAt
     */
    readonly updatedAt?: string;
}
