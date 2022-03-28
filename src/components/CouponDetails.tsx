import {
  Container,
  Spacer,
  Input,
  Textarea,
  Row,
  Button,
} from '@nextui-org/react';
import React from 'react';

type Details = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  status: string;
  onClick: (value: {
    id: number;
    status: string;
    expiryDate: string;
    offer: string;
    cryptoWalletAddress: string;
    tokenId: string;
  }) => void;
  lockParameter: boolean;
  cryptoWalletAddress: string;
    tokenId: string;
    rejectHandler: () => void;
};

export const CouponDetails = (props: Details) => {
  let date: string, offer: string;
  const clickEvent = (status: string) => {
    const data = {
      id: props.id,
      status: status,
      expiryDate: date,
      offer: offer,
      cryptoWalletAddress: props.cryptoWalletAddress,
      tokenId: props.tokenId,
    };
    props.onClick(data);
  };

  return (
    <>
      <Container display="flex" justify="center" fluid>
        <img height="180px" src={props.imageUrl} alt="Creator's NFT imageUrl" />
      </Container>

      <Spacer y={0.5} />
      <Input readOnly width="100%" label="Title" initialValue={props.title} />
      <Spacer y={0.5} />
      <Textarea
        readOnly
        width="100%"
        label="Description"
        initialValue={props.description}
        maxRows={4}
      />
      <Spacer y={0.5} />
      <Input
        required
        label="Offer"
        type="number"
        labelRight="XRP"
        min={1}
        width="100%"
        initialValue={'1'}
        onChange={(e) => {
          offer = e.target.value;
        }}
        readOnly={props.lockParameter}
      />
      <Spacer y={0.5} />
      <Input
        readOnly={props.lockParameter}
        width="100%"
        required
        label="Expiry Date"
        type="date"
        onChange={(e) => {
          date = e.target.value;
        }}
      />
      <Spacer y={0.8} />
      <Row justify="space-around">
        <Button
          css={{ height: '40px' }}
          color="success"
          onClick={() => clickEvent('Accepted')}
          size="xs"
          disabled={props.lockParameter}
        >
          Offer
        </Button>
        <Button
          css={{ height: '40px' }}
          color="error"
          onClick={props.rejectHandler}
          size="xs"
          disabled={props.lockParameter}
        >
          Reject
        </Button>
      </Row>
    </>
  );
};
