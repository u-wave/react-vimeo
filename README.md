# @u-wave/react-vimeo

Vimeo player component for React.

[Install][] - [Usage][] - [Demo][] - [Props][]

## Install

```
npm install --save @u-wave/react-vimeo
```

## Usage

[Demo][] - [Demo source code][]

```js
import Vimeo from '@u-wave/react-vimeo';

<Vimeo
  video="x2to0hs"
  autoplay
/>
```

## Props
| Name | Type | Default | Description |
|:-----|:-----|:-----|:-----|
| video | number, string |  | A Vimeo video ID or URL. |
| id | string |  | DOM ID for the player element. |
| className | string |  | CSS className for the player element. |
| style | object |  | Inline style for container element. |
| width | number, string |  | Width of the player element. |
| height | number, string |  | Height of the player element. |
| paused | bool |  | Pause the video. |
| volume | number |  | The playback volume as a number between 0 and 1. |
| start | number |  | The time in seconds at which to start playing the video. |
| autopause | bool | true | Pause this video automatically when another one plays. |
| autoplay | bool | false | Automatically start playback of the video. Note that this won’t work on some devices. |
| showByline | bool | true | Show the byline on the video. |
| color | string |  | Specify the color of the video controls. Colors may be overridden by the embed settings of the video. _(Ex: "ef2f9f")_ |
| dnt | bool | false | Blocks the player from tracking any session data, including all cookies and analytics. |
| controls | bool | true | Hide all elements in the player, such as the progress bar, sharing buttons, etc. (requires Vimeo PRO / Business account) |
| loop | bool | false | Play the video again when it reaches the end. |
| showPortrait | bool | true | Show the portrait on the video. |
| showTitle | bool | true | Show the title on the video. |
| muted | bool | false | Starts in a muted state to help with autoplay |
| background | bool | false | Starts in a background state with no controls to help with autoplay |
| responsive | bool | false | Enable responsive mode and resize according to parent element (experimental) |
| playbackRate | number | | Specify playback rate (requires Vimeo PRO / Business account)
| speed | bool | false | Enable playback rate controls (requires Vimeo PRO / Business account) |
| keyboard | bool | true | Allows for keyboard input to trigger player events. |
| pip | bool | false | Show the picture-in-picture button in the controlbar and enable the picture-in-picture API. |
| playsInline | bool | true | Play video inline on mobile devices, to automatically go fullscreen on playback set this parameter to false. |
| quality | string |  | Vimeo Plus, PRO, and Business members can default an embedded video to a specific quality on desktop. |
| textTrack | string |  | Turn captions/subtitles on for a specific language by default. |
| transparent | bool | true | The responsive player and transparent background are enabled by default, to disable set this parameter to false. |
| onReady | function |  | Sent when the Vimeo player API has loaded. Receives the Vimeo player object in the first parameter. |
| onError | function |  | Sent when the player triggers an error. |
| onPlay | function |  | Triggered when video playback is initiated. |
| onPlaying | function |  | Triggered when the video starts playing. |
| onPause | function |  | Triggered when the video pauses. |
| onEnd | function |  | Triggered any time the video playback reaches the end. Note: when `loop` is turned on, the ended event will not fire. |
| onTimeUpdate | function |  | Triggered as the `currentTime` of the video updates. It generally fires every 250ms, but it may vary depending on the browser. |
| onProgress | function |  | Triggered as the video is loaded. Reports back the amount of the video that has been buffered. |
| onSeeked | function |  | Triggered when the player seeks to a specific time. An `onTimeUpdate` event will also be fired at the same time. |
| onTextTrackChange | function |  | Triggered when the active text track (captions/subtitles) changes. The values will be `null` if text tracks are turned off. |
| onCueChange | function |  | Triggered when the active cue for the current text track changes. It also fires when the active text track changes. There may be multiple cues active. |
| onCuePoint | function |  | Triggered when the current time hits a registered cue point. |
| onVolumeChange | function |  | Triggered when the volume in the player changes. Some devices do not support setting the volume of the video independently from the system volume, so this event will never fire on those devices. |
| onPlaybackRateChange | function |  | Triggered when the playback rate changes. |
| onLoaded | function |  | Triggered when a new video is loaded in the player. |

## Related

 - [@u-wave/react-youtube][] - A YouTube component with a similar declarative API.
 - [react-dailymotion][] - A Dailymotion component with a similar declarative API.

## License

[MIT]

[Install]: #install
[Usage]: #usage
[Props]: #props
[Demo]: https://u-wave.github.io/react-vimeo
[Demo source code]: ./example
[MIT]: ./LICENSE
[@u-wave/react-youtube]: https://github.com/u-wave/react-youtube
[react-dailymotion]: https://github.com/u-wave/react-dailymotion
