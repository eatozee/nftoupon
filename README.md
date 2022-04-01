# nftoupon

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Note - The widget is on Testnet (xls20-sandbox.rippletest.net:51233), the development is in progress.**

Widget will help you to generate NFTs on XRPL which in turn you can use as coupons, which we call NFToupons

## Installing NFToupon

You can install this module as a component from NPM:

> npm i nftoupon

## Getting Started

You will require a unique `NFToupon-KEY` to use it in your project build. You can contact `admin@eatozee.com` to get your unique `NFToupon-KEY`.

## Usage

To start using the components, please follow these steps:

1. Wrap your application with the `Creator`, `Arbiter` & `Collectibles` components provided by
   **nftoupon**.

```jsx
import { Creator, Arbiter, Collectibles } from 'nftoupon';
```

2. Now you can start using components like so!:

```jsx
import { Arbiter } from 'nftoupon';

const ExampleOne = () => <Arbiter />;
```

```jsx
import { Creator } from 'nftoupon';

const ExampleOne = () => <Creator />;
```

```jsx
import { Collectibles } from 'nftoupon';

const ExampleOne = () => <Collectibles />;
```

## Demo Videos

### Link below is the demo on how to use `Merchant` component

1. https://www.youtube.com/watch?v=rcRr2Z4MXC0

### Link below is the demo on how to use `Creator` component

2. https://www.youtube.com/watch?v=s-01b1TpxJI

**Note: You will then require a `NFToupon-KEY` to use it in your project build. You can contact `admin@eatozee.com` to get your unique `NFToupon-KEY`.**
