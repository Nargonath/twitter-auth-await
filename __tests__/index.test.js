import { AssertionError } from 'assert';
import { OAuth } from 'oauth';

import { TwitterOAuth } from '../lib';

afterEach(() => {
  OAuth.__setSystemErrorState(false);
  OAuth.__setAppErrorState(false);
});

describe('Constructor', () => {
  test('constructor requires object with 2 required keys', () => {
    expect(() => new TwitterOAuth()).toThrow();
    expect(() => new TwitterOAuth({})).toThrow(AssertionError);
    expect(() => new TwitterOAuth({ consumerKey: 'test' })).toThrow(AssertionError);
    expect(() => new TwitterOAuth({ consumerSecret: 'test' })).toThrow(AssertionError);
    expect(() => new TwitterOAuth({ consumerKey: 'test', consumerSecret: 'test' })).not.toThrow(
      AssertionError,
    );
  });
});

describe('getRedirectAuthURI', () => {
  test('returns redirect authorization URI', async () => {
    expect.assertions(1);

    const client = new TwitterOAuth({ consumerKey: 'testKey', consumerSecret: 'testSecret' });

    const redirectionUri = await client.getRedirectAuthURI();
    expect(redirectionUri).toEqual(expect.stringMatching(/^http/));
  });

  test('throws if redirect authorization callback is not confirmed', async () => {
    expect.assertions(1);
    OAuth.__setSystemErrorState(true);
    const client = new TwitterOAuth({ consumerKey: 'testKey', consumerSecret: 'testSecret' });

    try {
      await client.getRedirectAuthURI();
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  test('throws if it has an error', async () => {
    expect.assertions(1);
    OAuth.__setAppErrorState(true);
    const client = new TwitterOAuth({ consumerKey: 'testKey', consumerSecret: 'testSecret' });

    try {
      await client.getRedirectAuthURI();
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});

describe('getAccessToken', () => {
  test('takes 2 required parameters', () => {
    const client = new TwitterOAuth({ consumerKey: 'testKey', consumerSecret: 'testSecret' });

    expect(() => {
      client.getAccessToken();
    }).toThrow(AssertionError);

    expect(() => {
      client.getAccessToken('oAuthToken');
    }).toThrow(AssertionError);

    expect(() => {
      client.getAccessToken(undefined, 'oAuthTokenVerifier'); // eslint-disable-line no-undefined
    }).toThrow(AssertionError);
  });

  test('returns access tokens info', async () => {
    expect.assertions(4);

    const client = new TwitterOAuth({ consumerKey: 'testKey', consumerSecret: 'testSecret' });
    const tokensInfo = await client.getAccessToken('oAuthToken', 'oAuthTokenVerifier');

    expect(tokensInfo).toHaveProperty('accessToken');
    expect(tokensInfo).toHaveProperty('accessTokenSecret');
    expect(tokensInfo).toHaveProperty('userId');
    expect(tokensInfo).toHaveProperty('xAuthExpires');
  });

  test('bubbles up errors', async () => {
    expect.assertions(1);
    OAuth.__setSystemErrorState(true);

    const client = new TwitterOAuth({ consumerKey: 'testKey', consumerSecret: 'testSecret' });

    try {
      await client.getAccessToken('oAuthToken', 'oAuthTokenVerifier');
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});
