import type {Executor} from '../';
import type {Dynamic_Course} from '../model/dynamic/';
import type {ApiResponse, Mono} from '../model/static/';

export class CourseController {
    
    constructor(private executor: Executor) {}
    
    readonly getAllCourses: (options: CourseControllerOptions['getAllCourses']) => Promise<
        Mono<ApiResponse<ReadonlyArray<Dynamic_Course>>>
    > = async(options) => {
        let _uri = '/api/courses/';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.type;
        _uri += _separator
        _uri += 'type='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Mono<ApiResponse<ReadonlyArray<Dynamic_Course>>>>;
    }
}

export type CourseControllerOptions = {
    'getAllCourses': {
        readonly type: string
    }
}
