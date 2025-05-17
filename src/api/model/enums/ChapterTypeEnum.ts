export const ChapterTypeEnum_CONSTANTS = [
    'BLOG', 
    'MARKDOWN', 
    'PRIVATE_BLOG'
] as const;
export type ChapterTypeEnum = typeof ChapterTypeEnum_CONSTANTS[number];
