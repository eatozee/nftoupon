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
import { Carousel } from '@trendyol-js/react-carousel';
import { Wallet, ChevronRight, ChevronLeft } from 'react-iconly';
import { numberLiteralTypeAnnotation } from '@babel/types';
import { keyBy } from 'lodash';
export const Arbiter = () => {
  const xummLogo = require('../assets/xumm.svg') as string;
  const Logo1 = require('../assets/burger.svg') as string;
  const Logo2 = require('../assets/temp.svg') as string;
  // We can use image url in creatorDetails.icon later
  const creatorDetails = [
    {
      id: '1',
      title: "Creator's Title 1",
      description: "This will replace the creator's Description 1",
      icon: xummLogo,
    },
    {
      id: '2',
      title: "Creator's Title 2",
      description: "This will replace the creator's Description 2",
      icon: Logo1,
    },
    {
      id: '3',
      title: "Creator's Title 3",
      description: "This will replace the creator's Description 3",
      icon: Logo2,
    },
    {
      id: '4',
      title: "Creator's Title 4",
      description: "This will replace the creator's Description 4",
      icon: Logo1,
    },
  ];

  const [Details, setDetails] = React.useState({
    id: '',
    title: '',
    description: '',
    icon: '',
  });
  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
  };
  return (
    <NextUIProvider>
      <Card css={{ mw: '400px', mh: '650px' }}>
        <Card.Header>
          <Row align="center" justify="space-between">
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
                <Text id="modal-title" size={18}>
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
        <Card.Body css={{ py: '$10', alignItems: 'center' }}>
          <Container display="flex" justify="center" fluid>
            <img height="180px" src={Details.icon} alt="Creator's NFT image" />
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
          <Grid.Container gap={1}>
            <Grid sm={6} lg={5}>
              <Input
                width="100%"
                required
                label="Offer"
                type="number"
                labelRight="XRP"
                min={1}
                initialValue={'1'}
              />
            </Grid>
            <Grid sm={6} lg={7}>
              <Input width="100%" required label="Date" type="date" />
            </Grid>
          </Grid.Container>
          <Spacer y={0.8} />
          <Row justify="space-around">
            <Button size="sm" color="success">
              Accept
            </Button>
            <Button size="sm" color="error">
              Decline
            </Button>
          </Row>
        </Card.Body>
        <Divider />
        <Spacer y={0.5} />
        <Grid.Container gap={2} justify="center">
          <Carousel
            show={3}
            swiping={true}
            responsive={true}
            slide={1}
            rightArrow={<ChevronRight set="two-tone" />}
            leftArrow={<ChevronLeft set="two-tone" />}
          >
            {creatorDetails.map((creatorDetail) => (
              <Grid key={creatorDetail.id} lg={4}>
                <Avatar
                  zoomed
                  pointer
                  squared
                  key={creatorDetail.id}
                  onClick={() =>
                    setDetails({
                      id: creatorDetail.id,
                      title: creatorDetail.title,
                      description: creatorDetail.description,
                      icon: creatorDetail.icon,
                    })
                  }
                  size="xl"
                  src={creatorDetail.icon}
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
