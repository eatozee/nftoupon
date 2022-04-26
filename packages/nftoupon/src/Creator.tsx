import React, { useEffect } from "react";
import {
  NextUIProvider,
  Button,
  Card,
  Divider,
  Input,
  Row,
  Spacer,
  Text,
  Textarea,
  Avatar,
  Grid,
  Container,
  Pagination,
  Image,
  Modal,
  Loading,
} from "@nextui-org/react";
import isEmpty from "lodash/isEmpty";
import { Send, ChevronLeft } from "react-iconly";
import { Header } from "./components/Header";
import confetti from "canvas-confetti";
import { Connect } from "./Connect";
import { Toaster, toast } from "react-hot-toast";
import { fetcher } from "./common/helper";
import {
  CONNECT_WALLET_URL,
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
} from "./common/constants";

const DETAILS = {
  id: 0,
  title: "",
  description: "",
  imageUrl: "",
  status: "",
  offer: "",
  date: "",
  tokenOfferIndex: "",
  merchantCryptoWalletAddress: "",
  visibility: false,
};

type ResponsePayload = {
  uuid: string;
  refs: {
    qr_png: string;
    websocket_status: string;
  };
  imageUrl: string;
};

type Props = {
  NFToupon_Key: string;
};

type NFTouponPayload = {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  status: string;
  merchantCryptoWalletAddress: string;
}[];

