const fs = require('fs')
const path = require('path')
const cpFile = require('cp-file')
const postcss = require('postcss')
const cssnano = require('cssnano')
const postcssCustomProperties = require('postcss-custom-properties')

const PATH_TO_FILE = path.join(__dirname, '../src/styles/index.css')
const PATH_TO_MINIFIED_FILE = path.join(__dirname, '../dist/style.min.css')
const PATH_TO_SIMPLIFIED_FILE = path.join(
  __dirname,
  '../dist/style.simplified.css'
)
const PATH_TO_SIMPLIFIED_MINIFIED_FILE = path.join(
  __dirname,
  '../dist/style.simplified.min.css'
)

cpFile(PATH_TO_FILE, path.join(__dirname, '../dist/style.css')).then(() => {
  postcss([cssnano()])
    .process(fs.readFileSync(PATH_TO_FILE), {
      from: PATH_TO_FILE,
      to: PATH_TO_MINIFIED_FILE,
    })
    .then(result => {
      fs.writeFile(PATH_TO_MINIFIED_FILE, result.css, () => true)
    })

  postcss([
    postcssCustomProperties({
      preserve: false,
    }),
  ])
    .process(fs.readFileSync(PATH_TO_FILE), {
      from: PATH_TO_FILE,
      to: PATH_TO_SIMPLIFIED_FILE,
    })
    .then(result => {
      fs.writeFile(PATH_TO_SIMPLIFIED_FILE, result.css, () => {
        postcss([cssnano()])
          .process(fs.readFileSync(PATH_TO_SIMPLIFIED_FILE), {
            from: PATH_TO_SIMPLIFIED_FILE,
            to: PATH_TO_SIMPLIFIED_MINIFIED_FILE,
          })
          .then(result => {
            fs.writeFile(
              PATH_TO_SIMPLIFIED_MINIFIED_FILE,
              result.css,
              () => true
            )
          })
      })
    })
})
