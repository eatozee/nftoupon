import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Arbiter } from '../src';

const meta: Meta = {
  title: 'Components',
  component: Arbiter,
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

const Template: Story = (args) => <Arbiter {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const arbiter = Template.bind({});

arbiter.args = {};
