export type ConnectCallback = {
  qrCode: string | null;
  error: string | null;
};

export type Wallet = {
  address: string | null;
  error: string | null;
}

export type UseConnectWalletReturn = {
  connect: () => Promise<ConnectCallback>;
  walletPayload: Wallet;
};

export type XummPayload = {
	uuid: string;
	refs: {
		qr_png: string;
		websocket_status: string;
	};
} | null;