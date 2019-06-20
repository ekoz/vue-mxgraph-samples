let mxgraphFactory = require('mxgraph')
const factory = new mxgraphFactory({
  mxImageBasePath: 'assets/mxgraph/4.0.0/images',
  mxBasePath: 'assets/mxgraph/4.0.0'
})

// let _default = {}
// for (var name in factory) {
//   _default[name] = factory[name]
// }

module.exports = factory
