// @ts-check
import React from 'react';
import Player from '@vimeo/player';

/** @typedef {import('@vimeo/player').EventMap} EventMap */
/**
 * @template {any} Data
 * @typedef {import('@vimeo/player').EventCallback<Data>} EventCallback
 */

const {
  useEffect,
  useRef,
  useState,
} = React;

/**
 * @param {React.RefObject<HTMLElement>} container
 * @param {import('@vimeo/player').Options} options
 */
function useVimeoPlayer(container, options) {
  // Storing the player in the very first hook makes it easier to
  // find in React DevTools :)
  const [player, setPlayer] = useState(/** @type {Player | null} */ (null));

  // The effect that manages the player's lifetime.
  useEffect(() => {
    const instance = new Player(container.current, options);
    setPlayer(instance);

    return () => {
      instance.destroy();
    };
  }, []);

  return player;
}

/**
 * Use an effect with a maybe-existing player.
 *
 * @param {Player|null} player
 * @param {() => void | (() => void)} callback
 * @param {unknown[]} dependencies
 */
function usePlayerEffect(player, callback, dependencies) {
  useEffect(() => {
    if (player) callback();
  }, [player, ...dependencies]);
}

/**
 * Attach an event listener to a Vimeo player.
 *
 * @template {keyof EventMap} K
 * @param {Player} player
 * @param {K} event
 * @param {EventCallback<EventMap[K]>} handler
 */
function useEventHandler(player, event, handler) {
  usePlayerEffect(player, () => {
    if (handler) {
      player.on(event, handler);
    }
    return () => {
      if (handler) {
        player.off(event, handler);
      }
    };
  }, [event, handler]);
}

/**
 * @param {string|number|null} video
 */
function getVideoProps(video) {
  if (video == null) {
    return undefined;
  }

  return typeof video === 'number' || /^\d+$/.test(video)
    ? { id: Number(video) }
    : { url: video };
}

/**
 * @param {React.RefObject<HTMLElement>} container
 * @param {import('../index').VimeoOptions} options
 */
