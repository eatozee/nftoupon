---
sidebar_position: 1
---

# Intro

Let's discover **nftoupon in less than 5 minutes**.

## NFToupon

**Note - The widget is on Testnet (xls20-sandbox.rippletest.net:51233), the development is in progress.**

Widget will help you to generate NFTs on XRPL which in turn you can use as coupons, which we call NFToupons

## Milestone

[NFToupon milestone](https://github.com/eatozee/nftoupon/blob/master/MILESTONE.md)

## Development setup

> Make sure you have node 16 and npm version >= 7, we use [turbo repo](https://turborepo.org/) for the project.

- fork and clone it
- cd nftoupon
- npm install
- npm run dev

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
import { Creator, Arbiter, Collectibles } from "nftoupon";
```

2. Now you can start using components like so!:

```jsx
import { Arbiter } from "nftoupon";

const ExampleOne = () => <Arbiter NFToupon_Key="your-api-key" />;
```

```jsx
import { Creator } from "nftoupon";

const ExampleOne = () => <Creator NFToupon_Key="your-api-key" />;
```

```jsx
import { Collectibles } from "nftoupon";

const ExampleOne = () => <Collectibles NFToupon_Key="your-api-key" />;
```

## Demo Videos

### Link below is the demo on how to use `Merchant` component

1. https://www.youtube.com/watch?v=rcRr2Z4MXC0

### Link below is the demo on how to use `Creator` component

2. https://www.youtube.com/watch?v=s-01b1TpxJI

**Note: You will then require a `NFToupon-KEY` to use it in your project build. You can contact `admin@eatozee.com` to get your unique `NFToupon-KEY`. We are working on developer console dashboard, soon we will publish on twitter once we are ready**
