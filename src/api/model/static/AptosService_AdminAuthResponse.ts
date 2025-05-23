export interface AptosService_AdminAuthResponse {
    readonly success: boolean;
    readonly signature: string;
    readonly publicKey: string;
    readonly authenticator: string;
    readonly signerAddress: string;
    readonly message: string;
}
