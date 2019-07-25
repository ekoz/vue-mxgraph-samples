let mxgraphFactory = require('mxgraph')
// comment by eko.zhan at 2019-07-24 16:00
// fixme mxBasePath 等参数无效，目前是在 public/index.html 中定义
const factory = new mxgraphFactory({
  mxImageBasePath: './static/images',
  mxBasePath: './static'
})

// let _default = {}
// for (var name in factory) {
//   _default[name] = factory[name]
// }

// Editor doesn't created when mxGraph is used as npm module
// see https://github.com/jgraph/mxgraph/issues/49
window.mxGraph = factory.mxGraph
window.mxGraphModel = factory.mxGraphModel
window.mxEditor = factory.mxEditor
window.mxGeometry = factory.mxGeometry
window.mxDefaultKeyHandler = factory.mxDefaultKeyHandler
window.mxDefaultPopupMenu = factory.mxDefaultPopupMenu
window.mxStylesheet = factory.mxStylesheet
window.mxDefaultToolbar = factory.mxDefaultToolbar

module.exports = factory
