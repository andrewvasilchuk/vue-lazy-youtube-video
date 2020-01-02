const path = require('path')
const cpFile = require('cp-file')

cpFile(
  path.join(__dirname, '../src/styles/index.css'),
  path.join(__dirname, '../dist/style.css')
)
