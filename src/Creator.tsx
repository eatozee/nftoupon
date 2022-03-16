import React from 'react';
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
} from '@nextui-org/react';
import isEmpty from 'lodash/isEmpty';
import {
  ChevronLeftCircle,
  ChevronRightCircle,
  Send,
  Wallet,
  CloseSquare,
} from 'react-iconly';
import { Carousel } from '@trendyol-js/react-carousel';

interface ResponsePayload {
  payload: {
    uuid: string;
    refs: {
      qr_png: string;
      websocket_status: string;
    };
  };
  error: string;
}
export const Creator = (props: CreatorProps) => {
  const xummLogo = require('../assets/xumm.svg') as string;
  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);
  const closeHandler = () => setVisible(false);
  const { xummConfig } = props;
  const { XUMM_APIKEY, XUMM_APISECRET } = xummConfig;
  const creatorDetails = [
    {
      id: '1',
      title: "Creator's Title 1",
      description: "This will replace the creator's Description 1",
      img: xummLogo,
      status: 'error',
    },
    {
      id: '2',
      title: "Creator's Title 2",
      description: "This will replace the creator's Description 2",
      img: xummLogo,
      status: 'warning',
    },
    {
      id: '3',
      title: "Creator's Title 3",
      description: "This will replace the creator's Description 3",
      img: xummLogo,
      status: 'success',
    },
    {
      id: '4',
      title: "Creator's Title 3",
      description: "This will replace the creator's Description 3",
      img: xummLogo,
      status: 'error',
    },
  ];

  const [buttonVisible, setButtonVisible] = React.useState(false);
  const [showDetail, setShowDetail] = React.useState({
    id: '',
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
            <Text
              css={{
                textGradient: '45deg, $blue500 -20%, $pink500 50%',
              }}
              b
              size={18}
            >
              Counter
            </Text>
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
          {showDetail.visibilty ? (
            <>
            <Row justify='flex-end' css={{pb: '$12'}}>
              <Button
                auto
                size={'md'}
                onClick={() => setShowDetail(
                  {    
                  id: '',
                  title: '',
                  description: '',
                  img: '',
                  status: '',
                  visibilty: false,}
                )}
                light
                icon={<CloseSquare set="bulk" filled />}
              />
              </Row>
              <Container display="flex" justify="center" fluid> 
                <img
                  height="180px"
                  src={showDetail.img}
                  alt="Creator's NFT image"
                />
              </Container>
              <Spacer y={0.5} />
              <Input
                readOnly
                width="100%"
                label="Title"
                initialValue={showDetail.title}
              />
              <Spacer y={0.5} />
              <Textarea
                readOnly
                width="100%"
                label="Description"
                initialValue={showDetail.description}
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
                  <Input readOnly width="100%" required label="Date"  />
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
        <Divider />
        <Spacer y={0.5} />
        <Grid.Container gap={2} justify="center">
          <Carousel
            show={3}
            swiping={true}
            responsive={true}
            slide={1}
            rightArrow={<ChevronRightCircle set="two-tone" />}
            leftArrow={<ChevronLeftCircle set="two-tone" />}
          >
            {creatorDetails.map((creatorDetail) => (
              <Grid key={creatorDetail.id} lg={4}>
                <Avatar
                  zoomed
                  pointer
                  size="xl"
                  onClick={() =>
                    setShowDetail({
                      id: creatorDetail.id,
                      title: creatorDetail.title,
                      description: creatorDetail.description,
                      img: creatorDetail.img,
                      status: creatorDetail.status,
                      visibilty: true,
                    })
                  }
                  src={creatorDetail.img}
                  color={creatorDetail.status}
                  bordered
                  squared
                />
              </Grid>
            ))}
          </Carousel>
        </Grid.Container>
        <Divider />
        <Card.Footer css={{ justifyContent: 'center' }}>
          <Text>
            © {`${new Date().getFullYear()}`} eatozee. All rights reserved
          </Text>
        </Card.Footer>
      </Card>
    </NextUIProvider>
  );
};
