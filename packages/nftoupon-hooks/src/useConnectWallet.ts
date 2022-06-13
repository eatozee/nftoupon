import isEmpty from "lodash/isEmpty";
import { CONNECT_WALLET_URL, ERROR_IN_API } from "../common/constants";
import { fetcher } from "../common/helper";
import { ConnectCallback, UseConnectWalletReturn } from "../types/wallet";

type Props = {
  NFToupon_Key: string;
};

export function useConnectWallet(props: Props): UseConnectWalletReturn {
  const { NFToupon_Key } = props;
  
  const connect = async (): Promise<ConnectCallback> => {
    let xummPayload = null;
    
    try {
      console.log('inside the connect function');
      const { payload } = await fetcher(NFToupon_Key, CONNECT_WALLET_URL);

      if (isEmpty(payload)) {
        xummPayload = null;
      } else {
        xummPayload = payload;
      }

      return { payload: xummPayload, error: "" };
    } catch (e) {
      return { payload: null, error: ERROR_IN_API };
    }
  };

  return connect;
}
