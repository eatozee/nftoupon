import React from "react";
import isEmpty from "lodash/isEmpty";
import { CREATOR_SEND_DETAILS_URL, ERROR_IN_API } from "../common/constants";
import { fetcher } from "../common/helper";
import {
  MintCallback,
  MintOption,
  UseMintReturn,
  Wallet,
  XummPayload,
} from "../types/wallet";
import { signValidator } from "../common/wallet";

type Props = {
  NFToupon_Key: string;
};

export function useMint(props: Props): UseMintReturn {
  const { NFToupon_Key } = props;
  const [xummPayload, setXummPayload] = React.useState<XummPayload>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [walletPayload, setWalletPayload] = React.useState<Wallet>({
    address: null,
    error: null,
  });

  const mint = async (options: MintOption): Promise<MintCallback> => {
    let error = null;
    let mintPayload = null;
    const { base64String, walletAddress, textAreaValue } = options;

    if (isEmpty(textAreaValue.trim()) && !isEmpty(base64String)) {
      error = "Please add the description";
    } else if (isEmpty(base64String) && !isEmpty(textAreaValue.trim())) {
      error = "Please upload an image";
    } else if (isEmpty(textAreaValue.trim()) && isEmpty(base64String)) {
      error = "Empty text Area and Image";
    } else {
      setIsLoading(true);
      try {
        const options = {
          file: base64String,
          address: walletAddress,
          description: textAreaValue,
        };
        const { payload } = await fetcher(
          NFToupon_Key,
          CREATOR_SEND_DETAILS_URL,
          options
        );

        if (!isEmpty(payload)) {
          mintPayload = payload;
        }

        setXummPayload(mintPayload);
      } catch (e) {
        error = ERROR_IN_API;
      }
      setIsLoading(false);
    }

    return { payload: mintPayload, error };
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

  return { mint, walletPayload, loading: isLoading };
}
