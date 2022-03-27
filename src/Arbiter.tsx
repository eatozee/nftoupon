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
type NFTouponPayload = {
  title: string;
  img: string;
  description: string;
  status: string;
}[];
// type prop = {
//   NFToupon_Key: string;
// };
export const Arbiter = () => {
  //JUST THE HARDCODED VALUE OF data, NFToupon_Key, acceptHandler and rejectHandler we can take if from the one who is using this plugin
  // NFToupon_Key = 'Accepted';

  const [data, setData] = React.useState<NFTouponPayload>([]);
  const [details, setDetails] = React.useState({
    title: '',
    description: '',
    img: '',
    status: '',
  });

  useEffect(()=>{
    const getDetails = async () => { 
      try{ 
      const respose =  await fetch("https://eatozee-crypto.app/api/nftoupon/merchant", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "NFToupon-Key": "36feff68-ae2a-46a1-9719-20a3fd5e633d",
        },

      });
      const {nftoupons} = await respose.json();

      setData(nftoupons);
     } catch(error){
       console.log("error", error);
     }
   }

   getDetails();
  },[] );

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
          {/* Coupon details for Arbiter */}
          {data.length > 0 ? (
            <CouponDetails
              description={details.description}
              image={details.img}
              title={details.title}
              status={details.status}
              onClick={(details) => {
                console.log(details);
              }}
              acceptBtnText="Accept"
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
                  <Grid lg={3}>
                    <Avatar
                      zoomed
                      pointer
                      squared
                      onClick={() =>
                        setDetails({
                          title: post.title || '',
                          description: post.description || '',
                          img: post.img || '',
                          status: post.status || '',
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
          </>
        )}

        <Card.Footer css={{ justifyContent: 'center' }}>
          <Text>© {`${new Date().getFullYear()}`} eatozee</Text>
        </Card.Footer>
      </Card>
    </NextUIProvider>
  );
};
