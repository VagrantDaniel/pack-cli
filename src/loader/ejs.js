const path = require('path')

module.exports = function ejsLoader(source) {
  const opts = {
    filename: path.relative(process.cwd(), this.resourcePath),
  }

  return `
    const ejs = require('ejs')

    module.exports = function (templateParams) {
      return ejs.compile(${JSON.stringify(source)}, ${JSON.stringify(opts)})(templateParams)
    }
  `
}
