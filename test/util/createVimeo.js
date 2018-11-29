import { createSpy } from 'expect';
import proxyquire from 'proxyquire';

export default function createVimeo() {
  let isPaused = true;

  const playerMock = {
    on: createSpy(),
    ready() {
      return Promise.resolve();
    },
    setVolume: createSpy(),
    setCurrentTime: createSpy(),
    setAutopause: createSpy(),
    setColor: createSpy(),
    setLoop: createSpy(),
    loadVideo: createSpy(),
    unload: createSpy(),
    play: createSpy().andCall(() => {
      isPaused = false;
    }),
    pause: createSpy().andCall(() => {
      isPaused = true;
    }),
    getPaused() {
      return Promise.resolve(isPaused);
    },
    destroy: createSpy(),
    setWidth: createSpy(),
    setHeight: createSpy(),
    element: {
      set width(value) {
        playerMock.setWidth(value);
      },
      set height(value) {
        playerMock.setHeight(value);
      },
    },
  };

  const sdkMock = createSpy().andCall((container, options) => {
    isPaused = !options.autoplay;
    return playerMock;
  });

  const Vimeo = proxyquire.noCallThru().load('../../src/index.js', {
    '@vimeo/player': function Player(...args) {
      return sdkMock(...args);
    },
  }).default;

  return { Vimeo, sdkMock, playerMock };
}
