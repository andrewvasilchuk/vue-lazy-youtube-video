module.exports = {
  moduleFileExtensions: ['js', 'ts', 'json'],
  transform: {
    // process `*.ts` files with `ts-jest`
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverageFrom: ['./src/VueLazyYoutubeVideo.ts'],
}
