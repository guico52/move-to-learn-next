import type {Executor} from '../';
import type {
    ApiResponse, 
    Mono, 
    MoveController_CompileDto, 
    MoveController_CompileResponse
} from '../model/static/';

export class MoveController {
    
    constructor(private executor: Executor) {}
    
    readonly compile: (options: MoveControllerOptions['compile']) => Promise<
        Mono<ApiResponse<MoveController_CompileResponse>>
    > = async(options) => {
        let _uri = '/api/move/compile';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<Mono<ApiResponse<MoveController_CompileResponse>>>;
    }
}

export type MoveControllerOptions = {
    'compile': {
        readonly body: MoveController_CompileDto
    }
}
