import type {Executor} from '../';
import type {Dynamic_UserProgress} from '../model/dynamic/';

export class ProgressController {
    
    constructor(private executor: Executor) {}
    
    readonly get: (options: ProgressControllerOptions['get']) => Promise<
        Dynamic_UserProgress
    > = async(options) => {
        let _uri = '/api/progress/';
        _uri += encodeURIComponent(options.courseId);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Dynamic_UserProgress>;
    }
    
    readonly updateProgress: (options: ProgressControllerOptions['updateProgress']) => Promise<
        void
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
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<void>;
    }
}

export type ProgressControllerOptions = {
    'get': {
        readonly courseId: string
    }, 
    'updateProgress': {
        readonly chapterId: string, 
        readonly courseId: string
    }
}
