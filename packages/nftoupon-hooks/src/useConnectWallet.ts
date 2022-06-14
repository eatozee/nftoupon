import React from "react";
import isEmpty from "lodash/isEmpty";
import { CONNECT_WALLET_URL, ERROR_IN_API } from "../common/constants";
import { fetcher } from "../common/helper";
import { ConnectCallback, UseConnectWalletReturn, Wallet, XummPayload } from "../types/wallet";
import { signValidator } from "../common/wallet";

type Props = {
  NFToupon_Key: string;
};

export function useConnectWallet(props: Props): UseConnectWalletReturn {
  const { NFToupon_Key } = props;
  const [xummPayload, setXummPayload] = React.useState<XummPayload>(null);
  const [walletPayload, setWalletPayload] = React.useState<Wallet>({
    address: null,
    error: null,
  });

  const connect = async (): Promise<ConnectCallback> => {
    let xummPayload = null;

    try {
      const { payload } = await fetcher(NFToupon_Key, CONNECT_WALLET_URL);

      if (isEmpty(payload)) {
        xummPayload = null;
      } else {
        xummPayload = payload;
      }

      setXummPayload(xummPayload);
      return { qrCode: xummPayload?.refs?.qr_png, error: null };
    } catch (e) {
      return { qrCode: null, error: ERROR_IN_API };
    }
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
  }, [xummPayload, NFToupon_Key, signValidator]);

  return { connect, walletPayload };
}
