import type {Executor} from '../';
import type {UserDto} from '../model/dto/';
import type {Dynamic_User} from '../model/dynamic/';
import type {
    ApiResponse, 
    AuthController_LoginDto, 
    Mono, 
    SaTokenInfo
} from '../model/static/';

export class AuthController {
    
    constructor(private executor: Executor) {}
    
    readonly getUserInfo: () => Promise<
        Mono<ApiResponse<UserDto['AuthController/USER']>>
    > = async() => {
        let _uri = '/api/auth/userinfo';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Mono<ApiResponse<UserDto['AuthController/USER']>>>;
    }
    
    readonly login: (options: AuthControllerOptions['login']) => Promise<
        Mono<ApiResponse<SaTokenInfo>>
    > = async(options) => {
        let _uri = '/api/auth/login';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<Mono<ApiResponse<SaTokenInfo>>>;
    }
    
    readonly logout: () => Promise<
        Mono<ApiResponse<Dynamic_User>>
    > = async() => {
        let _uri = '/api/auth/logout';
        return (await this.executor({uri: _uri, method: 'POST'})) as Promise<Mono<ApiResponse<Dynamic_User>>>;
    }
}

export type AuthControllerOptions = {
    'login': {
        readonly body: AuthController_LoginDto
    }, 
    'logout': {}, 
    'getUserInfo': {}
}
