import React from "react";
import isEmpty from "lodash/isEmpty";
import { CREATOR_REJECT_OFFER_URL, ERROR_IN_API } from "../common/constants";
import { fetcher } from "../common/helper";
import {
  RejectCallback,
  RejectOption,
  UseRejectOfferReturn,
  Wallet,
  XummPayload,
} from "../types/wallet";
import { signValidator } from "../common/wallet";

type Props = {
  NFToupon_Key: string;
};

const DETAILS = {
  id: "",
  title: "",
  imageUrl: "",
  description: "",
  status: "",
  merchantCryptoWalletAddress: "",
  cryptoWalletAddress: "",
  date: "",
  offer: "",
  tokenId: "",
  tokenOfferIndex: "",
};

export function useRejectOffer(props: Props): UseRejectOfferReturn {
  const { NFToupon_Key } = props;
  const [xummPayload, setXummPayload] = React.useState<XummPayload>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [walletPayload, setWalletPayload] = React.useState<Wallet>({
    address: null,
    error: null,
  });

  const reject = async (options: RejectOption): Promise<RejectCallback> => {
    let error = null;
    const { id } = options;

    setIsLoading(true);
    try {
      const options = { status: "Declined", id };
      await fetcher(NFToupon_Key, CREATOR_REJECT_OFFER_URL, options);
    } catch (e) {
      error = ERROR_IN_API;
    }
    setIsLoading(false);

    return { payload: DETAILS, error, nftDetailsIndex: 0 };
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

  return { reject, walletPayload, loading: isLoading };
}
