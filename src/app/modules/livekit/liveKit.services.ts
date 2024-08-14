import { AccessToken } from 'livekit-server-sdk';
// import { AccessToken } from '../../../../node_modules/livekit-server-sdk/dist/AccessToken';
import config from '../../../config/index';
// liveKit.service.ts
// import config from '../../../config';

const createToken = async () => {
  // const { AccessToken } = await import('livekit-server-sdk');
  const roomName = 'quickstart-room';
  const participantName = 'quickstart-username';

  console.log(config.liveKit.apiKey, config.liveKit.apiSecret, 'ccccccc');

  const at = new AccessToken(config.liveKit.apiKey, config.liveKit.apiSecret, {
    identity: participantName,
    ttl: '10m',
  });
  at.addGrant({ roomJoin: true, room: roomName });

  return at.toJwt();
};

export const LiveKitService = {
  createToken,
};
