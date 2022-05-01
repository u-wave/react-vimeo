import * as React from 'react'
import {
  CameraChangeEvent,
  ChapterChangeEvent,
  CueChangeEvent,
  CuePointEvent,
  DurationChangeEvent,
  Error,
  FullScreenChangeEvent,
  LoadedEvent,
  PlaybackRateEvent,
  Player,
  QualityChangeEvent,
  ResizeEvent,
  TextTrackChangeEvent,
  TimeEvent,
  VimeoVideoQuality,
  VolumeChangeEvent,
} from '@vimeo/player'

export interface VimeoOptions {
  /**
   * A Vimeo video ID or URL.
   */
  video: number | string
  /**
   * Width of the player element.
   */
  width?: number | string
  /**
   * Height of the player element.
   */
  height?: number | string

  /**
   * Pause the video.
   */
  paused?: boolean

  /**
   * The playback volume as a number between 0 and 1.
   */
  volume?: number

  /**
   * The time in seconds at which to start playing the video.
   */
  start?: number

  /**
   * Pause this video automatically when another one plays.
   */
  autopause?: boolean

  /**
   * Automatically start playback of the video. Note that this won’t work on
   * some devices.
   */
  autoplay?: boolean

  /**
   * Show the byline on the video.
   */
  showByline?: boolean

  /**
   * Specify the color of the video controls. Colors may be overridden by the
   * embed settings of the video. _(Ex: "ef2f9f")_
   */
  color?: string

  /**
   * Hide all elements in the player (play bar, sharing buttons, etc).
   */
  controls?: boolean

  /**
   * Play the video again when it reaches the end.
   */
  loop?: boolean

  /**
   * Show the portrait on the video.
   */
  showPortrait?: boolean

  /**
   * Show the title on the video.
   */
  showTitle?: boolean

  /**
   * Starts in a muted state to help with autoplay
   */
  muted?: boolean

  /**
   * Starts in a background state with no controls to help with autoplay
   */
  background?: boolean

  /**
   * Enable responsive mode and resize according to parent element (experimental)
   */
  responsive?: boolean

  /**
   * Enable playback rate controls (requires Vimeo PRO / Business account)
   */
  speed?: boolean

  /**
   * Blocks the player from tracking any session data, including all cookies and analytics
   */
  dnt?: boolean

  /**
   * Allows for keyboard input to trigger player events.
   */
  keyboard?: boolean

  /**
   * Show the picture-in-picture button in the controlbar
   * and enable the picture-in-picture API.
   */
  pip?: boolean

  /**
   * Play video inline on mobile devices, to automatically
   * go fullscreen on playback set this parameter to false.
   */
  playsInline?: boolean

  /**
   * Vimeo Plus, PRO, and Business members can default
   * an embedded video to a specific quality on desktop.
   */
  quality?: VimeoVideoQuality

  /**
   * Turn captions/subtitles on for a specific language by default.
   */
  textTrack?: string

  /**
   * The responsive player and transparent background are enabled
   * by default, to disable set this parameter to false.
   */
  transparent?: boolean

  /**
   * Sent when the Vimeo player API has loaded.
   * Receives the Vimeo player object in the first parameter.
   */
  onReady?: (player: Player) => void
  /**
   * Sent when the player triggers an error.
   */
  onError?: (error: Error) => void
  /**
   * Triggered when the video plays.
   */
  onPlay?: (event: TimeEvent) => void
  /**
   * Triggered when the video pauses.
   */
  onPause?: (event: TimeEvent) => void
  /**
   * Triggered any time the video playback reaches the end.
   * Note: when `loop` is turned on, the ended event will not fire.
   */
  onEnd?: (event: TimeEvent) => void
  /**
   * Triggered as the `currentTime` of the video updates. It generally fires
   * every 250ms, but it may vary depending on the browser.
   */
  onTimeUpdate?: (event: TimeEvent) => void
  /**
   * Triggered as the video is loaded. Reports back the amount of the video
   * that has been buffered.
   */
  onProgress?: (event: TimeEvent) => void
  /**
   * Triggered when the player starts seeking to a specific time. An
   * `onTimeUpdate` event will also be fired at the same time.
   */
  onSeeking?: (event: TimeEvent) => void
  /**
   * Triggered when the player seeks to a specific time. An `onTimeUpdate`
   * event will also be fired at the same time.
   */
  onSeeked?: (event: TimeEvent) => void
  /**
   * Triggered when the active text track (captions/subtitles) changes. The
   * values will be `null` if text tracks are turned off.
   */
  onTextTrackChange?: (event: TextTrackChangeEvent) => void
  /**
   * Triggered when the current chapter changes.
   */
  onChapterChange?: (event: ChapterChangeEvent) => void
  /**
   * Triggered when the active cue for the current text track changes. It also
   * fires when the active text track changes. There may be multiple cues
   * active.
   */
  onCueChange?: (event: CueChangeEvent) => void
  /**
   * Triggered when the current time hits a registered cue point.
   */
  onCuePoint?: (event: CuePointEvent) => void
  /**
   * Triggered when the volume in the player changes. Some devices do not
   * support setting the volume of the video independently from the system
   * volume, so this event will never fire on those devices.
   */
  onVolumeChange?: (event: VolumeChangeEvent) => void
  /**
   * Triggered when the playback rate in the player changes.
   */
  onPlaybackRateChange?: (event: PlaybackRateEvent) => void
  /**
   * Triggered when buffering starts in the player. This is also triggered during preload and while seeking.
   */
  onBufferStart?: () => void
  /**
   * Triggered when buffering ends in the player. This is also triggered at the end of preload and seeking.
   */
  onBufferEnd?: () => void
  /**
   * Triggered when a new video is loaded in the player.
   */
  onLoaded?: (event: LoadedEvent) => void
  /**
   * Triggered when the duration attribute has been updated.
   */
  onDurationChange?: (event: DurationChangeEvent) => void
  /**
   * Triggered when the player enters or exits fullscreen.
   */
  onFullscreenChange?: (event: FullScreenChangeEvent) => void
  /**
   * Triggered when the set quality changes.
   */
  onQualityChange?: (event: QualityChangeEvent) => void
  /**
   * Triggered when any of the camera properties change for 360° videos.
   */
  onCameraChange?: (event: CameraChangeEvent) => void
  /**
   * Triggered when the intrinsic size of the media changes.
   */
  onResize?: (event: ResizeEvent) => void
  /**
   * Triggered when the player enters picture-in-picture.
   */
  onEnterPictureInPicture?: () => void
  /**
   * Triggered when the player leaves picture-in-picture.
   */
  onLeavePictureInPicture?: () => void
}

export interface VimeoProps extends VimeoOptions {
  /**
   * DOM ID for the player element.
   */
  id?: string
  /**
   * CSS className for the player element.
   */
  className?: string
  /**
   * Inline style for container element.
   */
  style?: React.CSSProperties
}

/**
 * Vimeo player component for React.
 */
export default class Vimeo extends React.Component<VimeoProps> {}
