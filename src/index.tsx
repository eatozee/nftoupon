import React from 'react';
import {
  Button,
  Input,
  Modal,
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
  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
    console.log('closed');
  };
  return (
    <div>
      <Button onClick={handler} iconRight={<Send set="bulk" />} color="success">
        NFToupon
      </Button>
      <Modal
        closeButton
        preventClose
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            NFToupon Generator
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Spacer y={0.5} />
          <Input size="md" clearable underlined labelPlaceholder="Title" />
          <Spacer y={0.5} />
          <Textarea underlined labelPlaceholder="Description" />
          <Spacer y={0.5} />
          <Input clearable underlined type="file" />
        </Modal.Body>
        <Modal.Footer>
          <Button auto bordered color="gradient" onClick={closeHandler}>
            Close
          </Button>
          <Button auto onClick={closeHandler} color="success">
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
