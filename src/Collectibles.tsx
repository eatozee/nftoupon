import React, { useEffect } from 'react';
import { NextUIProvider, Card, Grid, Row, Text } from '@nextui-org/react';
import isEmpty from 'lodash/isEmpty';

type Props = {
  NFToupon_Key: string;
};

type ListState = {
  imageUrl: string;
  title: string;
  offer: string;
}[];

export const Collectibles = ({ NFToupon_Key }: Props) => {
  const [list, setList] = React.useState<ListState>([]);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const respose = await fetch(
          'https://eatozee-crypto.app/api/nftoupon/merchant/get',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'NFToupon-Key': NFToupon_Key,
            },
          }
        );
        const { nftoupons } = await respose.json();
        setList(nftoupons);
      } catch (error) {
        console.log('error', error);
      }
    };

    getDetails();
  }, []);

  return (
    <NextUIProvider>
      <Grid.Container gap={2} justify="flex-start">
        {!isEmpty(list) ? (
          list.map((item, index) => (
            <Grid xs={6} sm={3} key={index}>
              <Card hoverable clickable>
                <Card.Body css={{ p: 0 }}>
                  <Card.Image
                    objectFit="cover"
                    src={item.imageUrl}
                    width="100%"
                    height={140}
                    alt={item.title}
                  />
                </Card.Body>
                <Card.Footer>
                  <Row wrap="wrap" justify="space-between">
                    <Text b>{item.title}</Text>
                    <Text css={{ color: '$accents4', fontWeight: '$semibold' }}>
                      {item.offer}
                    </Text>
                  </Row>
                </Card.Footer>
              </Card>
            </Grid>
          ))
        ) : (
          <div>No data found</div>
        )}
      </Grid.Container>
    </NextUIProvider>
  );
};
