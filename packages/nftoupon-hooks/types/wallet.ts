export type useConnectWalletReturn = {
   payload: any, error: string, connect: (() => Promise<void>) | null
}