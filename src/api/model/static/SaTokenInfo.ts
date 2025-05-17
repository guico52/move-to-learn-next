export interface SaTokenInfo {
    readonly tokenName: string;
    readonly tokenValue: string;
    readonly isLogin: boolean;
    readonly loginType: string;
    readonly tokenTimeout: number;
    readonly sessionTimeout: number;
    readonly tokenSessionTimeout: number;
    readonly tokenActiveTimeout: number;
    readonly loginDevice: string;
    readonly tag: string;
}
