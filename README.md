# vue-lazy-youtube-video

![Vue.js logo plus YouTube logo](./assets/img.jpg)

## Features

- reduces initial load size by ~1.1MB per video
- built with a11y in mind – fully accessible via keyboard and to screen readers
- `.webp` thumbnail format for modern browsers that support it, with `.jpg` fallback for browsers that don't
- fully customizable through `props` and `slots`

## 💿 Installation

### Via NPM

```bash
$ npm install vue-lazy-youtube-video --save
```

### Via Yarn

```bash
$ yarn add vue-lazy-youtube-video
```

## Initialization

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

## 🚀 Usage

```vue
<template>
  <LazyYoutubeVideo url="https://www.youtube.com/watch?v=[VIDEO_ID]" />
</template>
```

## ⚙️ Properties

| Property         | Required | Type    | Default             | Description                                                                                                                          |
| ---------------- | -------- | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| url              | `true`   | String  |                     | Video `URL` in https://www.youtube.com/watch?v=VIDEO_ID format                                                                       |
| query            | `false`  | String  | `'?autoplay=1'`     | [Query string](https://en.wikipedia.org/wiki/Query_string) which will be appended to the generated embed URL                         |
| alt              | `false`  | String  | `'Video thumbnail'` | Value of the `alt` attribute of the thumbnail `<img />` element                                                                      |
| buttonLabel      | `false`  | String  | `'Play video'`      | Value of the `aria-label` attribute of the play `<button></button>` element. Improves a11y                                           |
| aspectRatio      | `false`  | String  | `'16:9'`            | Aspect ratio. It helps to save proportions of the video on different container sizes                                                 |
| previewImageSize | `false`  | String  | `'maxresdefault'`   | Size of the thumbnail, generated by YouTube. Available variants: `default`, `mqdefault`, `sddefault`, `hqdefault`, `maxresdefault`   |
| thumbnail        | `false`  | Object  |                     | Custom thumbnail object, which should contain two keys: `webp` and `jpg`. Value of the key is the path to the custom thumbnail image |
| noCookie         | `false`  | Boolean | `false`             | Whether or not to enable privacy-enhanced mode. If `true` – component will insert `-nocookie` part into the generated embed link     |
| iframeAttributes | `false`  | Object  |                     | Custom attributes that will be assigned to the `<iframe />` element                                                                  |

## ⚙️ Events

| Name        | Type         | Usage                                                                     |
| ----------- | ------------ | ------------------------------------------------------------------------- |
| videoLoaded | `() => void` | The event that is triggered when the `<iframe>` is inserted into the DOM. |

## 💉 Tests

Jest is used for unit-tests.

### Unit

[`Jest`](https://jestjs.io) and [`VueTestUtils`](https://vue-test-utils.vuejs.org) is used for unit tests.

You can run unit tests by running the next command:

```bash
npm run test
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
```

## Powered by

- `Vue`
- `Rollup` (and plugins)
- `Babel`
- `Jest`
- `Vue Test Utils`
- `TypeScript`

## Inspiration

Inspired by [Vadim Makeev](https://pepelsbey.net). Vadim created a comprehensive tutorial in which he shows how to lazyload YouTube videos properly.

## 🔒 License

[MIT](http://opensource.org/licenses/MIT)
