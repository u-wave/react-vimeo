# @u-wave/react-vimeo change log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

## 0.8.1
 * Add color string example to docs. (@ivoilic in #82)
 * Fix documentation for union prop types.

## 0.8.0
 * Add `controls` prop, set to `controls={false}` to disable UI on videos uploaded by pro accounts. (@ljmsouza in #81)

## 0.7.0
 * Add `responsive` prop that automatically fills the parent element. (@deJong in #80)

## 0.6.0
 * Add working `onReady` callback. You can use it to get access to the raw [@vimeo/player](https://github.com/vimeo/player.js) instance.

## 0.5.0
 * Clean up the `@vimeo/player` instance when unmounting.

## 0.4.0
 * Add `muted` and `background` props from new Vimeo player. (@pgib in #5)
