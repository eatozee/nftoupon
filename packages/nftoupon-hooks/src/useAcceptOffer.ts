import React from "react";
import isEmpty from "lodash/isEmpty";
import { ACCEPT_OFFER_URL, ERROR_IN_API } from "../common/constants";
import { fetcher } from "../common/helper";
import {
  AcceptCallback,
  AcceptOption,
  UseAcceptOfferReturn,
  Wallet,
  XummPayload,
} from "../types/wallet";
import { signValidator } from "../common/wallet";

type Props = {
  NFToupon_Key: string;
};

export function useAcceptOffer(props: Props): UseAcceptOfferReturn {
  const { NFToupon_Key } = props;
  const [xummPayload, setXummPayload] = React.useState<XummPayload>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [walletPayload, setWalletPayload] = React.useState<Wallet>({
    address: null,
    error: null,
  });

  const accept = async (options: AcceptOption): Promise<AcceptCallback> => {
    let error = null;
    let acceptPayload = null;
    const { tokenOfferIndex, address } = options;

    setIsLoading(true);
    try {
      const options = {
        tokenOfferIndex,
        address,
      };
      const { payload } = await fetcher(
        NFToupon_Key,
        ACCEPT_OFFER_URL,
        options
      );

      if (!isEmpty(payload)) {
        acceptPayload = payload;
      }

      setXummPayload(payload);
    } catch (e) {
      error = ERROR_IN_API;
    }

    setIsLoading(false);

    return { payload: acceptPayload, error, nftDetailsIndex: 0 };
  };

  React.useEffect(() => {
    if (!isEmpty(xummPayload)) {
      const wsURL = xummPayload?.refs?.websocket_status;
      const ws = new WebSocket(wsURL || "");

      ws.onmessage = async (event) => {
        const { payload_uuidv4, signed, expired } = JSON.parse(event.data);

        if (signed) {
          const option = { payload_uuidv4 };
          const { address, error } = await signValidator(NFToupon_Key, option);
          setWalletPayload({ address, error });
          ws.close();
        } else if (expired || (!isEmpty(payload_uuidv4) && !signed)) {
          setXummPayload(null);
          setWalletPayload({ address: null, error: ERROR_IN_API });
          ws.close();
        }
      };
    }
  }, [xummPayload, NFToupon_Key]);

  return { accept, walletPayload, loading: isLoading };
}
