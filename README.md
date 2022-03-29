# nftoupon
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


Widget will help you to generate NFTs on XRPL which in turn you can use as coupons, which we call NFToupons


## Installing NFToupon
You can install this module as a component from NPM:

> npm i nftoupon


## Getting Started
You will require a unique `NFToupon-KEY` to use it in your project build. You can contact `admin@eatozee.com` to get your unique `NFToupon-KEY`.

## Usage

To start using the components, please follow these steps:

1. Wrap your application with the `Creator` & `Arbiter` componenets provided by
   **nftoupon**.

```jsx
import { Creator, Arbiter } from "nftoupon";

```
2. Now you can start using components like so!:

```jsx
import { Creator, Arbiter } from "nftoupon";

function Example() {
  return 
  <Creator NFToupon-KEY="abcxyz"/>
  <Arbiter NFToupon-KEY="abcxyz"/>
}
```

_Note: You will then require a `NFToupon-KEY` to use it in your project build. You can contact `admin@eatozee.com` to get your unique `NFToupon-KEY`. _




