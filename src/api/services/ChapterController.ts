import type {Executor} from '../';
import type {Dynamic_Chapter} from '../model/dynamic/';
import type {ApiResponse, Mono} from '../model/static/';

export class ChapterController {
    
    constructor(private executor: Executor) {}
    
    readonly getAllChapters: () => Promise<
        Mono<ApiResponse<ReadonlyArray<Dynamic_Chapter>>>
    > = async() => {
        let _uri = '/api/chapters/';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Mono<ApiResponse<ReadonlyArray<Dynamic_Chapter>>>>;
    }
    
    readonly getChapterById: (options: ChapterControllerOptions['getChapterById']) => Promise<
        Mono<ApiResponse<Dynamic_Chapter | undefined>>
    > = async(options) => {
        let _uri = '/api/chapters/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Mono<ApiResponse<Dynamic_Chapter | undefined>>>;
    }
}

export type ChapterControllerOptions = {
    'getAllChapters': {}, 
    'getChapterById': {
        readonly id: string
    }
}
