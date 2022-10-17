import React from 'react';
import PropTypes from 'prop-types';
import Player from '@vimeo/player';
import eventNames from './eventNames';

class Vimeo extends React.Component {
  constructor(props) {
    super(props);

    this.refContainer = this.refContainer.bind(this);
  }

  componentDidMount() {
    this.createPlayer();
  }

  componentDidUpdate(prevProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const changes = Object.keys(this.props).filter((name) => this.props[name] !== prevProps[name]);

    this.updateProps(changes);
  }

  componentWillUnmount() {
    this.player.destroy();
  }

  /**
   * @private
   */
  getInitialOptions() {
    const { video } = this.props;
    const videoType = /^https?:/i.test(video) ? 'url' : 'id';
    /* eslint-disable react/destructuring-assignment */
    return {
      [videoType]: video,
      width: this.props.width,
      height: this.props.height,
      autopause: this.props.autopause,
      autoplay: this.props.autoplay,
      byline: this.props.showByline,
      color: this.props.color,
      controls: this.props.controls,
      loop: this.props.loop,
      portrait: this.props.showPortrait,
      title: this.props.showTitle,
      muted: this.props.muted,
      background: this.props.background,
      responsive: this.props.responsive,
      dnt: this.props.dnt,
      speed: this.props.speed,
      keyboard: this.props.keyboard,
      pip: this.props.pip,
      playsinline: this.props.playsInline,
      quality: this.props.quality,
      texttrack: this.props.textTrack,
      transparent: this.props.transparent,
    };
    /* eslint-enable react/destructuring-assignment */
  }

  /**
   * @private
   */
  updateProps(propNames) {
    const { player } = this;
    propNames.forEach((name) => {
      // eslint-disable-next-line react/destructuring-assignment
      const value = this.props[name];
      switch (name) {
        case 'autopause':
          player.setAutopause(value);
          break;
        case 'color':
          player.setColor(value);
          break;
        case 'loop':
          player.setLoop(value);
          break;
        case 'volume':
          player.setVolume(value);
          break;
        case 'paused':
          player.getPaused().then((paused) => {
            if (value && !paused) {
              return player.pause();
            }
            if (!value && paused) {
              return player.play();
            }
            return null;
          });
          break;
        case 'width':
        case 'height':
          player.element[name] = value;
          break;
        case 'video':
          if (value) {
            const { start } = this.props;
            const loaded = player.loadVideo(value);
            // Set the start time only when loading a new video.
            // It seems like this has to be done after the video has loaded, else it just starts at
            // the beginning!
            if (typeof start === 'number') {
              loaded.then(() => {
                player.setCurrentTime(start);
              });
            }
          } else {
            player.unload();
          }
          break;
        case 'playbackRate':
          player.setPlaybackRate(value);
          break;
        case 'quality':
          player.setQuality(value);
          break;
        default:
          // Nothing
      }
    });
  }

  /**
   * @private
   */
  createPlayer() {
    const { start, volume, playbackRate } = this.props;

    this.player = new Player(this.container, this.getInitialOptions());

    Object.keys(eventNames).forEach((dmName) => {
      const reactName = eventNames[dmName];
      this.player.on(dmName, (event) => {
        // eslint-disable-next-line react/destructuring-assignment
        const handler = this.props[reactName];
        if (handler) {
          handler(event);
        }
      });
    });

    const { onError, onReady } = this.props;
    this.player.ready().then(() => {
      if (onReady) {
        onReady(this.player);
      }
    }, (err) => {
      if (onError) {
        onError(err);
      } else {
        throw err;
      }
    });

    if (typeof start === 'number') {
      this.player.setCurrentTime(start);
    }

    if (typeof volume === 'number') {
      this.updateProps(['volume']);
    }

    if (typeof playbackRate === 'number') {
      this.updateProps(['playbackRate']);
    }
  }

  /**
   * @private
   */
  refContainer(container) {
    this.container = container;
  }

  render() {
    const { id, className, style } = this.props;

    return (
      <div
        id={id}
        className={className}
        style={style}
        ref={this.refContainer}
      />
    );
  }
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
     * Triggered when a new video is loaded in the player.
     */
    onLoaded: PropTypes.func,

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

export default Vimeo;
