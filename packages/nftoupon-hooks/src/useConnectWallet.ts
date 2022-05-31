import isEmpty from 'lodash/isEmpty'
import { CONNECT_WALLET_URL, ERROR_IN_API } from '../common/constants';
import { fetcher } from '../common/helper';
import { loadingValues } from '../types/loading';
import { useConnectWalletReturn } from '../types/wallet';

type Props = {
    NFToupon_Key: string;
    loadingValues: loadingValues;
};

export async function useConnectWallet(props: Props ): Promise<useConnectWalletReturn> {
    const { NFToupon_Key, loadingValues } = props;
    let loading = { ...loadingValues, connect: true };
    let error = "";
    let isVisible = true;
    let xummPayload = null;

    try {
    const { payload } = await fetcher(NFToupon_Key, CONNECT_WALLET_URL);

        if (isEmpty(payload)) {
            xummPayload = null
            isVisible = false;
        }else {
            xummPayload = payload;
        }
    } catch (error) {
        error = ERROR_IN_API;
    }

    loading = { ...loadingValues, connect: true };
    return {
        loading, payload: xummPayload, error, isVisible,
    }
};

