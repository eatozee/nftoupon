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
import { Wallet } from 'react-iconly';
export const Arbiter = () => {
  const xummLogo = require('../assets/xumm.svg') as string;
  const sampleLogo1 = require('../assets/sampleLogo1.svg') as string;
  const sampleLogo2 = require('../assets/sampleLogo2.svg') as string;

  let posts: {
    id: number;
    title: string;
    description: string;
    img: string;
  }[] = [
    {
      id: 1,
      title: "Creator's Title 1",
      description: "This will replace the creator's Description 1",
      img: xummLogo,
    },
    {
      id: 2,
      title: "Creator's Title 2",
      description: "This will replace the creator's Description 2",
      img: sampleLogo1,
    },
    {
      id: 3,
      title: "Creator's Title 3",
      description: "This will replace the creator's Description 3",
      img: xummLogo,
    },
    {
      id: 4,
      title: "Creator's Title 4",
      description: "This will replace the creator's Description 4",
      img: sampleLogo2,
    },
    {
      id: 5,
      title: "Creator's Title 5",
      description: "This will replace the creator's Description 3",
      img: xummLogo,
    },
    {
      id: 6,
      title: "Creator's Title 6",
      description: "This will replace the creator's Description 3",
      img: sampleLogo2,
    },
    {
      id: 7,
      title: "Creator's Title 7",
      description: "This will replace the creator's Description 3",
      img: xummLogo,
    },
    {
      id: 8,
      title: "Creator's Title 8",
      description: "This will replace the creator's Description 3",
      img: sampleLogo1,
    },
  ];

  const [Details, setDetails] = React.useState({
    id: 0,
    title: '',
    description: '',
    icon: '',
  });

  useEffect(() => {
    setDetails({
      id: posts[0].id,
      title: posts[0].title,
      description: posts[0].description,
      icon: posts[0].img,
    });
  }, []);

  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
  };

  //Logic for posts in pagination where '4' is the posts per page
  const [currentPage, setCurrentPage] = React.useState(1);
  const indexOfLastPost = currentPage * 4;
  const indexOfFirstPost = indexOfLastPost - 4;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const changePage = (page: number) => {
    setCurrentPage(page);
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
          <Grid.Container>
            <Row>
              <Input
                required
                label="Offer"
                type="number"
                labelRight="XRP"
                min={1}
                initialValue={'1'}
              />
              <Spacer y={0.5} />
              <Input required label="Date" type="date" />
            </Row>
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
        <Grid.Container gap={2} justify="center" css={{ pl: '18px' }}>
          <Row justify="center">
            {currentPosts.map((post) => (
              <Grid key={post.id} lg={4}>
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
                      icon: post.img,
                    })
                  }
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
