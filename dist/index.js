"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TwitterOAuth = undefined;

var _oauth = require("oauth");

var _utils = require("./utils");

const requestTokenUrl = Symbol('requestTokenUrl');
const authenticateUrl = Symbol('authenticateUrl');
const accessTokenUrl = Symbol('accessTokenUrl');
const getRequestToken = Symbol('getRequestToken');
const requestTokenSecret = Symbol('requestTokenSecret');

class TwitterOAuth {
  constructor({
    consumerKey = _utils.ensure`consumerKey`,
    consumerSecret = _utils.ensure`consumerSecret`,
    callback = null
  }) {
    Object.defineProperty(this, _requestTokenUrl, {
      configurable: true,
      enumerable: true,
      writable: true,
      value: 'https://api.twitter.com/oauth/request_token'
    });
    Object.defineProperty(this, _authenticateUrl, {
      configurable: true,
      enumerable: true,
      writable: true,
      value: 'https://api.twitter.com/oauth/authenticate'
    });
    Object.defineProperty(this, _accessTokenUrl, {
      configurable: true,
      enumerable: true,
      writable: true,
      value: 'https://api.twitter.com/oauth/access_token'
    });
    Object.defineProperty(this, _requestTokenSecret, {
      configurable: true,
      enumerable: true,
      writable: true,
      value: null
    });
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.oauthClient = new _oauth.OAuth(this[requestTokenUrl], this[accessTokenUrl], this.consumerKey, this.consumerSecret, '1.0A', callback, 'HMAC-SHA1');
  }

  async getRedirectAuthURI() {
    const requestToken = await this[getRequestToken]();
    return `${this[authenticateUrl]}?oauth_token=${requestToken}`;
  }

  [getRequestToken]() {
    return new Promise((resolve, reject) => {
      this.oauthClient.getOAuthRequestToken((error, oauthRequestToken, oAuthRequestTokenSecret, results) => {
        if (error) {
          return reject(new Error(error));
        }

        if (!results.oauth_callback_confirmed) {
          return reject(new Error(`OAuth callback not confirmed`));
        }

        this[requestTokenSecret] = oAuthRequestTokenSecret;
        return resolve(oauthRequestToken);
      });
    });
  }

  getAccessToken(oAuthToken = _utils.ensure`oAuthToken`, oAuthTokenVerifier = _utils.ensure`oAuthTokenVerifier`) {
    return new Promise((resolve, reject) => {
      this.oauthClient.getOAuthAccessToken(oAuthToken, this[requestTokenSecret], oAuthTokenVerifier, (error, oauthAccessToken, oauthAccessTokenSecret, results) => {
        if (error) {
          return reject(error);
        }

        return resolve({
          accessToken: oauthAccessToken,
          accessTokenSecret: oauthAccessTokenSecret,
          userId: results.user_id,
          screenName: results.screen_name,
          xAuthExpires: results.x_auth_expires
        });
      });
    });
  }

}

exports.TwitterOAuth = TwitterOAuth;
var _requestTokenUrl = requestTokenUrl;
var _authenticateUrl = authenticateUrl;
var _accessTokenUrl = accessTokenUrl;
var _requestTokenSecret = requestTokenSecret;
//# sourceMappingURL=index.js.map