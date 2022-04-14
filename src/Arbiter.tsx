import React, { useEffect } from 'react';
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
} from '@nextui-org/react';
import { Wallet, CloseSquare } from 'react-iconly';
import { Details } from './components/Details';
import isEmpty from 'lodash/isEmpty';
import { fetcher } from './common/helper';
import {
  BUY_POINT_URL,
  CARGO_URL,
  CONNECT_WALLET_URL,
  GET_MERCHANT_DETAILS_URL,
  NFTokenCreateOffer_URL,
  REJECT_OFFER_MERCHANT_URL,
} from './common/constants';

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
  const [transactionType, setTransactionType] = React.useState('');
  const [data, setData] = React.useState<NFTouponPayload>([]);
  const [lockParameter, setLockParameter] = React.useState(true);
  const [details, setDetails] = React.useState({
    id: 0,
    title: '',
    description: '',
    imageUrl: '',
    status: '',
    cryptoWalletAddress: '',
    tokenId: '',
  });
  const [sendProperties, setSendProperties] = React.useState({
    expiryDate: '',
    offer: '',
    cryptoWalletAddress: '',
    status: '',
  });
  const [xummPayload, setXummPayload] =
    React.useState<ResponsePayload | null>(null);
  const [walletAddress, setWalletAddress] = React.useState<string>('');
  const [visible, setVisible] = React.useState(false);
  const closeHandler = () => {
    setVisible(false);
  };

  //Logic for data in pagination where '4' is the data per page
  const [currentPage, setCurrentPage] = React.useState(1);
  const indexOfLastPost = currentPage * 4;
  const indexOfFirstPost = indexOfLastPost - 4;
  const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);
  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  const connectWallet = async () => {
    try {
      const { payload } = await fetcher(NFToupon_Key, CONNECT_WALLET_URL);
      if (!isEmpty(payload)) {
        setXummPayload(payload);
        setVisible(true);
      } else {
        setXummPayload(null);
      }
    } catch (error) {
      console.log('error ', error);
    }
  };

  const closeSocket = (ws: WebSocket) => {
    ws.close();
    setXummPayload(null);
    setVisible(false);
  };

  useEffect(() => {
    if (!isEmpty(xummPayload)) {
      const wsURL = xummPayload?.refs?.websocket_status;
      const ws = new WebSocket(wsURL || '');
      ws.onmessage = (event) => {
        const { opened, payload_uuidv4, signed, expired } = JSON.parse(
          event.data
        );
        if (opened) {
          // setLockParameter(false);
        } else if (expired) {
          closeSocket(ws);
        } else if (!isEmpty(payload_uuidv4) && !signed) {
          closeSocket(ws);
        } else if (signed) {
          const payload = { payload_uuidv4: payload_uuidv4 };
          fetcher(NFToupon_Key, CARGO_URL, payload)
            .then((res) => res.json())
            .then((json) => {
              setWalletAddress(json.payload);
              setTransactionType(json.tx_type);
              setLockParameter(false);
              closeSocket(ws);
            })
            .catch((err) => console.error('error: ' + err));
        }
      };
    }
  }, [xummPayload, NFToupon_Key]);

  useEffect(() => {
    if (transactionType === 'NFTokenCreateOffer') {
      const update = async () => {
        const payload = {
          id: details.id,
          status: sendProperties.status,
          date: sendProperties.expiryDate,
          offer: sendProperties.offer,
          merchantCryptoWalletAddress: walletAddress,
          transactionType,
          tokenId: details.tokenId,
        };

        await fetcher(NFToupon_Key, NFTokenCreateOffer_URL, payload);
      };

      update();
    }
  }, [transactionType, NFToupon_Key, details, sendProperties, walletAddress]);

  const rejectHandler = async () => {
    const payload = {
      id: details.id,
      status: 'Rejected',
      date: '',
      offer: '',
      merchantCryptoWalletAddress: walletAddress,
      transactionType: '',
    };

    await fetcher(NFToupon_Key, REJECT_OFFER_MERCHANT_URL, payload);
  };

  useEffect(() => {
    const getDetails = async () => {
      try {
        const { nftoupons } = await fetcher(
          NFToupon_Key,
          GET_MERCHANT_DETAILS_URL
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
        console.log('error', error);
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
    try {
      const payload = {
        offer: sendDetails.offer,
        merchantCryptoWalletAddress: walletAddress,
        address: sendDetails.cryptoWalletAddress,
        tokenId: sendDetails.tokenId,
      };

      const { result } = await fetcher(NFToupon_Key, BUY_POINT_URL, payload);
      if (!isEmpty(result)) {
        setSendProperties({
          status: sendDetails.status,
          expiryDate: sendDetails.expiryDate,
          offer: sendDetails.offer,
          cryptoWalletAddress: sendDetails.cryptoWalletAddress,
        });
        setXummPayload(result);
        setVisible(true);
      } else {
        setXummPayload(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <NextUIProvider>
      <Card
        css={{
          width: '400px',
        }}
      >
        <Card.Header>
          <Row align="center" justify="space-between">
            <Row align="center" gap={0} justify="flex-end">
              {isEmpty(walletAddress) ? (
                <Button
                  auto
                  light
                  color="primary"
                  onClick={connectWallet}
                  css={{ pr: '7px', pl: '10px' }}
                  icon={<Wallet />}
                />
              ) : (
                <>
                  <Row justify="flex-end" align="center">
                    <Text
                      size={12}
                      b
                      color="error"
                      css={{
                        width: '35%',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                      }}
                    >
                      {walletAddress}
                    </Text>
                    <Button
                      size="xs"
                      light
                      color="error"
                      onClick={() => {
                        setWalletAddress('');
                        setLockParameter(true);
                      }}
                      iconRight={<CloseSquare set={'bulk'} />}
                    />
                  </Row>
                </>
              )}
            </Row>

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
                    src={xummPayload?.refs?.qr_png || ''}
                    alt="qr_code"
                  />
                ) : (
                  <div>Something went wrong</div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button auto flat color="primary" onClick={closeHandler}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Row>
        </Card.Header>
        <Divider />
        <Card.Body css={{ py: '$10', alignItems: 'center' }}>
          {/* Coupon details for Arbiter */}
          {data.length > 0 ? (
            <Details
              id={details.id}
              description={details.description}
              imageUrl={details.imageUrl}
              title={details.title}
              status={details.status}
              cryptoWalletAddress={details.cryptoWalletAddress}
              tokenId={details.tokenId}
              onClick={(details) => {
                sendStatus(details);
              }}
              rejectHandler={() => {
                rejectHandler();
              }}
              lockParameter={lockParameter}
            />
          ) : (
            <div>No data Found</div>
          )}
        </Card.Body>
        <Divider />
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
                          title: post.title || '',
                          description: post.description || '',
                          imageUrl: post.imageUrl || '',
                          status: post.status || '',
                          cryptoWalletAddress: post.cryptoWalletAddress || '',
                          tokenId: post.tokenId || '',
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
                  size={'xs'}
                  css={{ pb: '10px' }}
                  onChange={changePage}
                />
              </Row>
            </Grid.Container>
            <Divider />
          </>
        )}

        <Card.Footer css={{ justifyContent: 'center' }}>
          <Text size={12}>Widget by eatozee</Text>
        </Card.Footer>
      </Card>
    </NextUIProvider>
  );
};
