const TOKEN_NAME = "tokenName";
const TOKEN_VALUE = "tokenValue";
const WALLET_ADDRESS = "walletAddress";

export const setTokenName = (tokenName: string) => {
  localStorage.setItem(TOKEN_NAME, tokenName);
};

export const getTokenName = () => {
  return localStorage.getItem(TOKEN_NAME);
};

export const setTokenValue = (tokenValue: string) => {
  localStorage.setItem(TOKEN_VALUE, tokenValue);
};

export const getTokenValue = () => {
  return localStorage.getItem(TOKEN_VALUE);
};

export const setWalletAddress = (walletAddress: string) => {
  localStorage.setItem(WALLET_ADDRESS, walletAddress);
};

export const getWalletAddress = () => {
  return localStorage.getItem(WALLET_ADDRESS);
};

export const clearAll = () => {
  localStorage.clear();
};

export const clearLoginStore = () => {
  localStorage.removeItem(TOKEN_NAME);
  localStorage.removeItem(TOKEN_VALUE);
  localStorage.removeItem(WALLET_ADDRESS);
};

