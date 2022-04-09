import React, { useEffect } from 'react';
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
} from '@nextui-org/react';
import isEmpty from 'lodash/isEmpty';
import { Send, ChevronLeft } from 'react-iconly';
import { Header } from './components/Header';
import confetti from 'canvas-confetti';
import { fetchCollectWallet } from './common/helper/fetchConnectWallet';
import { handleTransaction } from './common/helper/handleTransaction';
import {
  NFTouponPayload,
  ResponsePayload,
  Props,
} from './common/Types';

export const Creator = ({ NFToupon_Key }: Props) => {
  const [visible, setVisible] = React.useState(false);
  const closeHandler = () => setVisible(false);
  const [details, setDetails] = React.useState({
    id: 0,
    title: '',
    description: '',
    imageUrl: '',
    status: '',
    offer: '',
    date: '',
    tokenOfferIndex: '',
    merchantCryptoWalletAddress: '',
    visibility: false,
  });
  const [xummPayload, setXummPayload] =
    React.useState<ResponsePayload | null>(null);
  const [walletAddress, setWalletAddress] = React.useState<string>('');
  const [transactionType, setTransactionType] = React.useState<string>('');

  const [sendButtonDisabled, setSendButtonDisabled] = React.useState(true);
  const [data, setData] = React.useState<NFTouponPayload>([]);

  const [src, setSrc] = React.useState<any>(''); // initial src will be empty
  const [inputValue, setInputValue] = React.useState<string>(''); //storing title input
  const [textAreaValue, setTextAreaValue] = React.useState<string>(''); //storing description input

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
      const binaryData: any = reader.result;
      const byteString = atob(binaryData.split(',')[1]);
      setSrc(byteString);
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const acceptOffer = async () => {
    const response = await fetch(
      `https://eatozee-crypto.app/api/nftoupon/offer/accept`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'NFToupon-Key': NFToupon_Key,
        },
        body: JSON.stringify({
          tokenOfferIndex: details.tokenOfferIndex,
          address: walletAddress,
        }),
      }
    );
    const { payload } = await response.json();

    if (!isEmpty(payload)) {
      setXummPayload(payload);
      setVisible(true);
    } else {
      setXummPayload(null);
    }
  };

  const rejectOffer = async () => {
    await fetch('https://eatozee-crypto.app/api/nftoupon/creator/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'NFToupon-Key': NFToupon_Key,
      },
      body: JSON.stringify({
        status: 'Declined',
        id: details.id,
      }),
    });
  };

  const sendDetails = async () => {
    const response = await fetch(
      `https://eatozee-crypto.app/api/nftoupon/creator/mint`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'NFToupon-Key': NFToupon_Key,
        },
        body: JSON.stringify({
          file: src,
          address: walletAddress,
        }),
      }
    );
    const { payload } = await response.json();

    if (!isEmpty(payload)) {
      setXummPayload(payload);
      setVisible(true);
    } else {
      setXummPayload(null);
    }
  };

  const connectWallet = async () => {
    try {
      const { payload } = await fetchCollectWallet(
        NFToupon_Key
      );
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
    const getDetails = async () => {
      try {
        const respose = await fetch(
          'https://eatozee-crypto.app/api/nftoupon/getMeta',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'NFToupon-Key': NFToupon_Key,
            },
            body: JSON.stringify({
              address: walletAddress,
            }),
          }
        );
        const { nftoupons } = await respose.json();
        setData(nftoupons);
      } catch (error) {
        console.log('error', error);
      }
    };
    if (!isEmpty(walletAddress)) {
      getDetails();
    }
  }, [walletAddress, transactionType, 
    // NFToupon_Key
  ]);

  useEffect(() => {
    if (!isEmpty(xummPayload)) {
      const wsURL = xummPayload?.refs?.websocket_status;
      const ws = new WebSocket(wsURL || '');
      ws.onmessage = (event) => {
        const { opened, payload_uuidv4, signed, expired } = JSON.parse(
          event.data
        );
        if (opened) {
        } else if (expired) {
          closeSocket(ws);
        } else if (!isEmpty(payload_uuidv4) && !signed) {
          closeSocket(ws);
        } else if (signed) {
          fetch(`https://eatozee-crypto.app/api/nftoupon/cargo`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'NFToupon-Key': NFToupon_Key,
            },
            body: JSON.stringify({
              payload_uuidv4,
            }),
          })
            .then((res) => res.json())
            .then((json) => {
              setWalletAddress(json.payload);
              setSendButtonDisabled(false);
              setTransactionType(json.tx_type);
              closeSocket(ws);
            })
            .catch((err) => console.error('error:' + err));
        }
      };
    }
  }, [xummPayload, 
    // NFToupon_Key
  ]);

  useEffect(() => {
    if (transactionType === 'NFTokenMint') {
      handleTransaction(
        transactionType,
        NFToupon_Key,
        'https://eatozee-crypto.app/api/nftoupon/creator/saveTokens',
        {
          address: walletAddress,
          title: inputValue,
          description: textAreaValue,
          status: 'Pending',
          imageUrl: xummPayload?.imageUrl,
        }
      );
      handleConfetti();
    } else if (transactionType === 'NFTokenAcceptOffer') {
      handleTransaction(
        transactionType,
        NFToupon_Key,
        'https://eatozee-crypto.app/api/nftoupon/creator/update',
        {
          status: 'Created',
          id: details.id,
        }
      );
    }
  }, [
    transactionType,
    walletAddress,
    details,
    inputValue,
    textAreaValue,
    xummPayload,
    // NFToupon_Key,
  ]);

  return (
    <NextUIProvider>
      <Card
        css={{
          minHeight: '500px',
          minW: '330px',
          maxW: '400px',
          maxH: '650px',
        }}
      >
        <Card.Header>
          <Row justify="space-between" align="center">
            {details.visibility ? (
              <Button
                auto
                size={'sm'}
                css={{ height: '40px', pl: '0px' }}
                onClick={() =>
                  setDetails({
                    id: 0,
                    title: '',
                    description: '',
                    imageUrl: '',
                    status: '',
                    offer: '',
                    date: '',
                    tokenOfferIndex: '',
                    merchantCryptoWalletAddress: '',
                    visibility: false,
                  })
                }
                light
                icon={<ChevronLeft set="light" />}
              />
            ) : null}

            <Header
              walletAddress={walletAddress}
              closeHandler={closeHandler}
              visible={visible}
              connectWallet={connectWallet}
              xummPayload={xummPayload}
            />
          </Row>
        </Card.Header>
        <Divider />
        <Card.Body css={{ py: '$10' }}>
          {details.visibility ? (
            <>
              <Container display="flex" justify="center" fluid>
                <img height="180px" src={details.imageUrl} alt="NFT" />
              </Container>
              <Spacer y={0.5} />
              <Input
                readOnly
                width="100%"
                label="Title"
                initialValue={details.title}
              />
              <Spacer y={0.5} />
              <Textarea
                readOnly
                width="100%"
                label="Description"
                initialValue={details.description}
                maxRows={4}
              />
              <Spacer y={0.5} />
              <Grid.Container>
                <Row>
                  <Input
                    readOnly
                    width="100%"
                    required
                    label="Offer"
                    type="number"
                    labelRight="XRP"
                    min={1}
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
              </Grid.Container>
              <Spacer y={0.8} />

              <Row justify="space-around">
                {details.status === 'Pending' ? (
                  <>
                    <Button
                      size="sm"
                      color="success"
                      css={{ height: '40px' }}
                      disabled
                    >
                      Accept
                    </Button>
                    <Spacer y={0.5} />
                    <Button
                      size="sm"
                      color="error"
                      css={{ height: '40px' }}
                      disabled
                    >
                      Reject
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="xs"
                      color="success"
                      css={{ height: '40px' }}
                      onClick={acceptOffer}
                    >
                      Accept
                    </Button>
                    <Spacer y={0.5} />
                    <Button
                      size="xs"
                      color="error"
                      css={{ height: '40px' }}
                      onClick={rejectOffer}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </Row>
            </>
          ) : (
            <>
              <Spacer y={0.5} />
              <Input
                size="md"
                clearable
                labelPlaceholder="Title"
                type="text"
                value={inputValue}
                onChange={(ev: any): void => setInputValue(ev.target.value)}
              />
              <Spacer y={1.5} />
              <Textarea
                labelPlaceholder="Description"
                value={textAreaValue}
                onChange={(ev: any): void => setTextAreaValue(ev.target.value)}
              />
              <Spacer y={1.5} />
              <Input
                underlined
                clearable
                type="file"
                name="uploadFile"
                onChange={(event) => uploadFile(event)}
              />
              <Spacer y={1.5} />

              <Row justify="flex-end">
                <Button
                  auto
                  iconRight={<Send set="bulk" />}
                  onClick={sendDetails}
                  disabled={sendButtonDisabled}
                >
                  NFToupon
                </Button>
              </Row>
            </>
          )}
        </Card.Body>
        <Divider />

        {details.visibility ? null : (
          <>
            <Spacer y={0.5} />
            {data.length > 0 && (
              <>
                <Grid.Container gap={1} justify="center">
                  <Row justify="center">
                    {currentPosts.map((post: any) => (
                      <Grid lg={3}>
                        <Avatar
                          zoomed
                          pointer
                          squared
                          onClick={() =>
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
                            })
                          }
                          bordered
                          color={
                            post.status === 'Pending'
                              ? 'warning'
                              : post.status === 'Accepted'
                              ? 'success'
                              : 'error'
                          }
                          size="xl"
                          src={post.imageUrl}
                        />
                      </Grid>
                    ))}
                  </Row>

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
          </>
        )}

        <Card.Footer css={{ justifyContent: 'center' }}>
          <Text>© {`${new Date().getFullYear()}`} eatozee.</Text>
        </Card.Footer>
      </Card>
    </NextUIProvider>
  );
};
