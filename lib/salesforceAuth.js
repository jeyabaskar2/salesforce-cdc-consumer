const fs = require('fs');
const jwt = require('jsonwebtoken');
require('isomorphic-fetch');

/**
 * Authenticates to SFDC based on OAuth 2.0 JWT Bearer Flow
 * @param {Object} config
 * @param {String} config.consumerKey
 * @param {String} config.salesforceAuthServer
 * @param {String} config.salesforceUsername
 */
async function authenticate(config) {
  const url = prepareAuthUrl(config);
  const response = await fetch(url, {
    method: 'post',
  });

  const body = await response.json();
  const accessToken = body.access_token;
  return accessToken;
}

function prepareAuthUrl(config) {
  const url = new URL(`${config.salesforceAuthServer}/services/oauth2/token`);

  const urlParams = {
    username: config.username,
    password: config.password,
    grant_type: 'password',
    client_id: config.clientId,
    client_secret: config.clientSecret,
  };

  url.search = new URLSearchParams(urlParams).toString();

  return url;
}

module.exports = {
  authenticate,
};
