import expect, { createSpy } from 'expect';
import render from './util/render';

describe('Vimeo', () => {
  it('should create a Vimeo player when mounted', async () => {
    const onReady = createSpy();
    const { sdkMock, playerMock } = render({
      video: 169408731,
      onReady,
    });
    expect(sdkMock).toHaveBeenCalled();
    expect(sdkMock.calls[0].arguments[1]).toMatch({ id: 169408731 });
    await playerMock.ready();
    expect(onReady).toHaveBeenCalled();
    expect(onReady.calls[0].arguments[0]).toBe(playerMock);
  });

  it('should use `url` prop for full vimeo URLs', async () => {
    const { sdkMock } = render({ video: 'https://vimeo.com/179290396' });
    expect(sdkMock).toHaveBeenCalled();
    expect(sdkMock.calls[0].arguments[1]).toMatch({ url: 'https://vimeo.com/179290396' });
  });

  it('should all onError when `ready()` fails', async () => {
    const onError = createSpy();
    const { sdkMock } = render({
      video: 404,
      shouldFail: true,
      onError,
    });
    await Promise.resolve();
    expect(sdkMock).toHaveBeenCalled();
    expect(sdkMock.calls[0].arguments[1]).toMatch({ id: 404 });
    expect(onError).toHaveBeenCalled();
    expect(onError.calls[0].arguments[0]).toEqual(new Error('artificial failure'));
  });

  it('should load a different video when "video" prop changes', async () => {
    const { sdkMock, playerMock, rerender } = render({
      video: 169408731,
    });
    expect(sdkMock).toHaveBeenCalled();
    expect(sdkMock.calls[0].arguments[1]).toMatch({ id: 169408731 });

    await rerender({ video: 162959050 });

    expect(playerMock.loadVideo).toHaveBeenCalled();
    expect(playerMock.loadVideo.calls[0].arguments[0]).toEqual(162959050);
  });

  it('should pause the video using the "paused" prop', async () => {
    const { playerMock, rerender } = render({
      video: 169408731,
      autoplay: true,
    });

    // Don't call `play` again when we were already playing
    await rerender({ paused: false });
    expect(playerMock.play).toNotHaveBeenCalled();

    await rerender({ paused: true });
    expect(playerMock.pause).toHaveBeenCalled();

    await rerender({ paused: false });
    expect(playerMock.play).toHaveBeenCalled();
  });

  it('should set the volume using the "volume" prop', async () => {
    const { playerMock, rerender } = render({
      video: 169408731,
      volume: 0.5,
    });
    expect(playerMock.setVolume).toHaveBeenCalledWith(0.5);

    await rerender({ volume: 1 });

    expect(playerMock.setVolume).toHaveBeenCalledWith(1);
  });

  it('should set the start time using the "start" prop', async () => {
    const { playerMock, rerender } = render({
      video: 169408731,
      start: 60,
    });
    expect(playerMock.setCurrentTime).toHaveBeenCalledWith(60);

    playerMock.setCurrentTime.reset();
    await rerender({ start: 90 });
    expect(playerMock.setCurrentTime).toNotHaveBeenCalled();

    await rerender({ video: 169408732, start: 120 });
    expect(playerMock.setCurrentTime).toHaveBeenCalledWith(120);
  });

  it('should set the player color using the "color" prop', async () => {
    const { playerMock, sdkMock, rerender } = render({
      video: 169408731,
      color: '#0000ff',
    });
    expect(sdkMock).toHaveBeenCalled();
    expect(sdkMock.calls[0].arguments[1]).toMatch({ color: '#0000ff' });

    await rerender({ color: '#ff0000' });
    expect(playerMock.setColor).toHaveBeenCalledWith('#ff0000');
    await rerender({ color: '#00ff00' });
    expect(playerMock.setColor).toHaveBeenCalledWith('#00ff00');
  });

  it('should set the looping flag using the "loop" prop', async () => {
    const { playerMock, sdkMock, rerender } = render({
      video: 169408731,
      loop: false,
    });
    expect(sdkMock).toHaveBeenCalled();
    expect(sdkMock.calls[0].arguments[1]).toMatch({ loop: false });

    await rerender({ loop: true });
    expect(playerMock.setLoop).toHaveBeenCalledWith(true);
    await rerender({ loop: false });
    expect(playerMock.setLoop).toHaveBeenCalledWith(false);
  });

  it('should set the iframe width/height using the width/height props', async () => {
    const { sdkMock, playerMock, rerender } = render({
      video: 169408731,
      width: 640,
      height: 320,
    });
    expect(sdkMock.calls[0].arguments[1]).toMatch({
      width: 640,
      height: 320,
    });

    await rerender({
      width: '100%',
      height: 800,
    });

    expect(playerMock.setWidth).toHaveBeenCalledWith('100%');
    expect(playerMock.setHeight).toHaveBeenCalledWith(800);
  });

  it('should set the playback rate using the "playbackRate" props', async () => {
    const { playerMock, rerender } = render({
      video: 169408731,
      playbackRate: 0.5,
    });

    expect(playerMock.setPlaybackRate).toHaveBeenCalledWith(0.5);

    await rerender({ playbackRate: 2 });

    expect(playerMock.setPlaybackRate).toHaveBeenCalledWith(2);
  });

  it('should destroy player when unmounting', async () => {
    const { playerMock, unmount } = render({
      video: 169408731,
      width: 640,
      height: 320,
    });

    await unmount();

    expect(playerMock.destroy).toHaveBeenCalled();
  });
});
