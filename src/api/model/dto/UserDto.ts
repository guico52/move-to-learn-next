export type UserDto = {
    'AuthController/USER': {
        /**
         * id
         */
        readonly id: string;
        /**
         * lastLogin
         */
        readonly lastLogin: string;
        /**
         * createdAt
         */
        readonly createdAt: string;
        /**
         * updatedAt
         */
        readonly updatedAt: string;
        /**
         * chainId
         */
        readonly chainId: number;
        /**
         * firstLogin
         */
        readonly firstLogin: string;
        /**
         * isInitialized
         */
        readonly isInitialized: boolean;
        /**
         * profileId
         */
        readonly profileId?: string | undefined;
        /**
         * walletAddress
         */
        readonly walletAddress: string;
    }
}
