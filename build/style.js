const fs = require('fs')
const path = require('path')
const cpFile = require('cp-file')
const postcss = require('postcss')
const postcssCustomProperties = require('postcss-custom-properties')

cpFile(
  path.join(__dirname, '../src/styles/index.css'),
  path.join(__dirname, '../dist/style.css')
)

postcss([
  postcssCustomProperties({
    preserve: false,
  }),
])
  .process(fs.readFileSync(path.resolve(__dirname, '../src/styles/index.css')))
  .then(result => {
    fs.writeFile(
      path.resolve(__dirname, '../dist/style.simplified.css'),
      result.css,
      () => true
    )
  })
