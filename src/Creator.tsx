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
  Modal,
  Avatar,
  Grid,
  Container,
  Pagination,
} from '@nextui-org/react';
import isEmpty from 'lodash/isEmpty';
import { Send, Wallet, ChevronLeft } from 'react-iconly';

interface ResponsePayload {
  payload: {
    uuid: string;
    refs: {
      qr_png: string;
      websocket_status: string;
    };
  };
}
export const Creator = (props: CreatorProps) => {
  const xummLogo = require('../assets/xumm.svg') as string;
  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);
  const closeHandler = () => setVisible(false);
  const { xummConfig } = props;
  const { XUMM_APIKEY, XUMM_APISECRET } = xummConfig;
  let posts: {
    id: number;
    title: string;
    description: string;
    img: string;
    status: string;
  }[] = [
    {
      id: 1,
      title: "Creator's Title 1",
      description: "This will replace the creator's Description 1",
      img: xummLogo,
      status: 'error',
    },
    {
      id: 2,
      title: "Creator's Title 2",
      description: "This will replace the creator's Description 2",
      img: xummLogo,
      status: 'warning',
    },
    {
      id: 3,
      title: "Creator's Title 3",
      description: "This will replace the creator's Description 3",
      img: xummLogo,
      status: 'success',
    },
    {
      id: 4,
      title: "Creator's Title 4",
      description: "This will replace the creator's Description 4",
      img: xummLogo,
      status: 'error',
    },
    {
      id: 5,
      title: "Creator's Title 5",
      description: "This will replace the creator's Description 3",
      img: xummLogo,
      status: 'error',
    },
    {
      id: 6,
      title: "Creator's Title 6",
      description: "This will replace the creator's Description 3",
      img: xummLogo,
      status: 'error',
    },
    {
      id: 7,
      title: "Creator's Title 7",
      description: "This will replace the creator's Description 3",
      img: xummLogo,
      status: 'error',
    },
    {
      id: 8,
      title: "Creator's Title 8",
      description: "This will replace the creator's Description 3",
      img: xummLogo,
      status: 'error',
    },
  ];
  //Logic for posts in pagination where '4' is the posts per page
  const [currentPage, setCurrentPage] = React.useState(1);
  const indexOfLastPost = currentPage * 4;
  const indexOfFirstPost = indexOfLastPost - 4;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  const [Details, setDetails] = React.useState({
    id: 0,
    title: '',
    description: '',
    img: '',
    status: '',
    visibilty: false,
  });



  const connectWallet = async () => {
    // just a placeholder will change with the real one
    try {
      const response = await fetch('http://localhost:3000/api/payload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          XUMM_APIKEY: '',
          XUMM_APISECRET: '',
        }),
      });
      const { payload, error }: ResponsePayload = await response.json();
      console.log({ payload, error });
      if (!isEmpty(payload)) {
        const wsURL = payload.refs.websocket_status;
        const ws = new WebSocket(wsURL);
        ws.onmessage = (event) => {
          console.log(event.data);
        };
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log('error ', error);
    }
  };
  return (
    <NextUIProvider>
      <Card css={{ mw: '400px', mh: '650px' }}>
        <Card.Header>
          <Row justify="space-between" align="center">
            {Details.visibilty ? (
              <Button
                auto
                size={'sm'}
                onClick={() =>
                  setDetails({
                    id: 0,
                    title: '',
                    description: '',
                    img: '',
                    status: '',
                    visibilty: false,
                  })
                }
                light
                icon={<ChevronLeft set="light" />}
              />
            ) : null}
            {Details.visibilty ? (
              <Text
                css={{
                  textGradient: '45deg, $blue500 -20%, $pink500 10%',
                  pl: '228px',
                }}
                b
                size={18}
              >
                20k
              </Text>
            ) : (
              <Text
                css={{
                  textGradient: '45deg, $blue500 -20%, $pink500 10%',
                }}
                b
                size={18}
              >
                20k
              </Text>
            )}
            <Button
              auto
              css={{ pr: '7px' }}
              light
              color="primary"
              onClick={handler}
              icon={<Wallet />}
            />
            <Modal
              closeButton
              aria-labelledby="modal-title"
              open={visible}
              onClose={closeHandler}
            >
              <Modal.Header>
                <Text id="wallet-title" size={18}>
                  Scan the QR Code
                </Text>
              </Modal.Header>
              <Modal.Body>{/* Paste QR code link Here */}</Modal.Body>
              <Modal.Footer>
                <Button auto flat color="primary" onClick={closeHandler}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
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
                <Button size="sm" color="success">
                  Generate NFToupon
                </Button>
                <Spacer y={0.5} />
                <Button size="sm" color="error">
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
                <Button
                  auto
                  iconRight={<Send set="bulk" />}
                  onClick={connectWallet}
                >
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
          <Grid.Container gap={2} justify="center">
          <Row justify="center">
            {currentPosts.map((post) => (
              <Grid key={post.id} lg={3} css={{ pl: '18px' }}>
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
                      status: post.status,
                      visibilty: true,
                    })
                  }
                  bordered
                  color={post.status}
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
                total={Math.ceil(posts.length / 4)}
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
