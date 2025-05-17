import type {Executor} from '../';
import type {CourseDto, CourseTypeDto} from '../model/dto/';
import type {ApiResponse, Mono} from '../model/static/';

export class CourseController {
    
    constructor(private executor: Executor) {}
    
    readonly buyCourse: (options: CourseControllerOptions['buyCourse']) => Promise<
        Mono<ApiResponse<CourseDto['CourseController/COURSE_WITH_CHAPTER']>>
    > = async(options) => {
        let _uri = '/api/courses/buy/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Mono<ApiResponse<CourseDto['CourseController/COURSE_WITH_CHAPTER']>>>;
    }
    
    readonly getAllCourses: (options: CourseControllerOptions['getAllCourses']) => Promise<
        Mono<ApiResponse<ReadonlyArray<CourseDto['CourseController/COURSE']>>>
    > = async(options) => {
        let _uri = '/api/courses';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.type;
        _uri += _separator
        _uri += 'type='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Mono<ApiResponse<ReadonlyArray<CourseDto['CourseController/COURSE']>>>>;
    }
    
    readonly getCourseById: (options: CourseControllerOptions['getCourseById']) => Promise<
        Mono<ApiResponse<CourseDto['CourseController/COURSE_DETAIL']>>
    > = async(options) => {
        let _uri = '/api/courses/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Mono<ApiResponse<CourseDto['CourseController/COURSE_DETAIL']>>>;
    }
    
    readonly getCourseTypes: () => Promise<
        Mono<ApiResponse<ReadonlyArray<CourseTypeDto['CourseController/COURSE_TYPE']>>>
    > = async() => {
        let _uri = '/api/courses/types';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Mono<ApiResponse<ReadonlyArray<CourseTypeDto['CourseController/COURSE_TYPE']>>>>;
    }
    
    readonly getPrivateCourses: () => Promise<
        Mono<ApiResponse<ReadonlyArray<CourseDto['CourseController/COURSE']>>>
    > = async() => {
        let _uri = '/api/courses/private-courses';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Mono<ApiResponse<ReadonlyArray<CourseDto['CourseController/COURSE']>>>>;
    }
}

export type CourseControllerOptions = {
    'getAllCourses': {
        readonly type: string
    }, 
    'getCourseById': {
        readonly id: string
    }, 
    'buyCourse': {
        readonly id: string
    }, 
    'getPrivateCourses': {}, 
    'getCourseTypes': {}
}
