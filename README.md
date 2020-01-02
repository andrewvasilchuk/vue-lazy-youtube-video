# vue-lazy-youtube-video

![Vue.js logo plus YouTube logo](./assets/img.jpg)

> 1.x documentation can be found [here](https://github.com/andrewvasilchuk/vue-lazy-youtube-video/tree/1.x).

- [vue-lazy-youtube-video](#vue-lazy-youtube-video)
  - [Features](#features)
  - [Installation](#installation)
    - [Via NPM](#via-npm)
    - [Via Yarn](#via-yarn)
  - [Initialization](#initialization)
    - [Styles](#styles)
    - [As a global component](#as-a-global-component)
    - [As a local component](#as-a-local-component)
    - [As a plugin](#as-a-plugin)
  - [Usage](#usage)
  - [Demo](#demo)
  - [API](#api)
    - [Properties](#properties)
    - [Slots](#slots)
  - [Tests](#tests)
    - [Unit](#unit)
  - [Development](#development)
  - [Build](#build)
  - [Powered by](#powered-by)
  - [Inspiration](#inspiration)
  - [License](#license)

## Features

- reduces initial load size by ~1.1MB per video
- built with a11y in mind – fully accessible via keyboard and to screen readers
- `.webp` thumbnail format for modern browsers that support it, with `.jpg` fallback for browsers that don't
- fully customizable through `props` and `slots`

## Installation

### Via NPM

```bash
$ npm install vue-lazy-youtube-video --save
```

### Via Yarn

```bash
$ yarn add vue-lazy-youtube-video
```

[comment]: <> (Add note about installation directly in browser)

## Initialization

### Styles

```js
import 'vue-lazy-youtube-video/dist/style.css'
```

### As a global component

> ⚠️ It must be called before `new Vue()`.

```js
import Vue from 'vue'
import LazyYoutubeVideo from 'vue-lazy-youtube-video'

Vue.component('LazyYoutubeVideo', LazyYoutubeVideo)
```

### As a local component

```js
import LazyYoutubeVideo from 'vue-lazy-youtube-video'

export default {
  name: 'YourAwesomeComponent',
  components: {
    LazyYoutubeVideo,
  },
}
```

### As a plugin

> ⚠️ It must be called before `new Vue()`.

```js
import Vue from 'vue'
import { Plugin } from 'vue-lazy-youtube-video'

Vue.use(Plugin)
```

## Usage

```vue
<template>
  <LazyYoutubeVideo src="https://www.youtube.com/embed/4JS70KB9GS0" />
</template>
```

## Demo

[![Edit vue-lazy-youtube-video](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/x7nrwxq6qo)

## API

### Properties

The list of available `props` (with their types, default values and descriptions) is listed below:

| Property           | Required | Type                           | Default                                                                                                                       | Description                                                                                                                                                                                                                                               |
| ------------------ | -------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`              | `true`   | `string`                       |                                                                                                                               | `<iframe />`'s `src` attribute in `https://www.youtube.com/embed/[VIDEO_ID]` format. URL can contain any `query` part, but notice that `autoplay=1` is always appended.                                                                                   |
| `alt`              | `false`  | `string`                       | `Video thumbnail`                                                                                                             | Value of the `alt` attribute of the thumbnail `<img />` element                                                                                                                                                                                           |
| `buttonLabel`      | `false`  | `string`                       | `Play video`                                                                                                                  | Value of the `aria-label` attribute of the play `<button></button>` element. Improves a11y.                                                                                                                                                               |
| `aspectRatio`      | `false`  | `string`                       | `16:9`                                                                                                                        | Aspect ratio of the video. This prop helps to save proportions of the video on different container sizes. Should match the `number:number` pattern                                                                                                        |
| `previewImageSize` | `false`  | `string`                       | `maxresdefault`                                                                                                               | Size of the thumbnail, generated by YouTube. Available variants: `default`, `mqdefault`, `sddefault`, `hqdefault`, `maxresdefault`. [More info](https://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api). |
| `thumbnail`        | `false`  | `{ webp: string, jpg: string}` |                                                                                                                               | Custom thumbnail object, which should contain two keys: `webp` and `jpg`. Value of the key is the path to the custom thumbnail image                                                                                                                      |
| `iframeAttributes` | `false`  | `object`                       | `{ allowfullscreen: true, frameborder: 0, allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' }` | Custom attributes that will be assigned the `<iframe />`                                                                                                                                                                                                  |
| `webp`             | `false`  | `boolean`                      | `true`                                                                                                                        | Whether or not try to load `.webp` thumbnail in favor of `.jpg`. Note that old videos may not have generated `.webp` thumbnail.                                                                                                                           |
| `autoplay`         | `false`  | `boolean`                      | `false`                                                                                                                       | Whether or not to play video as soon as `<iframe />` mounts into the DOM                                                                                                                                                                                  |

### Slots

Component provides some `slots`.

The list of available slots are listed below:

| Slot     | Description                                                      |
| -------- | ---------------------------------------------------------------- |
| `button` | Slot gives an ability to provide custom play button              |
| `icon`   | Slot gives yan ability to provide custom icon of the play button |

> ⚠️ **Note**, that when `button` slot is passed and that slot contains `<button></button>`, ones should not to forget to add `aria-label` attribute. Also, if that button do not contain `.y-video-button` class, all default styles will be lost, so style concerns it's up to developer.

## Tests

### Unit

[`Jest`](https://jestjs.io) and [`VueTestUtils`](https://vue-test-utils.vuejs.org) is used for unit tests.

You can run unit tests by running the next command:

```bash
npm run test:unit
```

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev` script

## Build

To build the production ready bundle simply run `npm run build`:

After the successful build the following files will be generated in the `dist` folder:

```
├── vue-lazy-youtube-video.common.js
├── vue-lazy-youtube-video.esm.js
├── vue-lazy-youtube-video.js
├── vue-lazy-youtube-video.min.js
├── style.css
```

## Powered by

- `Rollup` (and plugins)
- `Babel`
- `Jest`
- `Vue Test Utils`
- `TypeScript`

## Inspiration

Inspired by [Vadim Makeev](https://pepelsbey.net). Vadim created a comprehensive tutorial in which he shows how to lazyload YouTube videos properly.

## License

[MIT](http://opensource.org/licenses/MIT)
