import React from "react";
import isEmpty from "lodash/isEmpty";
import { ARBITER_BUY_URL, ERROR_IN_API } from "../common/constants";
import { fetcher } from "../common/helper";
import {
  MakeCallback,
  MakeOption,
  UseMakeOfferReturn,
  Wallet,
  XummPayload,
} from "../types/wallet";
import { signValidator } from "../common/wallet";

type Props = {
  NFToupon_Key: string;
};

export function useMakeOffer(props: Props): UseMakeOfferReturn {
  const { NFToupon_Key } = props;
  const [xummPayload, setXummPayload] = React.useState<XummPayload>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [walletPayload, setWalletPayload] = React.useState<Wallet>({
    address: null,
    error: null,
  });

  const make = async (options: MakeOption): Promise<MakeCallback> => {
    let error = null;
    let makePayload = null;
    const { offer, expiryDate, merchantAddress, walletAddress, tokenId } =
      options;

    if (isEmpty(offer) && !isEmpty(expiryDate)) {
      error = "Please add the Offer";
    } else if (!isEmpty(offer) && isEmpty(expiryDate)) {
      error = "Please add expiry Date";
    } else if (isEmpty(offer) && isEmpty(expiryDate)) {
      error = "Empty Offer and Date";
    } else {
      setIsLoading(true);
      try {
        const options = {
          offer: offer,
          merchantCryptoWalletAddress: merchantAddress,
          address: walletAddress,
          tokenId: tokenId,
        };
        const { payload } = await fetcher(
          NFToupon_Key,
          ARBITER_BUY_URL,
          options
        );
        if (!isEmpty(payload)) {
          // double check with Dhruvin
          /* setSendProperties({
                    status: sendDetails.status,
                    expiryDate: sendDetails.expiryDate,
                    offer: sendDetails.offer,
                    cryptoWalletAddress: sendDetails.cryptoWalletAddress,
                }); */
          makePayload = payload;
          setXummPayload(payload);
        }
      } catch (e) {
        error = ERROR_IN_API;
      }
      setIsLoading(false);
    }

    return { payload: makePayload, error, nftDetailsIndex: 0 };
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

  return { make, walletPayload, loading: isLoading };
}
