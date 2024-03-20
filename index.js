// NOTE: Needed in order to avoid depending on the window object
require('cometd-nodejs-client').adapt();

const lib = require('cometd');
const cometd = new lib.CometD();

const config = require('./config.json');
const authLib = require('./lib/salesforceAuth.js');
const cometdReplayExtension = require('./lib/cometdReplayExtension');

main();

async function main() {
  const authToken = await authLib.authenticate(config);
  const replayExtension = new cometdReplayExtension();

  replayExtension.setChannel(config.platformEvent.topicChannel);
  replayExtension.setReplay('-1');

  cometd.configure({
    appendMessageTypeToURL: false,
    url: `${config.myDomain}/cometd/60.0/`,
    requestHeaders: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  cometd.registerExtension('myReplayExtensionName', replayExtension);

  cometd.handshake(function (h) {
    if (h.successful) {
      // Subscribe to receive messages from the server.
      cometd.subscribe(config.platformEvent.topicChannel, function (message) {
        const dataFromServer = message.data;

        console.log('>>> Data: ');
        console.log(dataFromServer);
      });
    }
  });
}
