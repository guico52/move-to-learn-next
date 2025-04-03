import { Chain, Wallet, getWalletConnectConnector } from '@rainbow-me/rainbowkit';
import { InjectedConnector } from 'wagmi/connectors/injected';

interface OKXWalletOptions {
  projectId: string;
}

declare global {
  interface Window {
    okxwallet?: any;
  }
}

export const okxWallet = ({ projectId }: OKXWalletOptions): Wallet => ({
  id: 'okx',
  name: 'OKX Wallet',
  iconUrl: 'https://raw.githubusercontent.com/Dapp-Learning-DAO/Dapp-Learning-WalletIcon/main/images/okx.png',
  iconBackground: '#000',
  downloadUrls: {
    android: 'https://www.okx.com/download',
    ios: 'https://www.okx.com/download',
    chrome: 'https://www.okx.com/download/okx-wallet',
    qrCode: 'https://www.okx.com/download',
  },
  createConnector: ({ chains }) => {
    const connector = typeof window !== 'undefined' && window.okxwallet
      ? new InjectedConnector({
          chains,
          options: {
            name: 'OKX Wallet',
            getProvider: () => window.okxwallet,
          },
        })
      : getWalletConnectConnector({ projectId, chains });

    return {
      connector,
      mobile: {
        getUri: async () => {
          const provider = await connector.getProvider();
          return provider.connector.uri;
        },
      },
      qrCode: {
        getUri: async () => {
          const provider = await connector.getProvider();
          return provider.connector.uri;
        },
        instructions: {
          learnMoreUrl: 'https://www.okx.com/web3',
          steps: [
            {
              description: '我们建议将 OKX Wallet 安装为浏览器扩展',
              step: '安装',
              title: '安装 OKX Wallet',
            },
            {
              description: '确保您已经创建或导入了钱包',
              step: '创建',
              title: '创建或导入钱包',
            },
            {
              description: '点击上面的连接按钮连接您的钱包',
              step: '连接',
              title: '连接钱包',
            },
          ],
        },
      },
    };
  },
}); 