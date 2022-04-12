export type NFTouponPayload = {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  status: string;
  merchantCryptoWalletAddress?: string;
  cryptoWalletAddress?: string;
  tokenId?: string;
}[];

export interface ResponsePayload {
  uuid: string;
  refs: {
    qr_png: string;
    websocket_status: string;
  };
  imageUrl?: string;
}

export type Props = {
  id?: number;
  address?: string;
  title?: string;
  description?: string;
  status?: string;
  imageUrl?: string | undefined;
  date?: string;
  offer?: string;
  merchantCryptoWalletAddress?: string;
  transactionType?: string;
  tokenId?: string;
  src?: any;
};
