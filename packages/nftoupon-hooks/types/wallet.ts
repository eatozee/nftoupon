import { loadingValues } from "./loading";

export type useConnectWalletReturn = {
    loading: loadingValues, payload: any, error: string, isVisible: boolean,
}