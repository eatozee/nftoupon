//Common Constants for arbiter and creator
const CONNECT_WALLET_URL = `https://eatozee-crypto.app/api/nftoupon/connect`;
const PREVIEW_IMAGE_URL = `https://djfteveaaqqdylrqovkj.supabase.co/storage/v1/object/public/beta-eatozee-web/nft-free.webp`;
const ERROR_IN_API = "Something went wrong. Please try again later.";
const FAIL_SIGN = "Transaction failed to sign.";
const EXPIRED = "Transaction expired.";
const CARGO_URL = `https://eatozee-crypto.app/api/nftoupon/cargo`;

//Constants for Arbiter
const NFTOKEN_CREATOR_OFFER_URL = `https://eatozee-crypto.app/api/nftoupon/merchant/update`;
const GET_ARBITER_DETAILS_URL = `https://eatozee-crypto.app/api/nftoupon/merchant`;
const ARBITER_BUY_URL = `https://eatozee-crypto.app/api/nftoupon/offer/buy`;

export {
    CONNECT_WALLET_URL,
    PREVIEW_IMAGE_URL,
    ERROR_IN_API,
    FAIL_SIGN,
    EXPIRED,
    NFTOKEN_CREATOR_OFFER_URL,
    GET_ARBITER_DETAILS_URL,
    ARBITER_BUY_URL,
    CARGO_URL
}