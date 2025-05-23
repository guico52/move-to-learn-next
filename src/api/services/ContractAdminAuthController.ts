import type {Executor} from '../';
import type {
    ApiResponse, 
    AptosService_AdminAuthResponse, 
    AptosSignRequest, 
    Mono
} from '../model/static/';

export class ContractAdminAuthController {
    
    constructor(private executor: Executor) {}
    
    /**
     * Aptos交易签名接口
     * @parameter {ContractAdminAuthControllerOptions['signAptosTransaction']} options
     * - request 包含原始交易十六进制字符串的请求
     * @return 签名结果
     */
    readonly signAptosTransaction: (options: ContractAdminAuthControllerOptions['signAptosTransaction']) => Promise<
        Mono<ApiResponse<AptosService_AdminAuthResponse>>
    > = async(options) => {
        let _uri = '/api/contract/auth/aptos/sign';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<Mono<ApiResponse<AptosService_AdminAuthResponse>>>;
    }
}

export type ContractAdminAuthControllerOptions = {
    'signAptosTransaction': {
        /**
         * 包含原始交易十六进制字符串的请求
         */
        readonly body: AptosSignRequest
    }
}
