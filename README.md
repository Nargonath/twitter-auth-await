<div align="center">
  <h1>Twitter-auth-await</h1>
  <strong>Twitter auth library for async/await users</strong>
</div>

<hr>

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Build Status](https://travis-ci.org/Nargonath/twitter-auth-await.svg?branch=master)](https://travis-ci.org/Nargonath/twitter-auth-await)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Installation

NPM:

`npm install -S twitter-auth-await`

Yarn:

`yarn add twitter-auth-await`

## Requirements

This library is made to run on **Node >= 8.x**.

# Auth workflow supported

Currently the library **only supports Twitter's OAuth 1.0a workflow** as I didn't need the others. If you'd like to have other workflow supported by this library, please feel free to file an issue for it.

# API

## `const client = new TwitterOAuth(options)`

Creates a new client to start the auth workflow where:

- `options` - an object with the following keys:
  - `consumerKey` - the consumer key provided by Twitter for your app. **required**
  - `consumerSecret` - the consumer secret provided by Twitter for your app. **required**
  - `callback` - the optional URL that Twitter should call after the user has gone through Twitter authorization successfully.
- returns an instance of the library.

## `async getRedirectAuthURI()`

This method is the first one to be called when starting the auth workflow where:

- `returns` the URI where you should redirect your client to i.e `https://api.twitter.com/oauth/authenticate?oauth_token=requestToken`.

## `getAccessToken(oAuthToken, oAuthTokenVerifier)`

Process the token retrieved from the previous step to obtain the access token where:

- `oAuthToken` - the token sent back to your callback (if submitted) when the authorization workflow is successful. **required**
- `oAuthTokenVerifier` - the token verifier sent along the `oAuthToken`. **required**
- `returns` a promise resolving an object with the following properties:
  - `accessToken` - the access token needed to access the user's protected Twitter resources.
  - `accessTokenSecret` - the access token secret.
  - `userId` - Twitter's user id.
  - `xAuthExpires` - times after which the token will expire.

# How it works

There are 3 steps required for you to start using this library:

1.  Create a new client using the constructor:

```javascript
import { TwitterOAuth } from 'twitter-auth-await';

const twitterClient = new TwitterOAuth({
  consumerKey: 'myConsumerKey',
  consumerSecret: 'myConsumerSecret',
  callback: 'http://127.0.0.1/auth-callback',
});
```

When using the Twitter's auth in your app you should have created your app credentials prior using this lib. Follow this link to do so: [https://apps.twitter.com/](https://apps.twitter.com/). Once done, you'll have your **consumer key** and **consumer secret**. If you don't provide a callback URL you'll end up with a PIN on the client side that your client would need to submit to your server for you to complete the auth workflow.

2.  Get the redirect auth URI:

```javascript
const redirectUri = await twitterClient.getRedirectAuthURI();

response.redirect(redirectUri);
```

3.  Get the access token:

```javascript
const { oauth_token: oauthToken, oauth_verifier: oauthVerifier } = request.query;

const { accessToken } = await twitterClient.getAccessToken(oauthToken, oauthVerifier);
```

The sections above don't assume any particular node framework that's why there isn't any boilerplate surrounding the snippets.

# Examples

WIP
