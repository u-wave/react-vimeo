// @ts-check
import React from 'react';
import PropTypes from 'prop-types';
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
 * @param {React.RefObject<HTMLElement>} container
 * @param {import('../index').VimeoOptions} options
 */
function useVimeo(container, {
  video,
  width,
  height,
  autopause,
  autoplay,
  showByline,
  color,
  controls,
  loop,
  showPortrait,
  showTitle,
  muted,
  background,
  responsive,
  dnt,
  speed,
  keyboard,
  pip,
  playsInline,
  quality,
  textTrack,
  transparent,
  paused,
  volume,
  start,

  // Events
  onReady,
  onError,
  onPlay,
  onPlaying,
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
    [typeof video === 'string' ? 'url' : 'id']: video,
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
  useEventHandler(player, 'playing', onPlaying);
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
    if (video) {
      const loaded = player.loadVideo(video);
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

if (process.env.NODE_ENV !== 'production') {
  Vimeo.propTypes = {
    /**
     * A Vimeo video ID or URL.
     */
    video: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    /**
     * DOM ID for the player element.
     */
    id: PropTypes.string,
    /**
     * CSS className for the player element.
     */
    className: PropTypes.string,
    /**
     * Inline style for container element.
     */
    style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    /**
     * Width of the player element.
     */
    width: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    /**
     * Height of the player element.
     */
    height: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    /**
     * Pause the video.
     */
    paused: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types

    /**
     * The playback volume as a number between 0 and 1.
     */
    volume: PropTypes.number,

    /**
     * The time in seconds at which to start playing the video.
     */
    start: PropTypes.number,

    // Player parameters
    /**
     * Pause this video automatically when another one plays.
     */
    autopause: PropTypes.bool,

    /**
     * Automatically start playback of the video. Note that this won’t work on
     * some devices.
     */
    autoplay: PropTypes.bool,

    /**
     * Show the byline on the video.
     */
    showByline: PropTypes.bool,

    /**
     * Specify the color of the video controls. Colors may be overridden by the
     * embed settings of the video. _(Ex: "ef2f9f")_
     */
    color: PropTypes.string,

    /**
     * Blocks the player from tracking any session data, including all cookies and analytics.
     */
    dnt: PropTypes.bool,

    // Player controls
    /**
     * Hide all elements in the player, such as the progress bar, sharing buttons, etc.
     * (requires Vimeo PRO / Business account)
     */
    controls: PropTypes.bool,

    /**
     * Play the video again when it reaches the end.
     */
    loop: PropTypes.bool,

    /**
     * Show the portrait on the video.
     */
    showPortrait: PropTypes.bool,

    /**
     * Show the title on the video.
     */
    showTitle: PropTypes.bool,

    /**
     * Starts in a muted state to help with autoplay
     */
    muted: PropTypes.bool,

    /**
     * Starts in a background state with no controls to help with autoplay
     */
    background: PropTypes.bool,

    /**
     * Enable responsive mode and resize according to parent element (experimental)
     */
    responsive: PropTypes.bool,

    /**
     * Specify playback rate (requires Vimeo PRO / Business account)
     */
    playbackRate: PropTypes.number,

    /**
     * Enable playback rate controls (requires Vimeo PRO / Business account)
     */
    speed: PropTypes.bool,

    /**
     * Allows for keyboard input to trigger player events.
     */
    keyboard: PropTypes.bool,

    /**
     * Show the picture-in-picture button in the controlbar
     * and enable the picture-in-picture API.
     */
    pip: PropTypes.bool,

    /**
     * Play video inline on mobile devices, to automatically
     * go fullscreen on playback set this parameter to false.
     */
    playsInline: PropTypes.bool,

    /**
     * Vimeo Plus, PRO, and Business members can default
     * an embedded video to a specific quality on desktop.
     */
    quality: PropTypes.string,

    /**
     * Turn captions/subtitles on for a specific language by default.
     */
    textTrack: PropTypes.string,

    /**
     * The responsive player and transparent background are enabled
     * by default, to disable set this parameter to false.
     */
    transparent: PropTypes.bool,

    // Events
    /* eslint-disable react/no-unused-prop-types */

    /**
     * Sent when the Vimeo player API has loaded.
     * Receives the Vimeo player object in the first parameter.
     */
    onReady: PropTypes.func,
    /**
     * Sent when the player triggers an error.
     */
    onError: PropTypes.func,
    /**
     * Triggered when video playback is initiated.
     */
    onPlay: PropTypes.func,
    /**
     * Triggered when the video starts playing.
     */
    onPlaying: PropTypes.func,
    /**
     * Triggered when the video pauses.
     */
    onPause: PropTypes.func,
    /**
     * Triggered any time the video playback reaches the end.
     * Note: when `loop` is turned on, the ended event will not fire.
     */
    onEnd: PropTypes.func,
    /**
     * Triggered as the `currentTime` of the video updates. It generally fires
     * every 250ms, but it may vary depending on the browser.
     */
    onTimeUpdate: PropTypes.func,
    /**
     * Triggered as the video is loaded. Reports back the amount of the video
     * that has been buffered.
     */
    onProgress: PropTypes.func,
    /**
     * Triggered when the player starts seeking to a specific time. An
     * `onTimeUpdate` event will also be fired at the same time.
     */
    onSeeking: PropTypes.func,
    /**
     * Triggered when the player seeks to a specific time. An `onTimeUpdate`
     * event will also be fired at the same time.
     */
    onSeeked: PropTypes.func,
    /**
     * Triggered when the active text track (captions/subtitles) changes. The
     * values will be `null` if text tracks are turned off.
     */
    onTextTrackChange: PropTypes.func,
    /**
     * Triggered when the current chapter changes.
     */
    onChapterChange: PropTypes.func,
    /**
     * Triggered when the active cue for the current text track changes. It also
     * fires when the active text track changes. There may be multiple cues
     * active.
     */
    onCueChange: PropTypes.func,
    /**
     * Triggered when the current time hits a registered cue point.
     */
    onCuePoint: PropTypes.func,
    /**
     * Triggered when the volume in the player changes. Some devices do not
     * support setting the volume of the video independently from the system
     * volume, so this event will never fire on those devices.
     */
    onVolumeChange: PropTypes.func,
    /**
     * Triggered when the playback rate changes.
     */
    onPlaybackRateChange: PropTypes.func,
    /**
     * Triggered when buffering starts in the player.
     * This is also triggered during preload and while seeking.
     */
    onBufferStart: PropTypes.func,
    /**
     * Triggered when buffering ends in the player.
     * This is also triggered at the end of preload and seeking.
     */
    onBufferEnd: PropTypes.func,
    /**
     * Triggered when a new video is loaded in the player.
     */
    onLoaded: PropTypes.func,
    /**
     * Triggered when the duration attribute has been updated.
     */
    onDurationChange: PropTypes.func,
    /**
     * Triggered when the player enters or exits fullscreen.
     */
    onFullscreenChange: PropTypes.func,
    /**
     * Triggered when the set quality changes.
     */
    onQualityChange: PropTypes.func,
    /**
     * Triggered when any of the camera properties change for 360° videos.
     */
    onCameraChange: PropTypes.func,
    /**
     * Triggered when the intrinsic size of the media changes.
     */
    onResize: PropTypes.func,
    /**
     * Triggered when the player enters picture-in-picture.
     */
    onEnterPictureInPicture: PropTypes.func,
    /**
     * Triggered when the player leaves picture-in-picture.
     */
    onLeavePictureInPicture: PropTypes.func,

    /* eslint-enable react/no-unused-prop-types */
  };
}

Vimeo.defaultProps = {
  autopause: true,
  autoplay: false,
  showByline: true,
  controls: true,
  loop: false,
  showPortrait: true,
  showTitle: true,
  muted: false,
  background: false,
  responsive: false,
  dnt: false,
  speed: false,
  keyboard: true,
  pip: false,
  playsInline: true,
  transparent: true,
};

export { useVimeo };
export default Vimeo;
