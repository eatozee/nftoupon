import isEmpty from 'lodash/isEmpty'
import { CONNECT_WALLET_URL, ERROR_IN_API } from '../common/constants';
import { fetcher } from '../common/helper';
import { useConnectWalletReturn } from '../types/wallet';

type Props = {
    NFToupon_Key: string;
};

export async function useConnectWallet(props: Props ): Promise<useConnectWalletReturn> {
    const { NFToupon_Key } = props;
    let error = "";
    let xummPayload = null;

    try {
    const { payload } = await fetcher(NFToupon_Key, CONNECT_WALLET_URL);

        if (isEmpty(payload)) {
            xummPayload = null
        }else {
            xummPayload = payload;
        }
    } catch (error) {
        error = ERROR_IN_API;
    }

    return {
        payload: xummPayload, error
    }
};

