import { OAuth } from 'oauth';

import { ensure } from './utils';

const requestTokenUrl = Symbol('requestTokenUrl');
const authenticateUrl = Symbol('authenticateUrl');
const accessTokenUrl = Symbol('accessTokenUrl');
const getRequestToken = Symbol('getRequestToken');
const requestTokenSecret = Symbol('requestTokenSecret');

export class TwitterOAuth {
  [requestTokenUrl] = 'https://api.twitter.com/oauth/request_token';
  [authenticateUrl] = 'https://api.twitter.com/oauth/authenticate';
  [accessTokenUrl] = 'https://api.twitter.com/oauth/access_token';
  [requestTokenSecret] = null;

  constructor({
    consumerKey = ensure`consumerKey`,
    consumerSecret = ensure`consumerSecret`,
    callback = null,
  }) {
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.oauthClient = new OAuth(
      this[requestTokenUrl],
      this[accessTokenUrl],
      this.consumerKey,
      this.consumerSecret,
      '1.0A',
      callback,
      'HMAC-SHA1',
    );
  }

  async getRedirectAuthURI() {
    const requestToken = await this[getRequestToken]();

    return `${this[authenticateUrl]}?oauth_token=${requestToken}`;
  }

  [getRequestToken]() {
    return new Promise((resolve, reject) => {
      this.oauthClient.getOAuthRequestToken(
        (error, oauthRequestToken, oAuthRequestTokenSecret, results) => {
          if (error) {
            return reject(new Error(error));
          }

          if (!results.oauth_callback_confirmed) {
            return reject(new Error(`OAuth callback not confirmed`));
          }

          this[requestTokenSecret] = oAuthRequestTokenSecret;
          return resolve(oauthRequestToken);
        },
      );
    });
  }

  getAccessToken(oAuthToken = ensure`oAuthToken`, oAuthTokenVerifier = ensure`oAuthTokenVerifier`) {
    return new Promise((resolve, reject) => {
      this.oauthClient.getOAuthAccessToken(
        oAuthToken,
        this[requestTokenSecret],
        oAuthTokenVerifier,
        (error, oauthAccessToken, oauthAccessTokenSecret, results) => {
          if (error) {
            return reject(error);
          }

          return resolve({
            accessToken: oauthAccessToken,
            accessTokenSecret: oauthAccessTokenSecret,
            userId: results.user_id,
            screenName: results.screen_name,
            xAuthExpires: results.x_auth_expires,
          });
        },
      );
    });
  }
}
