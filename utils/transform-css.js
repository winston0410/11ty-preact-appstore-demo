const path = require('path')
const postcss = require('postcss')
const postcssrc = require('postcss-load-config')

const ctx = { parser: true, map: 'inline' }

module.exports = async code => {
  const rawFilepath = path.join(__dirname, '../src/_includes/entry.css')

  return postcssrc(ctx).then(({
    plugins,
    options
  }) => {
    return postcss(plugins)
      .process(code, {
        from: undefined
      })
      .then((result) => result.css)
  })
}
