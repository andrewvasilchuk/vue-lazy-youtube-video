# vue-lazy-youtube-video

![Vue.js logo plus YouTube logo](./assets/img.jpg)

> 1.x documentation can be found [here](https://github.com/andrewvasilchuk/vue-lazy-youtube-video/tree/1.x).

- [vue-lazy-youtube-video](#vue-lazy-youtube-video)
  - [Features](#features)
  - [Installation](#installation)
    - [Via NPM](#via-npm)
    - [Via Yarn](#via-yarn)
    - [Directly in browser](#directly-in-browser)
  - [Initialization](#initialization)
    - [Styles](#styles)
    - [As a global component](#as-a-global-component)
    - [As a local component](#as-a-local-component)
    - [As a plugin](#as-a-plugin)
  - [Usage](#usage)
  - [Demo](#demo)
  - [API](#api)
    - [Properties](#properties)
    - [Events](#events)
    - [Methods](#methods)
    - [Slots](#slots)
    - [FAQ](#faq)
  - [Tests](#tests)
    - [Unit](#unit)
  - [TypeScript support](#typescript-support)
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

### Directly in browser

```html
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<!-- Styles with CSS Custom Properties -->
<link rel="stylesheet" href="https://unpkg.com/vue-lazy-youtube-video/dist/style.css"></link>
<!-- Minified styles with CSS Custom Properties -->
<!-- <link rel="stylesheet" href="https://unpkg.com/vue-lazy-youtube-video/dist/style.min.css"></link> -->
<!-- Styles without CSS Custom Properties -->
<!-- <link rel="stylesheet" href="https://unpkg.com/vue-lazy-youtube-video/dist/style.simplified.css"></link> -->
<!-- Minified styles without CSS Custom Properties -->
<!-- <link rel="stylesheet" href="https://unpkg.com/vue-lazy-youtube-video/dist/style.simplified.min.css"></link> -->
<script src="https://unpkg.com/vue-lazy-youtube-video"></script>
<script>
  // as a plugin
  Vue.use(VueLazyYoutubeVideo.Plugin)
  // as a component
  Vue.use('LazyYoutubeVideo', VueLazyYoutubeVideo.default)
</script>
```

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

[1]: https://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
[2]: https://developers.google.com/youtube/player_parameters#enablejsapi
[3]: https://developers.google.com/youtube/iframe_api_reference#Getting_Started
[4]: https://developers.google.com/youtube/player_parameters#IFrame_Player_API
[5]: https://developers.google.com/youtube/player_parameters#Parameters

| Property             | Required | Type                                     | Default                                                                                                                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------------- | -------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`                | `true`   | `string`                                 |                                                                                                                               | `<iframe />`'s `src` attribute in `https://www.youtube.com/embed/[VIDEO_ID]` format. URL can contain any `query` part, but notice that `autoplay=1` is always appended                                                                                                                                                                                                                                                                 |
| `alt`                | `false`  | `string`                                 | `Video thumbnail`                                                                                                             | Value of the `alt` attribute of the thumbnail `<img />` element                                                                                                                                                                                                                                                                                                                                                                        |
| `buttonLabel`        | `false`  | `string`                                 | `Play video`                                                                                                                  | Value of the `aria-label` attribute of the play `<button></button>` element. Improves a11y                                                                                                                                                                                                                                                                                                                                             |
| `aspectRatio`        | `false`  | `string`                                 | `16:9`                                                                                                                        | Aspect ratio of the video. This prop helps to save proportions of the video on different container sizes. Should match the `number:number` pattern                                                                                                                                                                                                                                                                                     |
| `previewImageSize`   | `false`  | `string`                                 | `maxresdefault`                                                                                                               | Size of the thumbnail, generated by YouTube. Available variants: `default`, `mqdefault`, `sddefault`, `hqdefault`, `maxresdefault`. [More info][1]                                                                                                                                                                                                                                                                                     |
| `thumbnail`          | `false`  | `{ webp: string, jpg: string}`           |                                                                                                                               | Custom thumbnail object, which should contain two keys: `webp` and `jpg`. Value of the key is the path to the custom thumbnail image                                                                                                                                                                                                                                                                                                   |
| `iframeAttributes`   | `false`  | `object`                                 | `{ allowfullscreen: true, frameborder: 0, allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' }` | Custom attributes that will be assigned to the `<iframe />` element                                                                                                                                                                                                                                                                                                                                                                    |
| `webp`               | `false`  | `boolean`                                | `true`                                                                                                                        | Whether or not try to load `.webp` thumbnail in favor of `.jpg`. Note that old videos may not have generated `.webp` thumbnail                                                                                                                                                                                                                                                                                                         |
| `autoplay`           | `false`  | `boolean`                                | `false`                                                                                                                       | Whether or not to play video as soon as component mounts into the DOM                                                                                                                                                                                                                                                                                                                                                                  |
| `thumbnailListeners` | `false`  | `Record<string, Function \| Function[]>` |                                                                                                                               | Listeners that will be attached to the preview thumbnail                                                                                                                                                                                                                                                                                                                                                                               |
| `enablejsapi`        | `false`  | `boolean`                                | `false`                                                                                                                       | Include [`'enablejapi=1'`][2] parameter to the generated `src` attribute of the `<iframe />` element. This will allow you to listen to the `init:player` event as well as access the `YT.Player` instance via the `getPlayerInstance` method. **Make sure** you have injected the proper YouTube [`<script />`](https://developers.google.com/youtube/player_parameters#IFrame_Player_API) tag or passed the `injectPlayerScript` prop |
| `playerOptions`      | `false`  | `Partial<YT.PlayerOptions>`              | `{}`                                                                                                                          | Options the will be passed to the [`YT.Player`][3] constructor                                                                                                                                                                                                                                                                                                                                                                         |
| `injectPlayerScript` | `false`  | `boolean`                                | `false`                                                                                                                       | Will auto inject the proper YouTube [`<script />`][4] when `enablejapi` is passed and there is no `window.YT.Player`                                                                                                                                                                                                                                                                                                                   |
| `parameters`         | `false`  | `YT.Parameters`                          | `{}`                                                                                                                          | [YouTube Parameters][5] that will be injected into the generated `<iframe />` `src` attribute                                                                                                                                                                                                                                                                                                                                          |

### Events

| Name            | Payload                          | Description                                                  |
| --------------- | -------------------------------- | ------------------------------------------------------------ |
| `'load:iframe'` | `{ iframe?: HTMLIFrameElement }` | Happens when native' `<iframe />` element `load` event fires |
| `'init:player'` | `{ instance: YT.Player }`        | Happens when the `YT.Player` instance is instantiated        |

### Methods

| Name                | Type                        | Description                                                                                                                                                                 |
| ------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getPlayerInstance` | `() => Nullable<YT.Plater>` | Returns an instance of the `YT.Player` when the `enablejapi` prop is passed and the `YT.Player` is initialized (check `'init:player'` event), in other cases returns `null` |

### Slots

Component provides some `slots`.

The list of available slots is listed below:

| Slot     | Description                                                     |
| -------- | --------------------------------------------------------------- |
| `button` | Slot gives an ability to provide custom play button             |
| `icon`   | Slot gives an ability to provide custom icon of the play button |

> ⚠️ **Note**, that when `button` slot is passed and this slot contains `<button></button>`, ones should not to forget to add `aria-label` (if this button contains only icon) and `type="button"` attributes. Also, if that button do not contain `.y-video-button` class, all default styles will be lost, so style concerns it's up to developer.

### FAQ

**Question**: How to play/pause/stop a video?

**Answer**: Pass the `enablejapi` prop and then listen to `'init:player'` event to get an instance of the `YT.Player`. All the available instance methods you can find [here](https://developers.google.com/youtube/iframe_api_reference). Hint: You can also get a player instance via the `getPlayerInstance` method.

<details>
<summary>Code</summary>

```html
<LazyYoutubeVideo
  ref="youtube"
  src="..."
  enablejsapi
  @init:player="onPlayerInit"
/>
```

```ts
import { InitPlayerEventPayload } from 'vue-lazy-youtube-video'
{
  // ...
  methods: {
    onPlayerInit(payload: InitPlayerEventPayload) {
      console.log(payload.instance)
      console.log(this.$refs.youtube.getPlayerInstance())
    },
  },
  // ...
}
```

</details>

## Tests

You can run unit tests by running the next command:

```bash
npm run test
```

### Unit

Jest is used for unit-tests.

[`Jest`](https://jestjs.io) and [`VueTestUtils`](https://vue-test-utils.vuejs.org) is used for unit tests.

You can run unit tests by running the next command:

```bash
npm run test:unit
```

## TypeScript support

Component is completely built and tested using TypeScript.

Here is the list of the types you can use:

```ts
// import type {} TypeScript 3.8 +
import {
  Props,
  LoadIframeEventPayload,
  InitPlayerEventPayload,
  Thumbnail,
} from 'vue-lazy-youtube-video'
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
├── style.min.css
├── style.simplified.css
├── style.simplified.min.css
```

## Powered by

- [`Vue`](https://vuejs.org)
- [`Rollup`](https://rollupjs.org/guide/en) (and plugins)
- [`Babel`](https://babeljs.io)
- [`Jest`](https://jestjs.io)
- [`Vue Test Utils`](http://vue-test-utils.vuejs.org)
- [`TypeScript`](http://www.typescriptlang.org)
- [`PostCSS`](https://postcss.org)

## Inspiration

Inspired by [Vadim Makeev](https://pepelsbey.net). Vadim created a comprehensive tutorial in which he shows how to lazyload YouTube videos properly.

## License

[MIT](http://opensource.org/licenses/MIT)
