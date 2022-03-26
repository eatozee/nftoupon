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
import { CardHeader } from './components/CardHeader';

interface CreatorProps {
  xummConfig: {
    XUMM_APIKEY: String;
    XUMM_APISECRET: String;
  };
}

interface ResponsePayload {
  uuid: string;
  refs: {
    qr_png: string;
    websocket_status: string;
  };
}

type prop = {
  data: { id: number; title: string; description: string; img: string }[];
  XUMM_APIKEY: String;
};

export const Creator = (props: CreatorProps, refs : prop) => {
  const xummLogo = require('../assets/xumm.svg') as string;
  const [visible, setVisible] = React.useState(false);
  const closeHandler = () => setVisible(false);
  const { xummConfig } = props;
  const { XUMM_APIKEY, XUMM_APISECRET } = xummConfig;
  
  refs.data = [
    {
      id: 1,
      title: "Creator's Title 1",
      description: "This will replace the creator's Description 1",
      img: 'https://ipfs.io/ipfs/bafkreif265ttbl74nraasybb4hgmaedb6zrqfl2ikms52p4go4ry3f3k5i',
    },
    {
      id: 2,
      title: "Creator's Title 2",
      description: "This will replace the creator's Description 2",
      img: 'https://ipfs.io/ipfs/bafkreiavd46byllzmkgdhakfgu635nqffzwsavrd4qmgxnvomfz556chvi',
    },
    {
      id: 3,
      title: "Creator's Title 3",
      description: "This will replace the creator's Description 3",
      img: 'https://ipfs.io/ipfs/bafkreihzqqyugpckf7gs5ixyxslzffqmm5gy2tz4o6ec2kuvwfqq3kgply',
    },
    {
      id: 4,
      title: "Creator's Title 4",
      description: "This will replace the creator's Description 4",
      img: 'https://ipfs.io/ipfs/bafkreif265ttbl74nraasybb4hgmaedb6zrqfl2ikms52p4go4ry3f3k5i',
    },
    {
      id: 5,
      title: "Creator's Title 5",
      description: "This will replace the creator's Description 3",
      img: 'https://ipfs.io/ipfs/bafkreihzqqyugpckf7gs5ixyxslzffqmm5gy2tz4o6ec2kuvwfqq3kgply',
    },
    {
      id: 6,
      title: "Creator's Title 6",
      description: "This will replace the creator's Description 3",
      img: 'https://ipfs.io/ipfs/bafkreiavd46byllzmkgdhakfgu635nqffzwsavrd4qmgxnvomfz556chvi',
    },
    {
      id: 7,
      title: "Creator's Title 7",
      description: "This will replace the creator's Description 3",
      img: 'https://ipfs.io/ipfs/bafkreihzqqyugpckf7gs5ixyxslzffqmm5gy2tz4o6ec2kuvwfqq3kgply',
    },
    {
      id: 8,
      title: "Creator's Title 8",
      description: "This will replace the creator's Description 3",
      img: 'https://ipfs.io/ipfs/bafkreif265ttbl74nraasybb4hgmaedb6zrqfl2ikms52p4go4ry3f3k5i',
    },
  ];
  //Logic for refs.data in pagination where '4' is the refs.data per page
  const [currentPage, setCurrentPage] = React.useState(1);
  const indexOfLastPost = currentPage * 4;
  const indexOfFirstPost = indexOfLastPost - 4;
  const currentPosts = refs.data.slice(indexOfFirstPost, indexOfLastPost);
  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  const [Details, setDetails] = React.useState({
    id: 0,
    title: '',
    description: '',
    img: '',
    visibilty: false,
  });
  const [xummPayload, setXummPayload] =
    React.useState<ResponsePayload | null>(null);
  const [xummStatus, setXummStatus] = React.useState('idle');
  const [transactionType, setTransactionType] = React.useState('');
  const [walletAddress, setWalletAddress] = React.useState({
    profileWalletAddress: '',
    connectedWalletAddress: '',
  });

  const connectWallet = async () => {
    // just a placeholder will change with the real one
    try {
      const response = await fetch(
        `https://eatozee-crypto.app/api/nftoupon/connect`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'NFToupon-Key': '36feff68-ae2a-46a1-9719-20a3fd5e633d',
          },
          body: JSON.stringify({
            XUMM_APIKEY: '9d8fe7cf-bff0-46f3-87fc-a8c4642f4d46',
            XUMM_APISECRET: 'fdefb301-2849-4406-b856-5f27cbb93987',
          }),
        }
      );
      const { payload } = await response.json();

      if (!isEmpty(payload)) {
        // ws.onmessage = (event) => {
        //   console.log(event.data);
        // };
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
        console.log(event.data);
        if (opened) {
          setXummStatus('connected');
        } else if (expired) {
          setXummStatus('expired');
          closeSocket(ws);
        } else if (!isEmpty(payload_uuidv4) && !signed) {
          setXummStatus('declined');
          closeSocket(ws);
        } else if (signed) {
          setXummStatus('verifying');

          fetch(`https://eatozee-crypto.app/api/nftoupon/payload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              XUMM_APIKEY,
              XUMM_APISECRET,
              payload_uuidv4,
            }),
          })
            .then((res) => res.json())
            .then((json) => {
              setXummStatus('idle');
              setWalletAddress(json.payload);
              setTransactionType(json.tx_type);
              closeSocket(ws);
            })
            .catch((err) => console.error('error:' + err));
        }
      };
    }
  });
  return (
    <NextUIProvider>
      <Card css={{ mw: '300px', mh: '650px' }}>
        <Card.Header>
          <Row justify="space-between" align="center">
            {Details.visibilty ? (
              <Button
                auto
                size={'sm'}
                css={{ height: '40px', pl: '0px' }}
                onClick={() =>
                  setDetails({
                    id: 0,
                    title: '',
                    description: '',
                    img: '',
                    visibilty: false,
                  })
                }
                light
                icon={<ChevronLeft set="light" />}
              />
            ) : null}

            <CardHeader
              closeHandler={closeHandler}
              visible={visible}
              connectWallet={connectWallet}
              xummPayload={xummPayload} /> 

          </Row>
        </Card.Header>
        <Divider />
        <Card.Body css={{ py: '$10' }}>
          {Details.visibilty ? (
            <>
              <Container display="flex" justify="center" fluid>
                <img
                  height="180px"
                  src={Details.img}
                  alt="Creator's NFT image"
                />
              </Container>
              <Spacer y={0.5} />
              <Input
                readOnly
                width="100%"
                label="Title"
                initialValue={Details.title}
              />
              <Spacer y={0.5} />
              <Textarea
                readOnly
                width="100%"
                label="Description"
                initialValue={Details.description}
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
                    initialValue={'1'}
                  />
                  <Spacer y={0.5} />
                  <Input readOnly width="100%" required label="Date" />
                </Row>
              </Grid.Container>
              <Spacer y={0.8} />
              <Row justify="space-around">
                <Button size="xs" color="success" css={{ height: '40px' }}>
                  Generate NFToupon
                </Button>
                <Spacer y={0.5} />
                <Button size="xs" color="error" css={{ height: '40px' }}>
                  Reject
                </Button>
              </Row>
            </>
          ) : (
            <>
              <Spacer y={0.5} />
              <Input size="md" clearable labelPlaceholder="Title" />
              <Spacer y={1.5} />
              <Textarea labelPlaceholder="Description" />
              <Spacer y={1.5} />
              <Input underlined clearable type="file" />
              <Spacer y={1.5} />
              <Row justify="flex-end">
                <Button auto iconRight={<Send set="bulk" />}>
                  Send
                </Button>
              </Row>
            </>
          )}
        </Card.Body>

        {Details.visibilty ? null : (
          <>
            <Divider />
            <Spacer y={0.5} />
            <Grid.Container gap={1} justify="center">
              <Row justify="center">
                {currentPosts.map((post) => (
                  <Grid key={post.id} lg={3}>
                    <Avatar
                      zoomed
                      pointer
                      squared
                      key={post.id}
                      onClick={() =>
                        setDetails({
                          id: post.id,
                          title: post.title,
                          description: post.description,
                          img: post.img,
                          visibilty: true,
                        })
                      }
                      bordered
                      color="success"
                      size="xl"
                      src={post.img}
                    />
                  </Grid>
                ))}
              </Row>

              <Row justify="center">
                <Pagination
                  rounded
                  onlyDots
                  total={Math.ceil(refs.data.length / 4)}
                  size={'xs'}
                  css={{ pb: '10px' }}
                  onChange={changePage}
                />
              </Row>
            </Grid.Container>
          </>
        )}

        <Divider />
        <Card.Footer css={{ justifyContent: 'center' }}>
          <Text>© {`${new Date().getFullYear()}`} eatozee.</Text>
        </Card.Footer>
      </Card>
    </NextUIProvider>
  );
};
