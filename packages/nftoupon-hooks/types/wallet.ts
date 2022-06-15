export type ConnectCallback = {
  qrCode: string | null;
  error: string | null;
};

export type Wallet = {
  address: string | null;
  error: string | null;
};

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

export type MintCallback = {
  payload: XummPayload | null;
  error: string | null;
};

export type MintOption = {
  base64String: string;
  walletAddress: string;
  textAreaValue: string;
};

export type UseMintReturn = {
  mint: (options: MintOption) => Promise<MintCallback>;
  walletPayload: Wallet;
  loading: boolean;
};

export type AcceptCallback = MintCallback & {
  nftDetailsIndex: number;
};

export type AcceptOption = {
  tokenOfferIndex: string;
  address: string;
};

export type UseAcceptOfferReturn = {
  accept: (options: AcceptOption) => Promise<AcceptCallback>;
  walletPayload: Wallet;
  loading: boolean;
};

export type RejectPayload = {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  status: string;
  merchantCryptoWalletAddress: string;
  cryptoWalletAddress: string;
  date: string;
  offer: string;
  tokenId: string;
  tokenOfferIndex: string;
};

export type RejectCallback = {
  payload: RejectPayload | null;
  error: string | null;
  nftDetailsIndex: number;
};

export type RejectOption = {
  id: string;
};

export type UseRejectOfferReturn = {
  reject: (options: RejectOption) => Promise<RejectCallback>;
  walletPayload: Wallet;
  loading: boolean;
};

export type MakeCallback = AcceptCallback;

export type MakeOption = {
  offer: string;
  expiryDate: string;
  merchantAddress: string;
  walletAddress: string;
  tokenId: string;
  status: string;
};

export type UseMakeOfferReturn = {
  make: (options: MakeOption) => Promise<MakeCallback>;
  walletPayload: Wallet;
  loading: boolean;
};

export type RejectNftCallback = {
  status: string | null;
  error: string | null;
};

export type RejectNftOption = {
  id: string;
  walletAddress: string;
};

export type UseRejectNftReturn = {
  reject: (options: RejectNftOption) => Promise<RejectNftCallback>;
  walletPayload: Wallet;
  loading: boolean;
};
