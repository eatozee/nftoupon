import { Col, Link, Text } from '@nextui-org/react';
import React from 'react';

type prop = {
  disConnectWallet: () => void;
  walletAddress: string;
};

export const Header = (props: prop) => {
  return (
    <Col>
      <Text
        css={{ overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px' }}
      >
        {props.walletAddress}
      </Text>
      <Link
        css={{ color: '#FB7085', fontSize: '12px' }}
        onClick={props.disConnectWallet}
      >
        @disconnect
      </Link>
    </Col>
  );
};
