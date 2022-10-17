import * as React from 'react'
import { Player, Error } from '@vimeo/player'

export type PlayEvent = {
  /**
   * The length of the video in seconds.
   */
  duration: number
  /**
   * The amount of the video, in seconds, that has played.
   */
  seconds: number
  /**
   * The amount of the video that has played in comparison to the length of the video;
   * multiply by 100 to obtain the percentage.
   */
  percent: number
}

export type PlayingEvent = PlayEvent;

export type PauseEvent = {
  /**
   * The length of the video in seconds.
   */
  duration: number
  /**
   * The amount of the video, in seconds, that has played to the pause position.
   */
  seconds: number
  /**
   * The amount of the video that has played to the pause position in comparison to the length of the video; multiply by 100 to obtain the percentage.
   */
  percent: number
}

export type EndEvent = PauseEvent

export type TimeUpdateEvent = {
  /**
   * The length of the video in seconds.
   */
  duration: number
  /**
   * The amount of the video, in seconds, that has played from the current playback position.
   */
  seconds: number
  /**
   * The amount of the video that has played from the current playback position in comparison to the length of the video; multiply by 100 to obtain the percentage.
   */
  percent: number
}

export type ProgressEvent = {
  /**
   * The length of the video in seconds.
   */
  duration: number
  /**
   * The amount of the video, in seconds, that has buffered.
   */
  seconds: number
  /**
   * The amount of the video that has buffered in comparison to the length of the video;
   * multiply by 100 to obtain the percentage.
   */
  percent: number
}

export type SeekedEvent = {
  /**
   * The length of the video in seconds.
   */
  duration: number
  /**
   * The amount of the video, in seconds, that has played from the new seek position.
   */
  seconds: number
  /**
  * The amount of the video that has played from the new seek position in comparison to the length of the video; multiply by 100 to obtain the percentage.
   */
  percent: number
}

export type TextTrackEvent = {
  kind: 'captions' | 'subtitles'
  label: string
  language: string
}

export type Cue = {
  html: string
  text: string
}

export type CueChangeEvent = {
  cues: Cue[]
  kind: 'captions' | 'subtitles'
  label: string
  language: string
}

export type CuePointEvent = {
  /**
   * The location of the cue point in seconds.
   */
  time: number
  /**
   * The ID of the cue point.
   */
  id: string
  /**
   * The custom data from the `addCuePoint()` call, or an empty object.
   */
  data: object
}

export type VolumeEvent = {
  /**
   * The new volume level.
   */
  volume: number
}

export type PlaybackRateEvent = {
  /**
   * The new playback rate.
   */
  playbackRate: number
}

export type LoadEvent = {
  /**
   * The ID of the new video.
   */
  id: number
}

export interface VimeoProps {
  /**
   * A Vimeo video ID or URL.
   */
  video: number | string
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
   * Hide all elements in the player, such as the progress bar, sharing buttons, etc.
   * (requires Vimeo PRO / Business account)
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
   * Specify playback rate (requires Vimeo PRO / Business account)
   */
  playbackRate?: number

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
  quality?: string

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
   * Triggered when video playback is initiated.
   */
  onPlay?: (event: PlayEvent) => void
  /**
   * Triggered when the video starts playing.
   */
  onPlaying?: (event: PlayingEvent) => void
  /**
   * Triggered when the video pauses.
   */
  onPause?: (event: PauseEvent) => void
  /**
   * Triggered any time the video playback reaches the end.
   * Note: when `loop` is turned on, the ended event will not fire.
   */
  onEnd?: (event: EndEvent) => void
  /**
   * Triggered as the `currentTime` of the video updates. It generally fires
   * every 250ms, but it may vary depending on the browser.
   */
  onTimeUpdate?: (event: TimeUpdateEvent) => void
  /**
   * Triggered as the video is loaded. Reports back the amount of the video
   * that has been buffered.
   */
  onProgress?: (event: ProgressEvent) => void
  /**
   * Triggered when the player seeks to a specific time. An `onTimeUpdate`
   * event will also be fired at the same time.
   */
  onSeeked?: (event: SeekedEvent) => void
  /**
   * Triggered when the active text track (captions/subtitles) changes. The
   * values will be `null` if text tracks are turned off.
   */
  onTextTrackChange?: (event: TextTrackEvent) => void
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
  onVolumeChange?: (event: VolumeEvent) => void
  /**
   * Triggered when the playback rate in the player changes.
   */
  onPlaybackRateChange?: (event: PlaybackRateEvent) => void
  /**
   * Triggered when a new video is loaded in the player.
   */
  onLoaded?: (event: LoadEvent) => void
}

/**
 * Vimeo player component for React.
 */
export default class Vimeo extends React.Component<VimeoProps> {}
