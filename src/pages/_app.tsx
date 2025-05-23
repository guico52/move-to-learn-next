import '@rainbow-me/rainbowkit/styles.css';
import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { createConfig, WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { config } from '../config/web3';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';
import { mainnet, sepolia } from 'wagmi/chains';
import { http } from 'wagmi';
import { okxWallet } from '@rainbow-me/rainbowkit/wallets';
import Head from 'next/head';
import RouteGuard from '@/components/RouteGuard';

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  
  const connectors = connectorsForWallets(
    [
      {
        groupName: '推荐',
        wallets: [okxWallet],
      },
    ],
    {
      appName: 'Move To Learn',
      projectId: 'YOUR_PROJECT_ID',
    }
  );

  const config = createConfig({
    connectors,
    chains: [mainnet, sepolia],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
  });

  return (
    <RouteGuard>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <Head>
              <link rel="icon" href="/assets/aptos.png" />
              <link rel="apple-touch-icon" href="/assets/aptos.png" />
            </Head>
            <Component {...pageProps} />
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4caf50',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#f44336',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </RouteGuard>
  );
}
