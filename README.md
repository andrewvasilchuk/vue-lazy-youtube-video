# vue-lazy-youtube-video

![Vue.js logo plus YouTube logo](./assets/img.jpg)

## Features

* a11y included.
* `.webp` preview img format for modern browsers that support it, with `.jpg` fallback for browsers that don't.
* reduced initial load size by ~1.1MB per video.

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

It must be called before new Vue ()

```javascript
import Vue from "vue";
import LazyYoutubeVideo from "vue-lazy-youtube-video";

Vue.component("LazyYoutubeVideo", LazyYoutubeVideo);
```

### As a local component

```javascript
import LazyYoutubeVideo from "vue-lazy-youtube-video";

export default {
  name: "YourAwesomeComponent",
  components: {
    LazyYoutubeVideo
  }
}
```

## 🚀 Usage

```vue
<template>
  <LazyYoutubeVideo url="https://www.youtube.com/watch?v=[VIDEO_ID]" />
</template>
```

## ⚙️ Properties

| Property    | Required | Type   | Default                     | Description                                                                           |
|-------------|----------|--------|-----------------------------|---------------------------------------------------------------------------------------|
| url         | `true`   | String |                             | Video url in https://www.youtube.com/watch?v=VIDEO_ID format                          |
| alt         | `false`  | String | `"Video alternative image"` | Alternative text of the preview image                                                 |
| buttonLabel | `false`  | String | `"Play video"`              | `aria-label` attribute value of the play button. It improves a11y.                    |
| aspectRatio | `false`  | String | `"16:9"`                    | Aspect ratio. It helps to save proportions of the video on different container sizes. |

## ⚙️ Events

| Name        | Type         | Usage                                                                 |
| ----------- | ------------ | --------------------------------------------------------------------- |
| videoLoaded | `() => void` | The event that is triggered when the iframe is inserted into the DOM. |

## 💉 Tests
Jest is used for unit-tests.

You can run tests by typing this command in your console:

```bash
npm run test
```

## Powered by

* Babel
* Webpack 4
* Vue
* SASS

## Inspiration

Inspired by [Vadim Makeev](https://pepelsbey.net). Vadim created a comprehensive tutorial in which he shows how to lazyload YouTube videos properly.

## 🔒 License

[MIT](http://opensource.org/licenses/MIT)