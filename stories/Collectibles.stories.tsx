import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Collectibles } from '../src';

const meta: Meta = {
  title: 'Components',
  component: Collectibles,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = (args) => (
  <Collectibles NFToupon_Key="36feff68-ae2a-46a1-9719-20a3fd5e633d" />
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const collectibles = Template.bind({});

collectibles.args = {};
