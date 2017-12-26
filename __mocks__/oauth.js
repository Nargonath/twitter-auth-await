const { OAuth } = jest.genMockFromModule('oauth');

let isInSystemError = false;
let isInAppError = false;

function setSystemErrorState(inError) {
  isInSystemError = inError;
}

function setAppErrorState(inError) {
  isInAppError = inError;
}

OAuth.prototype.getOAuthRequestToken = function getOAuthRequestToken(callback) {
  if (isInSystemError) {
    return process.nextTick(callback, new Error());
  }

  return process.nextTick(callback, null, 'testRequestToken', 'testRequestSecret', {
    oauth_callback_confirmed: !isInAppError, // eslint-disable-line camelcase
  });
};

OAuth.prototype.getOAuthAccessToken = function getOAuthAccessToken(
  oAuthToken,
  requestTokenSecret,
  oAuthTokenVerifier,
  callback,
) {
  if (isInSystemError) {
    return process.nextTick(callback, new Error());
  }

  return process.nextTick(callback, null, 'accessTokenTest', 'accessTokenSecretTest', {
    user_id: 12345, // eslint-disable-line camelcase
    x_auth_expires: 987765, // eslint-disable-line camelcase
  });
};

OAuth.__setSystemErrorState = setSystemErrorState;
OAuth.__setAppErrorState = setAppErrorState;

export { OAuth };
