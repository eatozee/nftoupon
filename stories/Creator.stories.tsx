import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Creator } from '../src';

const meta: Meta = {
  title: 'Screens/Creator',
  component: Creator,
};

export default meta;

const Template: Story = (args) => <Creator NFToupon_Key="" {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const creator = Template.bind({});

creator.args = {};
