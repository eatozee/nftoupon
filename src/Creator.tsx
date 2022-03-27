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
type CreatorInput= {
  title: string;
  description: string;
}

type NFTouponPayload = {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  status: string;
}[];



export const Creator = () => {
  const [visible, setVisible] = React.useState(false);
  const closeHandler = () => setVisible(false);
  const [Details, setDetails] = React.useState({
    id: 0,
    title: '',
    description: '',
    imageUrl: '',
    status: '',
    offer:'',
    date:'',
    visibility: false,
  });
  const [xummPayload, setXummPayload] =
    React.useState<ResponsePayload | null>(null);
  const [walletAddress, setWalletAddress] = React.useState<string>("");

  const [sendButtonDisabled, setSendButtonDisabled] = React.useState(true);
  const [data, setData] = React.useState<NFTouponPayload>([]);
 
  const [src, setSrc] = React.useState<any>(""); // initial src will be empty
  const [inputValue, setInputValue] = React.useState<string>(""); //storing title input
  const [textAreaValue, setTextAreaValue] = React.useState<string>(""); //storing description input
  

  const uploadFile = (event: any) => {
 
    const reader = new FileReader();
    reader.onload = async function(){
      const binaryData: any = reader.result;
      const byteString = atob(binaryData.split(',')[1]);
      const mimeString = binaryData.split(',')[0].split(':')[1].split(';')[0];
      console.log({byteString, mimeString})
      setSrc(byteString);  
  }
  reader.readAsDataURL(event.target.files[0]);
    };


  
  
  //Logic for refs.data in pagination where '4' is the refs.data per page
  const [currentPage, setCurrentPage] = React.useState(1);
  const indexOfLastPost = currentPage * 4;
  const indexOfFirstPost = indexOfLastPost - 4;
  const currentPosts: any = !isEmpty(data) && data.slice(indexOfFirstPost, indexOfLastPost);
  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  const sendDetails = async () => {
      const response = await fetch(
        `http://localhost:3000/api/nftoupon/meta`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'NFToupon-Key': '36feff68-ae2a-46a1-9719-20a3fd5e633d',
          },
          body: JSON.stringify({
            title: inputValue,
            description: textAreaValue,
            file: src,
            address: 'abcdefghijkl',
            status: 'Pending',
          }),
        }
      );
      const result = await response.json();
      console.log(result);
    }

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
        }
      );
      const { payload } = await response.json();

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
              'NFToupon-Key': '36feff68-ae2a-46a1-9719-20a3fd5e633d',
            },
            body: JSON.stringify({
              address: walletAddress,
            }),
          }
        );
        console.log('wallet address  ',  walletAddress);
        const {nftoupons} = await respose.json();
        console.log(nftoupons) ;
        setData(nftoupons);

      } catch (error) {
        console.log('error', error);
      }
    };
    if(!isEmpty(walletAddress)){
      getDetails();
    }
  }, [walletAddress]);

  useEffect(() => {
    if (!isEmpty(xummPayload)) {
      const wsURL = xummPayload?.refs?.websocket_status;
      const ws = new WebSocket(wsURL || '');
      ws.onmessage = (event) => {
        const { opened, payload_uuidv4, signed, expired } = JSON.parse(
          event.data
        );
        if (opened) {
          setSendButtonDisabled(false);
        } else if (expired) {
          closeSocket(ws);
        } else if (!isEmpty(payload_uuidv4) && !signed) {
          closeSocket(ws);
        } else if (signed) {

          fetch(`https://eatozee-crypto.app/api/nftoupon/creator/payload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'NFToupon-Key': '36feff68-ae2a-46a1-9719-20a3fd5e633d',
            },
            body: JSON.stringify({
              payload_uuidv4,
            }),
          })
            .then((res) => res.json())
            .then((json) => {
              console.log(json);
              setWalletAddress(json.payload);
              closeSocket(ws);
            })
            .catch((err) => console.error('error:' + err));
        }
      };
    }
  },[xummPayload]);
  return (
    <NextUIProvider>
      <Card css={{ mw: '300px', mh: '650px' }}>
        <Card.Header>
          <Row justify="space-between" align="center">
            {Details.visibility ? (
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
                    offer:'',
                    date:'',
                    visibility: false,
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
          {Details.visibility ? (
            <>
              <Container display="flex" justify="center" fluid>
                <img
                  height="180px"
                  src={Details.imageUrl}
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
                    initialValue={Details.offer}
                  />
                  <Spacer y={0.5} />
                  <Input readOnly initialValue={Details.date} width="100%" required label="Date" />
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
              <Input size="md" clearable labelPlaceholder="Title" type="text" value={inputValue} onChange={(
                ev: any
            ): void => setInputValue(ev.target.value)} />
              <Spacer y={1.5} />
              <Textarea labelPlaceholder="Description" value={textAreaValue}
              onChange={(
                ev: any
            ): void => setTextAreaValue(ev.target.value)} />
              <Spacer y={1.5} />
              <Input underlined clearable type="file" name="uploadFile" onChange={(event) => uploadFile(event)}/>
              <Spacer y={1.5} />

              <Row justify="flex-end">
                {sendButtonDisabled ? (
                <Button auto iconRight={<Send set="bulk" />} onClick={sendDetails} disabled>
                  Send
                </Button>
                ) : (
                <Button auto iconRight={<Send set="bulk" />} onClick={sendDetails}>
                  Send
                </Button>
                )}
                
              </Row>
            </>
          )}
        </Card.Body>
        <Divider />

        {Details.visibility ? null : (

          <>
            
            <Spacer y={0.5} />
            {data.length > 0 && ( <Grid.Container gap={1} justify="center">
              <Row justify="center">
                {currentPosts.map((post: any) => (
                  <Grid  lg={3}>
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
                          offer:  post.offer,
                          date:post.date,
                          visibility: true,
                        })
                      }
                      bordered
                      color={((post.status === "Pending")  ? "warning" : (post.status === "Accepted") ? "success" : "error")}
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
            </Grid.Container>)}
            <Divider />
          </>
        )}

        
        <Card.Footer css={{ justifyContent: 'center' }}>
          <Text>© {`${new Date().getFullYear()}`} eatozee.</Text>
        </Card.Footer>
      </Card>
    </NextUIProvider>
  );
};



