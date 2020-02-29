import { createSpy } from 'expect';
import proxyquire from 'proxyquire';

export default function createVimeo({ shouldFail = false } = {}) {
  let isPaused = true;

  const createPromiseSpy = () => createSpy().andCall(() => Promise.resolve());

  const playerMock = {
    on: createSpy(),
    ready() {
      return shouldFail
        ? Promise.reject(new Error('artificial failure'))
        : Promise.resolve();
    },
    setVolume: createPromiseSpy(),
    setCurrentTime: createPromiseSpy(),
    setAutopause: createPromiseSpy(),
    setColor: createPromiseSpy(),
    setLoop: createPromiseSpy(),
    loadVideo: createPromiseSpy(),
    unload: createPromiseSpy(),
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
