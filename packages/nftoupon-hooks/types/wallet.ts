export type ConnectCallback = {
  payload: any | null;
  error: string | null;
};

export type UseConnectWalletReturn = () => Promise<ConnectCallback>;