export const Creator = ({ NFToupon_Key }: Props) => {
  const [visible, setVisible] = React.useState(false);
  const closeHandler = () => setVisible(false);
  const [details, setDetails] = React.useState(DETAILS);
  const [xummPayload, setXummPayload] = React.useState<ResponsePayload | null>(
    null
  );
  const [walletAddress, setWalletAddress] = React.useState<string>("");
  const [transactionType, setTransactionType] = React.useState<string>("");

  const [charCounter, setCharCounter] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState<NFTouponPayload>([]);

  const [base64String, setBase64String] = React.useState<string | null>(null);
  const [imageURL, setImageURL] = React.useState<any>(DEFAULT_PREVIEW_IMG_URL);
  const [textAreaValue, setTextAreaValue] = React.useState<string>(""); //storing description input
  const [validation, setValidation] = React.useState<string>("");

  //Logic for refs.data in pagination where '4' is the refs.data per page
  const [currentPage, setCurrentPage] = React.useState(1);
  const indexOfLastPost = currentPage * 4;
  const indexOfFirstPost = indexOfLastPost - 4;
  const currentPosts: any =
    !isEmpty(data) && data.slice(indexOfFirstPost, indexOfLastPost);
  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleConfetti = () => {
    confetti({
      zIndex: 999,
      particleCount: 1000,
      spread: 180,
      origin: { y: 0.5 },
    });
  };

  const uploadFile = (event: any) => {
    const reader = new FileReader();
    reader.onload = async function () {
      /* Base64 is a binary-to-text encoding scheme used to 
			transport data. The encoding is necessary when the transfer 
			medium is not able to handle binary data. 
			This binary data is then translated to a text representation (base64) and transferred as text. */

      // base64 is an algorithm for encoding and decoding an object to ASCII format.
      const base64String: any = reader.result;

      setBase64String(base64String.split(",")[1]);
      setImageURL(base64String);
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const acceptOffer = async () => {
    setIsLoading(true);
    try {
      const options = {
        tokenOfferIndex: details.tokenOfferIndex,
        address: walletAddress,
      };
      const { payload } = await fetcher(
        NFToupon_Key,
        ACCEPT_OFFER_URL,
        options
      );

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

  const rejectOffer = async () => {
    setIsLoading(true);
    try {
      const options = { status: "Declined", id: details.id };
      await fetcher(NFToupon_Key, CREATOR_REJECT_OFFER_URL, options);
    } catch (error) {
      toast.error(ERROR_IN_API);
    }
    setIsLoading(false);
  };

  const sendDetails = async () => {
    if (isEmpty(textAreaValue.trim()) && !isEmpty(imageURL)) {
      setValidation("Empty Text Area");
    } else if (isEmpty(imageURL) && !isEmpty(textAreaValue.trim())) {
      setValidation("Empty Image");
    } else if (isEmpty(textAreaValue.trim()) && isEmpty(imageURL)) {
      setValidation("Both Empty");
    } else {
      setIsLoading(true);
      try {
        const options = {
          file: base64String,
          address: walletAddress,
        };
        const { payload } = await fetcher(
          NFToupon_Key,
          CREATOR_SEND_DETAILS_URL,
          options
        );

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
    }
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

  useEffect(() => {
    const getDetails = async () => {
      try {
        const options = { address: walletAddress };
        const { nftoupons } = await fetcher(
          NFToupon_Key,
          GET_META_URL,
          options
        );
        setData(nftoupons);
      } catch (error) {
        toast.error(ERROR_IN_API);
      }
    };
    if (!isEmpty(walletAddress)) {
      getDetails();
    }
  }, [walletAddress, transactionType, NFToupon_Key]);

  const signValidator = async (option: any, ws: WebSocket) => {
    try {
      const result = await fetcher(NFToupon_Key, CARGO_URL, option);
      setWalletAddress(result?.payload);
      setTransactionType(result?.tx_type);
      closeSocket(ws);
    } catch (error) {
      toast.error(ERROR_IN_API);
    }
  };

  useEffect(() => {
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
    try {
      if (transactionType === "NFTokenMint") {
        const saveTokens = async () => {
          const options = {
            address: walletAddress,
            title: "",
            description: textAreaValue,
            status: "Pending",
            imageUrl: xummPayload?.imageUrl,
          };
          await fetcher(NFToupon_Key, NFTOKEN_MINT_URL, options);
        };
        saveTokens();
        handleConfetti();
      } else if (transactionType === "NFTokenAcceptOffer") {
        const updateTokenStatus = async () => {
          const options = { status: "Accepted", id: details.id };
          await fetcher(NFToupon_Key, NFTOKEN_ACCEPT_OFFER_URL, options);
        };
        updateTokenStatus();
      }
    } catch (error) {
      toast.error(ERROR_IN_API);
    }
    if (
      transactionType === "NFTokenAcceptOffer" ||
      transactionType === "NFTokenMint"
    ) {
      // reset to default
      setTextAreaValue("");
      setDetails(DETAILS);
      setImageURL(DEFAULT_PREVIEW_IMG_URL);
      setTransactionType("");
      setValidation("");
    }
  }, [
    transactionType,
    walletAddress,
    details,
    textAreaValue,
    xummPayload,
    NFToupon_Key,
  ]);

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
                  {details.visibility ? (
                    <Button
                      auto
                      size={"sm"}
                      css={{ height: "40px", pl: "0px" }}
                      onClick={() => {
                        // reset the values
                        setTextAreaValue("");
                        setDetails(DETAILS);
                      }}
                      light
                      icon={<ChevronLeft set="light" />}
                    />
                  ) : (
                    <Text h4>NFToupon</Text>
                  )}
                </Grid>
                <Grid xs={4}>
                  <Header
                    walletAddress={walletAddress}
                    disConnectWallet={() => setWalletAddress("")}
                  />
                </Grid>
              </Grid.Container>
            </Card.Header>

            <Card shadow={false} css={{ borderRadius: "0" }}>
              <Card.Image
                showSkeleton
                src={isEmpty(details.imageUrl) ? imageURL : details.imageUrl}
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
                    {isEmpty(textAreaValue)
                      ? `Create a beautiful description for your NFT token.`
                      : textAreaValue}
                  </Text>
                </Row>
              </Card.Footer>
            </Card>

            <Divider />
            <Card.Body css={{ justifyContent: "center" }}>
              <Spacer y={1} />

              {isEmpty(details.description) && (
                <>
                  <Textarea
                    bordered
                    shadow={false}
                    color={
                      validation === "Empty Text Area" ||
                      validation === "Both Empty"
                        ? "error"
                        : "primary"
                    }
                    label="Description"
                    placeholder="Enter your amazing description."
                    helperText={
                      validation === "Empty Text Area" ||
                      validation === "Both Empty"
                        ? "Description is required"
                        : `${charCounter}/200`
                    }
                    helperColor={
                      validation === "Empty Text Area" ||
                      validation === "Both Empty"
                        ? "error"
                        : "primary"
                    }
                    readOnly={isEmpty(details.description) ? false : true}
                    value={
                      isEmpty(details.description)
                        ? textAreaValue
                        : details.description
                    }
                    onChange={(ev: any): void => {
                      const length = ev.target.value.length;
                      setValidation("");
                      if (length <= 200) {
                        setTextAreaValue(ev.target.value);
                        setCharCounter(length);
                      }
                    }}
                  />
                  <Spacer y={1.5} />
                </>
              )}

              {isEmpty(details.imageUrl) && (
                <>
                  <Input
                    hidden={true}
                    css={{
                      display: "none",
                    }}
                    id="upload"
                    type="file"
                    name="uploadFile"
                    onChange={(event) => uploadFile(event)}
                  />
                  <label
                    style={{
                      backgroundColor: "#FCD57A",
                      borderRadius: "12px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "10px",
                      cursor: "pointer",
                      height: "40px",
                      fontSize: "14px",
                    }}
                    htmlFor="upload"
                  >
                    Choose file
                  </label>
                  {validation === "Empty Image" ||
                  validation === "Both Empty" ? (
                    <Text css={{ ml: "10px" }} size={10} color="error">
                      Please upload a file.
                    </Text>
                  ) : null}
                </>
              )}

              <Spacer y={1} />

              {!isEmpty(details.offer) && (
                <>
                  <Row>
                    <Input
                      readOnly
                      width="100%"
                      required
                      label="Offer"
                      type="number"
                      labelRight="XRP"
                      initialValue={details.offer}
                    />
                    <Spacer y={0.5} />
                    <Input
                      readOnly
                      initialValue={details.date}
                      width="100%"
                      required
                      label="Date"
                    />
                  </Row>

                  <Spacer y={1} />
                </>
              )}

              {!isEmpty(details.id) && details.status !== "Declined" ? (
                <>
                  {details.status === "Pending" ||
                  details.status === "Rejected" ? (
                    <Text size={16}>Your offer is {details.status}</Text>
                  ) : (
                    <>
                      <Row>
                        <Button
                          size="sm"
                          color="success"
                          css={{ width: "100%", height: "40px" }}
                          onClick={acceptOffer}
                        >
                          {isLoading ? (
                            <Loading type="points" color="white" size="sm" />
                          ) : (
                            "Accept"
                          )}
                        </Button>
                        <Spacer y={0.5} />
                        <Button
                          size="sm"
                          color="error"
                          css={{ width: "100%", height: "40px" }}
                          onClick={rejectOffer}
                        >
                          {isLoading ? (
                            <Loading type="points" color="white" size="sm" />
                          ) : (
                            "Reject"
                          )}
                        </Button>
                      </Row>
                    </>
                  )}
                </>
              ) : (
                details.status !== "Pending" &&
                details.status !== "Declined" &&
                details.status !== "Rejected" && (
                  <Row justify="flex-end">
                    <Button
                      css={{ width: "50%", height: "40px" }}
                      iconRight={<Send set="bulk" />}
                      onClick={sendDetails}
                    >
                      {isLoading ? (
                        <Loading type="points" color="white" size="sm" />
                      ) : (
                        "NFToupon"
                      )}
                    </Button>
                  </Row>
                )
              )}
            </Card.Body>

            {data.length > 0 && (
              <>
                <Spacer y={1} />
                <Grid.Container gap={1} justify="center">
                  {currentPosts.map((post: any) => (
                    <Grid
                      lg={3}
                      justify="center"
                      key={`nftoupon-post-${post.id}`}
                    >
                      <Avatar
                        zoomed
                        pointer
                        squared
                        onClick={() => {
                          setTextAreaValue(post.description);
                          setDetails({
                            id: post.id,
                            title: post.title,
                            description: post.description,
                            imageUrl: post.imageUrl,
                            status: post.status,
                            offer: post.offer,
                            date: post.date,
                            tokenOfferIndex: post.tokenOfferIndex,
                            merchantCryptoWalletAddress:
                              post.merchantCryptoWalletAddress,
                            visibility: true,
                          });
                        }}
                        bordered
                        color={
                          post.status === "Pending"
                            ? "warning"
                            : post.status === "Offered"
                            ? "success"
                            : "error"
                        }
                        size="xl"
                        src={post.imageUrl}
                      />
                    </Grid>
                  ))}

                  <Spacer y={1} />
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
