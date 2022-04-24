import React, { useEffect } from "react";
import {
  NextUIProvider,
  Button,
  Card,
  Divider,
  Row,
  Spacer,
  Text,
  Modal,
  Grid,
  Pagination,
  Avatar,
  Image,
  Container,
  Input,
  Loading,
} from "@nextui-org/react";
import isEmpty from "lodash/isEmpty";
import { Toaster, toast } from "react-hot-toast";
import {
  ERROR_IN_API,
  FAIL_SIGN,
  EXPIRED,
  CARGO_URL,
  CONNECT_WALLET_URL,
  NFTOKEN_CREATOR_OFFER_URL,
  GET_ARBITER_DETAILS_URL,
  ARBITER_BUY_URL,
} from "./common/constants";
import { fetcher } from "./common/helper";
import { Connect } from "./Connect";
import { Header } from "./components/Header";
type NFTouponPayload = {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  status: string;
  cryptoWalletAddress: string;
  tokenId: string;
}[];
interface ResponsePayload {
  uuid: string;
  refs: {
    qr_png: string;
    websocket_status: string;
  };
}
type Props = {
  NFToupon_Key: string;
};
export const Arbiter = ({ NFToupon_Key }: Props) => {
  const [transactionType, setTransactionType] = React.useState("");
  const [data, setData] = React.useState<NFTouponPayload>([]);
  const [lockParameter, setLockParameter] = React.useState(true);
  const [offer, setOffer] = React.useState("");
  const [expiryDate, setExpiryDate] = React.useState("");
  const [validation, setValidation] = React.useState("");
  const [imageURL, setImageURL] = React.useState<any>(
    "https://djfteveaaqqdylrqovkj.supabase.co/storage/v1/object/public/beta-eatozee-web/nft-free.webp"
  );
  let localDate = new Date().toLocaleDateString('fr-CA');
  const [details, setDetails] = React.useState({
    id: 0,
    title: "",
    description: "",
    imageUrl: "",
    status: "",
    cryptoWalletAddress: "",
    tokenId: "",
  });
  const [sendProperties, setSendProperties] = React.useState({
    expiryDate: "",
    offer: "",
    cryptoWalletAddress: "",
    status: "",
  });
  const [xummPayload, setXummPayload] = React.useState<ResponsePayload | null>(
    null
  );
  const [walletAddress, setWalletAddress] = React.useState<string>("");
  const [visible, setVisible] = React.useState(false);
  const closeHandler = () => {
    setVisible(false);
  };
  const [isLoading, setIsLoading] = React.useState(false);
  //Logic for data in pagination where '4' is the data per page
  const [currentPage, setCurrentPage] = React.useState(1);
  const indexOfLastPost = currentPage * 4;
  const indexOfFirstPost = indexOfLastPost - 4;
  const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);
  const changePage = (page: number) => {
    setCurrentPage(page);
  };
  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const { payload } = await fetcher(NFToupon_Key, CONNECT_WALLET_URL);
      if (!isEmpty(payload)) {
        setXummPayload(payload);
        setVisible(true);
      } else {
        setXummPayload(null);
      }
    } catch (error) {
      toast.error(ERROR_IN_API);
    }
    setIsLoading(false);
  };
  const closeSocket = (ws: WebSocket) => {
    ws.close();
    setXummPayload(null);
    setVisible(false);
  };
  const signValidator = async (option: any, ws: WebSocket) => {
    const result = await fetcher(NFToupon_Key, CARGO_URL, option);
    setWalletAddress(result?.payload);
    setTransactionType(result?.tx_type);
    setLockParameter(false);
    closeSocket(ws);
  };
  useEffect(() => {
    console.log(localDate);
    if (!isEmpty(xummPayload)) {
      const wsURL = xummPayload?.refs?.websocket_status;
      const ws = new WebSocket(wsURL || "");
      ws.onmessage = (event) => {
        const { opened, payload_uuidv4, signed, expired } = JSON.parse(
          event.data
        );
        if (opened) {
        } else if (expired) {
          closeSocket(ws);
          toast.error(EXPIRED);
        } else if (!isEmpty(payload_uuidv4) && !signed) {
          closeSocket(ws);
          toast.error(FAIL_SIGN);
        } else if (signed) {
          const option = { payload_uuidv4 };
          signValidator(option, ws);
        }
      };
    }
  }, [xummPayload, NFToupon_Key]);

  useEffect(() => {
    if (transactionType === "NFTokenCreateOffer") {
      setIsLoading(true);
      try {
        const update = async () => {
          const options = {
            id: details.id,
            status: sendProperties.status,
            date: sendProperties.expiryDate,
            offer: sendProperties.offer,
            merchantCryptoWalletAddress: walletAddress,
            transactionType,
            tokenId: details.tokenId,
          };
          await fetcher(NFToupon_Key, NFTOKEN_CREATOR_OFFER_URL, options);
        };
        update();
      } catch (error) {
        toast.error(ERROR_IN_API);
      }
      setIsLoading(false);
    }
  }, [transactionType, NFToupon_Key, details, sendProperties, walletAddress]);
  const rejectHandler = async () => {
    try {
      const options = {
        id: details.id,
        status: "Rejected",
        date: "",
        offer: "",
        merchantCryptoWalletAddress: walletAddress,
        transactionType: "",
      };
      await fetcher(NFToupon_Key, NFTOKEN_CREATOR_OFFER_URL, options);
    } catch (error) {
      toast.error(ERROR_IN_API);
    }
  };

  useEffect(() => {
    const getDetails = async () => {
      try {
        const { nftoupons } = await fetcher(
          NFToupon_Key,
          GET_ARBITER_DETAILS_URL
        );
        setData(nftoupons);
        nftoupons.length > 0 &&
          setDetails({
            id: nftoupons[0].id,
            title: nftoupons[0].title,
            description: nftoupons[0].description,
            imageUrl: nftoupons[0].imageUrl,
            status: nftoupons[0].status,
            tokenId: nftoupons[0].tokenId,
            cryptoWalletAddress: nftoupons[0].cryptoWalletAddress,
          });
      } catch (error) {
        toast.error(ERROR_IN_API);
      }
    };
    getDetails();
  }, [transactionType, NFToupon_Key]);

  const sendStatus = async (sendDetails: {
    id: number;
    status: string;
    expiryDate: string;
    offer: string;
    cryptoWalletAddress: string;
    tokenId: string;
  }) => {
    if (isEmpty(offer) && !isEmpty(expiryDate)) {
      setValidation("Empty Offer");
    } else if (!isEmpty(offer) && isEmpty(expiryDate)) {
      setValidation("Empty Date");
    } else if (isEmpty(offer) && isEmpty(expiryDate)) {
      setValidation("Both Empty");
    } else {
      setIsLoading(true);
      try {
        const options = {
          offer: sendDetails.offer,
          merchantCryptoWalletAddress: walletAddress,
          address: sendDetails.cryptoWalletAddress,
          tokenId: sendDetails.tokenId,
        };
        const { payload } = await fetcher(
          NFToupon_Key,
          ARBITER_BUY_URL,
          options
        );
        if (!isEmpty(payload)) {
          setSendProperties({
            status: sendDetails.status,
            expiryDate: sendDetails.expiryDate,
            offer: sendDetails.offer,
            cryptoWalletAddress: sendDetails.cryptoWalletAddress,
          });
          setXummPayload(payload);
          setVisible(true);
        } else {
          setXummPayload(null);
        }
      } catch (error) {
        toast.error(ERROR_IN_API);
      }
      setIsLoading(false);
    }
  };

  return (
    <NextUIProvider>
      <Container
        display="flex"
        justify="center"
        css={{
          minHeight: "500px",
          width: "410px",
        }}
      >
        <Toaster
          containerStyle={{
            marginTop: "20px",
            position: "absolute",
          }}
        />

        {isEmpty(walletAddress) ? (
          <Connect
            walletAddress={walletAddress}
            closeHandler={closeHandler}
            visible={visible}
            connectWallet={connectWallet}
            xummPayload={xummPayload}
            isLoading={isLoading}
          />
        ) : (
          <Card>
            <Card.Header>
              <Grid.Container justify="flex-start" alignItems="center">
                <Grid xs={8}>
                  <Text h4>NFToupon</Text>
                </Grid>
                <Grid xs={4}>
                  <Header
                    walletAddress={walletAddress}
                    disConnectWallet={() => setWalletAddress("")}
                  />
                </Grid>
              </Grid.Container>
            </Card.Header>

            {/* Coupon details for Arbiter */}
            {data.length > 0 ? (
              <>
                <Card shadow={false} css={{ borderRadius: "0" }}>
                  <Card.Image
                    showSkeleton
                    src={
                      isEmpty(details.imageUrl) ? imageURL : details.imageUrl
                    }
                    height={200}
                    width="100%"
                    alt="NFT Preview"
                  />
                  <Card.Footer
                    blur
                    css={{
                      minHeight: "40px",
                      borderRadius: "0",
                      position: "absolute",
                      bgBlur: "#EAEAEA",
                      borderTop:
                        "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
                      bottom: 0,
                      zIndex: 1,
                    }}
                  >
                    <Row>
                      <Text
                        size={14}
                        css={{ color: "$accents4", fontWeight: "$semibold" }}
                      >
                        {details.description}
                      </Text>
                    </Row>
                  </Card.Footer>
                </Card>
                <Spacer y={0.5} />
                <Row justify="flex-end" align="center">
                  <Input
                    required
                    label="Offer"
                    type="number"
                    labelRight="XRP"
                    min={1}
                    width="100%"
                    initialValue={"1"}
                    onChange={(e) => {
                      setOffer(e.target.value);
                      setValidation("");
                    }}
                    readOnly={lockParameter}
                    helperText={
                      validation === "Empty Offer" ||
                      validation === "Both Empty"
                        ? "Offer is required."
                        : ""
                    }
                    helperColor={
                      validation === "Empty Offer" ||
                      validation === "Both Empty"
                        ? "error"
                        : "primary"
                    }
                  />
                  <Spacer x={2} />
                  <Input
                    readOnly={lockParameter}
                    width="100%"
                    required
                    label="Expiry Date"
                    type="date"
                    min={localDate}
                    helperText={
                      validation === "Empty Date" || validation === "Both Empty"
                        ? "Date is required."
                        : ""
                    }
                    helperColor={
                      validation === "Empty Date" || validation === "Both Empty"
                        ? "error"
                        : "primary"
                    }
                    onChange={(e) => {
                      setExpiryDate(e.target.value);
                      setValidation("");
                    }}
                  />
                </Row>
                <Spacer y={1.5} />
                <Row>
                  <Button
                    css={{ height: "40px", width: "100%", minWidth: 0 }}
                    color="success"
                    onClick={() => {
                      sendStatus({
                        id: details.id,
                        status: "Offered",
                        expiryDate: expiryDate,
                        offer: offer,
                        cryptoWalletAddress: details.cryptoWalletAddress,
                        tokenId: details.tokenId,
                      });
                    }}
                    disabled={lockParameter}
                  >
                    {isLoading ? (
                      <Loading type="points" color="white" size="sm" />
                    ) : (
                      "Make Offer"
                    )}
                  </Button>
                  <Spacer x={2} />
                  <Button
                    css={{ height: "40px", width: "100%", minWidth: 0 }}
                    color="error"
                    onClick={rejectHandler}
                    disabled={lockParameter}
                  >
                    Reject
                  </Button>
                </Row>
              </>
            ) : (
              <div>No data Found</div>
            )}
            <Spacer y={0.5} />
            {data.length > 0 && (
              <>
                <Grid.Container gap={1} justify="center">
                  {/* Avatars section */}
                  <Row justify="center">
                    {currentPosts.map((post) => (
                      <Grid key={post.id} lg={3}>
                        <Avatar
                          zoomed
                          pointer
                          squared
                          bordered
                          onClick={() =>
                            setDetails({
                              id: post.id || 0,
                              title: post.title || "",
                              description: post.description || "",
                              imageUrl: post.imageUrl || "",
                              status: post.status || "",
                              cryptoWalletAddress:
                                post.cryptoWalletAddress || "",
                              tokenId: post.tokenId || "",
                            })
                          }
                          size="xl"
                          src={post.imageUrl}
                        />
                      </Grid>
                    ))}
                  </Row>
                  <Spacer y={0.5} />
                  <Row justify="center">
                    <Pagination
                      rounded
                      onlyDots
                      total={Math.ceil(data.length / 4)}
                      size={"xs"}
                      css={{ pb: "10px" }}
                      onChange={changePage}
                    />
                  </Row>
                </Grid.Container>
                <Divider />
              </>
            )}
            <Card.Footer
              css={{
                justifyContent: "center",
              }}
            >
              <Text
                size="14px"
                css={{
                  display: "flex",
                  alignItems: "center",
                  color: "$gray300",
                }}
              >
                <Image
                  width={32}
                  height={23}
                  css={{ filter: "grayScale(50%)" }}
                  alt="footer logo"
                  src="https://djfteveaaqqdylrqovkj.supabase.co/storage/v1/object/public/beta-eatozee-web/banner-resized-img.png"
                />
                widget by
                <Spacer x={0.2} />
                <Text b>eatozee</Text>
              </Text>
            </Card.Footer>
          </Card>
        )}
        <Modal
          closeButton
          aria-labelledby="modal-title"
          open={visible}
          onClose={closeHandler}
        >
          <Modal.Body>
            {!isEmpty(xummPayload) ? (
              <Image
                width="100%"
                height="100%"
                src={xummPayload?.refs?.qr_png || ""}
                alt="qr_code"
              />
            ) : (
              <div>Something went wrong</div>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </NextUIProvider>
  );
};