function useVimeo(container, {
  video,
  width,
  height,
  autopause = true,
  autoplay = false,
  showByline = true,
  color,
  controls = true,
  loop = false,
  showPortrait = true,
  showTitle = true,
  muted = false,
  background = false,
  responsive = false,
  playbackRate,
  dnt = false,
  speed = false,
  keyboard = false,
  pip = false,
  playsInline = true,
  quality,
  textTrack,
  transparent = true,
  paused,
  volume,
  start,

  // Events
  onReady,
  onError,
  onPlay,
  onPause,
  onEnd,
  onTimeUpdate,
  onProgress,
  onSeeking,
  onSeeked,
  onTextTrackChange,
  onChapterChange,
  onCueChange,
  onCuePoint,
  onVolumeChange,
  onPlaybackRateChange,
  onBufferStart,
  onBufferEnd,
  onLoaded,
  onDurationChange,
  onFullscreenChange,
  onQualityChange,
  onCameraChange,
  onResize,
  onEnterPictureInPicture,
  onLeavePictureInPicture,
}) {
  const isFirstRender = useRef(true);
  const player = useVimeoPlayer(container, {
    ...getVideoProps(video),
    // The Vimeo player officially only supports integer width/height.
    // If a "100%" string was provided we apply it afterwards in an effect.
    width: typeof width === 'number' ? width : undefined,
    height: typeof height === 'number' ? height : undefined,
    autopause,
    autoplay,
    byline: showByline,
    color,
    controls,
    loop,
    portrait: showPortrait,
    title: showTitle,
    muted,
    background,
    responsive,
    dnt,
    speed,
    keyboard,
    pip,
    playsinline: playsInline,
    quality,
    texttrack: textTrack,
    transparent,
  });

  // Initial player setup.
  // This effect should only run once *and* it's async,
  // so the most reliable thing to do is to put all its dependencies in a mutable ref.
  const initState = useRef({ onReady, onError, start });
  Object.assign(initState.current, { onReady, onError, start });
  usePlayerEffect(player, () => {
    let cancelled = false;

    player.ready().then(() => {
      if (cancelled) {
        return;
      }
      if (initState.current.start) {
        player.setCurrentTime(initState.current.start);
      }

      initState.current.onReady?.(player);
    }, (err) => {
      if (cancelled) {
        return;
      }
      if (initState.current.onError) {
        initState.current.onError(err);
      } else {
        throw err;
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEventHandler(player, 'error', onError);
  useEventHandler(player, 'play', onPlay);
  useEventHandler(player, 'pause', onPause);
  useEventHandler(player, 'ended', onEnd);
  useEventHandler(player, 'timeupdate', onTimeUpdate);
  useEventHandler(player, 'progress', onProgress);
  useEventHandler(player, 'seeking', onSeeking);
  useEventHandler(player, 'seeked', onSeeked);
  useEventHandler(player, 'texttrackchange', onTextTrackChange);
  useEventHandler(player, 'chapterchange', onChapterChange);
  useEventHandler(player, 'cuechange', onCueChange);
  useEventHandler(player, 'cuepoint', onCuePoint);
  useEventHandler(player, 'volumechange', onVolumeChange);
  useEventHandler(player, 'playbackratechange', onPlaybackRateChange);
  useEventHandler(player, 'bufferstart', onBufferStart);
  useEventHandler(player, 'bufferend', onBufferEnd);
  useEventHandler(player, 'durationchange', onDurationChange);
  useEventHandler(player, 'fullscreenchange', onFullscreenChange);
  useEventHandler(player, 'qualitychange', onQualityChange);
  useEventHandler(player, 'camerachange', onCameraChange);
  useEventHandler(player, 'resize', onResize);
  useEventHandler(player, 'enterpictureinpicture', onEnterPictureInPicture);
  useEventHandler(player, 'leavepictureinpicture', onLeavePictureInPicture);
  useEventHandler(player, 'loaded', onLoaded);

  usePlayerEffect(player, () => {
    player.setAutopause(autopause);
  }, [autopause]);
  usePlayerEffect(player, () => {
    if (color) player.setColor(color);
  }, [color]);
  usePlayerEffect(player, () => {
    player.setPlaybackRate(playbackRate);
  }, [playbackRate]);
  usePlayerEffect(player, () => {
    player.setLoop(loop);
  }, [loop]);
  usePlayerEffect(player, () => {
    player.setVolume(volume);
  }, [volume]);
  usePlayerEffect(player, () => {
    player.getPaused().then((prevPaused) => {
      if (paused && !prevPaused) {
        return player.pause();
      }
      if (!paused && prevPaused) {
        return player.play();
      }
      return null;
    });
  }, [paused]);
  usePlayerEffect(player, () => {
    /** @type {HTMLIFrameElement} */ (/** @type {any} */ (player).element).width = String(width);
  }, [width]);
  usePlayerEffect(player, () => {
    /** @type {HTMLIFrameElement} */ (/** @type {any} */ (player).element).height = String(height);
  }, [height]);

  usePlayerEffect(player, () => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return () => {};
    }

    let cancelled = false;
    const videoProps = getVideoProps(video);
    if (videoProps) {
      const loaded = player.loadVideo(videoProps);
      // Set the start time only when loading a new video.
      // It seems like this has to be done after the video has loaded, else it just starts at
      // the beginning!
      if (typeof start === 'number') {
        loaded.then(() => {
          if (cancelled) {
            return;
          }
          player.setCurrentTime(start);
        });
      }
    } else {
      player.unload();
    }
    return () => {
      cancelled = true;
    };
  }, [video]);

  return player;
}

/**
 * @param {import('../index').VimeoProps} props
 */
function Vimeo({
  id,
  className,
  style,
  ...options
}) {
  /** @type {React.RefObject<HTMLDivElement>} */
  const container = useRef(null);
  useVimeo(container, options);

  return (
    <div
      id={id}
      className={className}
      style={style}
      ref={container}
    />
  );
}

export { useVimeo };
export default Vimeo;
