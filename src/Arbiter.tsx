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
} from '@nextui-org/react';
import { Wallet } from 'react-iconly';
import { CouponDetails } from './components/CouponDetails';

type prop = {
  data: {
    id: number;
    title: string;
    description: string;
    img: string;
    status: string;
  }[];
  NFToupon_Key: string;
};
export const Arbiter = ({ data }: prop) => {
  //JUST THE HARDCODED VALUE OF data, NFToupon_Key, acceptHandler and rejectHandler we can take if from the one who is using this plugin
  // NFToupon_Key = 'Accepted';
  data = [
    {
      id: 1,
      title: "Creator's Title 1",
      description: "This will replace the creator's Description 1",
      img: 'https://ipfs.io/ipfs/bafkreif265ttbl74nraasybb4hgmaedb6zrqfl2ikms52p4go4ry3f3k5i',
      status: '',
    },
    {
      id: 2,
      title: "Creator's Title 2",
      description: "This will replace the creator's Description 2",
      img: 'https://ipfs.io/ipfs/bafkreiavd46byllzmkgdhakfgu635nqffzwsavrd4qmgxnvomfz556chvi',
      status: '',
    },
    {
      id: 3,
      title: "Creator's Title 3",
      description: "This will replace the creator's Description 3",
      img: 'https://ipfs.io/ipfs/bafkreihzqqyugpckf7gs5ixyxslzffqmm5gy2tz4o6ec2kuvwfqq3kgply',
      status: '',
    },
    {
      id: 4,
      title: "Creator's Title 4",
      description: "This will replace the creator's Description 4",
      img: 'https://ipfs.io/ipfs/bafkreif265ttbl74nraasybb4hgmaedb6zrqfl2ikms52p4go4ry3f3k5i',
      status: '',
    },
    {
      id: 5,
      title: "Creator's Title 5",
      description: "This will replace the creator's Description 3",
      img: 'https://ipfs.io/ipfs/bafkreihzqqyugpckf7gs5ixyxslzffqmm5gy2tz4o6ec2kuvwfqq3kgply',
      status: '',
    },
    {
      id: 6,
      title: "Creator's Title 6",
      description: "This will replace the creator's Description 3",
      img: 'https://ipfs.io/ipfs/bafkreiavd46byllzmkgdhakfgu635nqffzwsavrd4qmgxnvomfz556chvi',
      status: '',
    },
    {
      id: 7,
      title: "Creator's Title 7",
      description: "This will replace the creator's Description 3",
      img: 'https://ipfs.io/ipfs/bafkreihzqqyugpckf7gs5ixyxslzffqmm5gy2tz4o6ec2kuvwfqq3kgply',
      status: '',
    },
    {
      id: 8,
      title: "Creator's Title 8",
      description: "This will replace the creator's Description 3",
      img: 'https://ipfs.io/ipfs/bafkreif265ttbl74nraasybb4hgmaedb6zrqfl2ikms52p4go4ry3f3k5i',
      status: '',
    },
  ];

  const [Details, setDetails] = React.useState({
    id: 0,
    title: '',
    description: '',
    img: '',
    status: '',
  });

  useEffect(() => {
    setDetails({
      id: data[0].id,
      title: data[0].title,
      description: data[0].description,
      img: data[0].img,
      status: data[0].status,
    });
  }, []);

  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);
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

  return (
    <NextUIProvider>
      <Card css={{ mw: '330px', mh: '650px' }}>
        <Card.Header>
          <Row align="center" justify="space-between">
            <Row align="center" gap={0} justify="flex-end">
              <Text
                css={{
                  textGradient: '45deg, $blue500 -20%, $pink500 50%',
                }}
                b
                size={18}
              >
                20k
              </Text>
              <Button
                auto
                light
                color="primary"
                onClick={handler}
                css={{ pr: '7px', pl: '10px' }}
                icon={<Wallet />}
              />
            </Row>

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
          {/* Coupon Details for Arbiter */}
          <CouponDetails
            id={Details.id}
            description={Details.description}
            image={Details.img}
            title={Details.title}
            status={Details.status}
            onClick={(Details) => {
              console.log(Details);
            }}
            acceptBtnText="Accept"
          />
        </Card.Body>
        <Divider />
        <Spacer y={0.5} />
        <Grid.Container gap={1} justify="center">
          {/* Avatars section */}
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
                      status: post.status,
                    })
                  }
                  size="xl"
                  src={post.img}
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
        <Card.Footer css={{ justifyContent: 'center' }}>
          <Text>© {`${new Date().getFullYear()}`} eatozee</Text>
        </Card.Footer>
      </Card>
    </NextUIProvider>
  );
};
