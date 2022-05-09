//Common Constants for arbiter and creator
const CONNECT_WALLET_URL = `https://eatozee-crypto.app/api/nftoupon/connect`;
const PREVIEW_IMAGE_URL = `https://djfteveaaqqdylrqovkj.supabase.co/storage/v1/object/public/beta-eatozee-web/nft-free.webp`;
const ERROR_IN_API = "Something went wrong. Please try again later.";
const FAIL_SIGN = "Transaction failed to sign.";
const EXPIRED = "Transaction expired.";

const DEFAULT_PREVIEW_IMG_URL =
  "https://djfteveaaqqdylrqovkj.supabase.co/storage/v1/object/public/beta-eatozee-web/nft-free.webp";
const ACCEPT_OFFER_URL = `https://eatozee-crypto.app/api/nftoupon/offer/accept`;
const CREATOR_REJECT_OFFER_URL = `https://eatozee-crypto.app/api/nftoupon/creator/update`;
const CREATOR_SEND_DETAILS_URL = `https://eatozee-crypto.app/api/nftoupon/creator/mint`;
const GET_META_URL = `https://eatozee-crypto.app/api/nftoupon/getMeta`;
const CARGO_URL = `https://eatozee-crypto.app/api/nftoupon/cargo`;
const NFTOKEN_MINT_URL = `https://eatozee-crypto.app/api/nftoupon/creator/saveTokens`;
const NFTOKEN_ACCEPT_OFFER_URL = `https://eatozee-crypto.app/api/nftoupon/creator/update`;

// Arbiter constants
const NFTOKEN_CREATOR_OFFER_URL = `https://eatozee-crypto.app/api/nftoupon/merchant/update`;
const GET_ARBITER_DETAILS_URL = `https://eatozee-crypto.app/api/nftoupon/merchant`;
const ARBITER_BUY_URL = `https://eatozee-crypto.app/api/nftoupon/offer/buy`;

const GET_COLLECTIBLES = "https://eatozee-crypto.app/api/nftoupon/merchant/get";

export {
  CONNECT_WALLET_URL,
  PREVIEW_IMAGE_URL,
  ERROR_IN_API,
  FAIL_SIGN,
  EXPIRED,
  DEFAULT_PREVIEW_IMG_URL,
  ACCEPT_OFFER_URL,
  CREATOR_REJECT_OFFER_URL,
  CREATOR_SEND_DETAILS_URL,
  GET_META_URL,
  CARGO_URL,
  NFTOKEN_MINT_URL,
  NFTOKEN_ACCEPT_OFFER_URL,
  NFTOKEN_CREATOR_OFFER_URL,
  GET_ARBITER_DETAILS_URL,
  ARBITER_BUY_URL,
  GET_COLLECTIBLES,
};
