import React from 'react';
import {
  Button,
  Card,
  Divider,
  Input,
  Row,
  Spacer,
  Text,
  Textarea,
} from '@nextui-org/react';
import { Send } from 'react-iconly';

/* export interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: ReactChild;
} */

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
/**
 * A custom Thing component. Neat!
 */
export const Thing = () => {
  return (
    <Card css={{ mw: '330px' }}>
      <Card.Header css={{ boxSizing: 'inherit' }}>
        <Text b size={18}>
          NFToupon Generator
        </Text>
      </Card.Header>
      <Divider />
      <Card.Body css={{ py: '$10', boxSizing: 'inherit' }}>
        <Spacer y={0.5} />
        <Input size="md" clearable underlined labelPlaceholder="Title" />
        <Spacer y={1.5} />
        <Textarea underlined labelPlaceholder="Description" />
        <Spacer y={1.5} />
        <Input clearable underlined type="file" />
      </Card.Body>
      <Divider />
      <Card.Footer css={{ boxSizing: 'inherit' }}>
        <Row justify="flex-end">
          <Button size="sm" iconRight={<Send set="bulk" />} color="success">
            NFToupon
          </Button>
        </Row>
      </Card.Footer>
    </Card>
  );
};
