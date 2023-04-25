import { Plugin } from 'vue'

import VueLazyYoutubeVideo from '../src/VueLazyYoutubeVideo.vue'

export default VueLazyYoutubeVideo

export declare const Plugin: Plugin<never>

export * from '../src/types'

export type Props = InstanceType<typeof VueLazyYoutubeVideo>['$props']
