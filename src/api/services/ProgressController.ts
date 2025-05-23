import type {Executor} from '../';
import type {UserProgressDto} from '../model/dto/';
import type {Dynamic_UserProgress} from '../model/dynamic/';
import type {ApiResponse, Mono} from '../model/static/';

export class ProgressController {
    
    constructor(private executor: Executor) {}
    
    readonly finished: (options: ProgressControllerOptions['finished']) => Promise<
        Mono<ApiResponse<Dynamic_UserProgress>>
    > = async(options) => {
        let _uri = '/api/progress/finished';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.chapterId;
        _uri += _separator
        _uri += 'chapterId='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        _value = options.courseId;
        _uri += _separator
        _uri += 'courseId='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Mono<ApiResponse<Dynamic_UserProgress>>>;
    }
    
    readonly get: (options: ProgressControllerOptions['get']) => Promise<
        Mono<ApiResponse<UserProgressDto['ProgressController/PROGRESS']>>
    > = async(options) => {
        let _uri = '/api/progress/';
        _uri += encodeURIComponent(options.courseId);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Mono<ApiResponse<UserProgressDto['ProgressController/PROGRESS']>>>;
    }
    
    readonly updateProgress: (options: ProgressControllerOptions['updateProgress']) => Promise<
        Mono<ApiResponse<Dynamic_UserProgress>>
    > = async(options) => {
        let _uri = '/api/progress/update';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.chapterId;
        _uri += _separator
        _uri += 'chapterId='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        _value = options.courseId;
        _uri += _separator
        _uri += 'courseId='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Mono<ApiResponse<Dynamic_UserProgress>>>;
    }
}

export type ProgressControllerOptions = {
    'get': {
        readonly courseId: string
    }, 
    'updateProgress': {
        readonly chapterId: string, 
        readonly courseId: string
    }, 
    'finished': {
        readonly chapterId: string, 
        readonly courseId: string
    }
}
