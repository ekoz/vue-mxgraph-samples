import {
  mxCylinder,
  mxUtils,
  mxCellRenderer,
  mxConstants,
  mxStencilRegistry,
  mxStencil
} from '@/assets/mxgraph/4.0.0/mxgraph'
// const shapes = require('./shapes.xml')
;(function() {
  // =====================================================
  // box 形状
  // =====================================================
  function BoxShape() {
    mxCylinder.call(this)
  }
  /*
       The next lines use an mxCylinder instance to augment the
       prototype of the shape ("inheritance") and reset the
       constructor to the topmost function of the c'tor chain.
  */
  mxUtils.extend(BoxShape, mxCylinder)
  // Defines the extrusion of the box as a "static class variable"
  BoxShape.prototype.extrude = 10

  BoxShape.prototype.redrawPath = function(path, x, y, w, h, isForeground) {
    var dy = this.extrude * this.scale
    var dx = this.extrude * this.scale

    if (isForeground) {
      path.moveTo(0, dy)
      path.lineTo(w - dx, dy)
      path.lineTo(w, 0)
      path.moveTo(w - dx, dy)
      path.lineTo(w - dx, h)
    } else {
      path.moveTo(0, dy)
      path.lineTo(dx, 0)
      path.lineTo(w, 0)
      path.lineTo(w, h - dy)
      path.lineTo(w - dx, h)
      path.lineTo(0, h)
      path.lineTo(0, dy)
      path.lineTo(dx, 0)
      path.close()
    }
  }

  mxCellRenderer.registerShape('box', BoxShape)
  // =====================================================
  // 从 xml 中加载 Shape，长方形-宽边弧线 TerminatorShape
  // demo: https://jgraph.github.io/mxgraph/javascript/examples/stencils.html
  // =====================================================
  // 注意，这个 shapes.xml 在 /public/ 路径下
  var req = mxUtils.load('./static/mxgraph/resources/shapes.xml')
  var root = req.getDocumentElement()
  var shape = root.firstChild

  while (shape != null) {
    if (shape.nodeType === mxConstants.NODETYPE_ELEMENT) {
      mxStencilRegistry.addStencil(
        shape.getAttribute('name'),
        new mxStencil(shape)
      )
    }
    shape = shape.nextSibling
  }
})()
