import SimplePeer from 'simple-peer';

export function createPeer(initiator, stream) {
  return new SimplePeer({
    initiator: initiator,
    stream: stream,
    trickle: false,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          urls: 'turn:your-turn-server.com',
          username: 'your-username',
          credential: 'your-credential'
        }
      ]
    }
  });
}
