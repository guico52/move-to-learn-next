import type {Executor} from '../';
import type {MoveController_CompileDto} from '../model/static/';

export class MoveController {
    
    constructor(private executor: Executor) {}
    
    readonly compile: (options: MoveControllerOptions['compile']) => Promise<
        string
    > = async(options) => {
        let _uri = '/api/move/compile';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.param.code;
        _uri += _separator
        _uri += 'code='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<string>;
    }
}

export type MoveControllerOptions = {
    'compile': {
        readonly param: MoveController_CompileDto
    }
}
