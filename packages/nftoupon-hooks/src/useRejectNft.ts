import React from "react";
import isEmpty from "lodash/isEmpty";
import { ERROR_IN_API, NFTOKEN_CREATOR_OFFER_URL } from "../common/constants";
import { fetcher } from "../common/helper";
import {
  RejectNftCallback,
  RejectNftOption,
  UseRejectNftReturn,
  Wallet,
  XummPayload,
} from "../types/wallet";
import { signValidator } from "../common/wallet";

type Props = {
  NFToupon_Key: string;
};

export function useRejectNft(props: Props): UseRejectNftReturn {
  const { NFToupon_Key } = props;
  const [xummPayload, setXummPayload] = React.useState<XummPayload>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [walletPayload, setWalletPayload] = React.useState<Wallet>({
    address: null,
    error: null,
  });

  const reject = async (
    options: RejectNftOption
  ): Promise<RejectNftCallback> => {
    let error = null;
    let status = null;
    const { id, walletAddress } = options;

    setIsLoading(true);
    try {
      const options = {
        id: id,
        status: "Rejected",
        date: "",
        offer: "",
        merchantCryptoWalletAddress: walletAddress,
        transactionType: "",
      };
      await fetcher(NFToupon_Key, NFTOKEN_CREATOR_OFFER_URL, options);

      status = "success";
    } catch (e) {
      error = ERROR_IN_API;
    }
    setIsLoading(false);

    return { status, error };
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
