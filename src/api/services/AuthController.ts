import type {Executor} from '../';
import type {UserDto} from '../model/dto/';
import type {Dynamic_User} from '../model/dynamic/';
import type {ApiResponse, Mono} from '../model/static/';

export class AuthController {
    
    constructor(private executor: Executor) {}
    
    readonly getUserInfo: () => Promise<
        Mono<ApiResponse<UserDto['AuthController/USER']>>
    > = async() => {
        let _uri = '/api/auth/userinfo';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Mono<ApiResponse<UserDto['AuthController/USER']>>>;
    }
    
    readonly logout: () => Promise<
        Mono<ApiResponse<Dynamic_User>>
    > = async() => {
        let _uri = '/api/auth/logout';
        return (await this.executor({uri: _uri, method: 'POST'})) as Promise<Mono<ApiResponse<Dynamic_User>>>;
    }
}

export type AuthControllerOptions = {
    'logout': {}, 
    'getUserInfo': {}
}
