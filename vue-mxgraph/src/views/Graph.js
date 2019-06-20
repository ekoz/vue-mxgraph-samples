import {
  mxClient,
  mxUtils,
  mxEvent,
  mxGraph,
  mxConstants,
  mxPerimeter,
  mxGraphHandler,
  mxEdgeHandler,
  mxEdgeStyle,
  mxToolbar,
  mxCell,
  mxGeometry,
  mxUndoManager,
  mxPolyline,
  mxCellState,
  mxConnectionConstraint,
  mxShape,
  mxPoint,
  mxClipboard,
  mxKeyHandler,
  mxRubberband
} from '@/assets/mxgraph/4.0.0/mxgraph'

import rectangleImg from '@/assets/mxgraph/4.0.0/images/rectangle.png'
import ellipseImg from '@/assets/mxgraph/4.0.0/images/ellipse.png'
import rhombusImg from '@/assets/mxgraph/4.0.0/images/rhombus.png'
import triangleImg from '@/assets/mxgraph/4.0.0/images/triangle.gif'
import cylinderImg from '@/assets/mxgraph/4.0.0/images/cylinder.gif'
import actorImg from '@/assets/mxgraph/4.0.0/images/actor.gif'

class Graph {
  constructor(vm, containerEl, toolbarContainerEl) {
    this.version = '1.0.0'
    // graph 画板
    this.container = containerEl
    // 拖拽条，拖拽条也可以用
    this.toolbarContainer = toolbarContainerEl
    // mxGraph
    this.mxGraph = null
    // vm 实例
    this.vm = vm
    // 默认 vertex 样式
    this.defaultStyle = {
      width: 120,
      height: 60
    }
  }
  /* uuid */ uuid(len, radix) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split('')
    var uuid = []
    radix = radix || chars.length
    len = len || 32
    for (var i = 0; i < len; i++) {
      uuid[i] = chars[0 | (Math.random() * radix)]
    }
    return uuid.join('')
  }
  /* private*/ enableGuides() {
    // Enables guides
    mxGraphHandler.prototype.guidesEnabled = true

    // Alt disables guides
    mxGraphHandler.prototype.useGuidesForEvent = function(me) {
      return !mxEvent.isAltDown(me.getEvent())
    }

    // Defines the guides to be red (default)
    mxConstants.GUIDE_COLOR = '#FF0000'

    // Defines the guides to be 1 pixel (default)
    mxConstants.GUIDE_STROKEWIDTH = 1

    // Enables snapping waypoints to terminals
    mxEdgeHandler.prototype.snapToTerminals = true
  }
  /* private */ setCommonStyle() {
    // Changes some default colors
    // 选中 cell 后的连接点颜色
    mxConstants.HANDLE_FILLCOLOR = '#99ccff'
    mxConstants.HANDLE_STROKECOLOR = '#0088cf'
    // edge 连接点颜色
    mxConstants.CONNECT_HANDLE_FILLCOLOR = '#409EFF'
    // 控制 vertex connect hover 边框颜色
    mxConstants.DEFAULT_VALID_COLOR = '#409EFF'
    // 选中 edge 后的颜色
    mxConstants.EDGE_SELECTION_COLOR = '#00a8ff'
    // 选中 vertex 后的边框颜色
    mxConstants.VERTEX_SELECTION_COLOR = '#00a8ff'
  }
  /* private*/ setComponentsStyle() {
    const graph = this.mxGraph
    var vertexStyle = graph.getStylesheet().getDefaultVertexStyle()
    vertexStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE
    vertexStyle[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter
    vertexStyle[mxConstants.STYLE_ROUNDED] = true
    vertexStyle[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF'
    vertexStyle[mxConstants.STYLE_STROKECOLOR] = '#808080'
    vertexStyle[mxConstants.STYLE_GRADIENTCOLOR] = '#FFFFFF'
    vertexStyle[mxConstants.STYLE_FONTCOLOR] = '#5f5f5f'
    vertexStyle[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER
    vertexStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE
    vertexStyle[mxConstants.STYLE_FONTSIZE] = '12'
    vertexStyle[mxConstants.STYLE_FONTSTYLE] = 1

    var edgeStyle = graph.getStylesheet().getDefaultEdgeStyle()
    edgeStyle[mxConstants.STYLE_ROUNDED] = true
    edgeStyle[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector
    graph.alternateEdgeStyle = 'elbow=vertical'
  }
  /* private */ setKeyHandler() {
    const graph = this.mxGraph
    const vm = this.vm
    const undoManager = new mxUndoManager()
    const listener = function(sender, evt) {
      undoManager.undoableEditHappened(evt.getProperty('edit'))
    }
    graph.getModel().addListener(mxEvent.UNDO, listener)
    graph.getView().addListener(mxEvent.UNDO, listener)
    const keyHandler = new mxKeyHandler(graph)

    // 绑定删除键
    keyHandler.bindKey(46, function(evt) {
      if (graph.isEnabled()) {
        vm.$confirm('确定删除吗')
          .then(res => {
            graph.removeCells()
          })
          .catch(cancel => console.log(cancel))
      }
    })
    // 绑定Ctrl+A全选
    keyHandler.bindControlKey(65, function(evt) {
      if (graph.isEnabled()) {
        graph.selectAll()
      }
    })
    // 绑定Ctrl+C复制节点
    keyHandler.bindControlKey(67, function(evt) {
      if (graph.isEnabled()) {
        var cells = graph.getSelectionCells()
        if (cells.length > 0) {
          cells = graph.cloneCells(cells)
          var newCells = []
          // 修改 cells 中的元素属性
          cells.forEach(function(cell, i) {
            cell.id = ''
            cell.value = (cell.value || '') + '_1'
            newCells.push(cell)
          })
          mxClipboard.setCells(newCells)
          mxClipboard.paste(graph)
        }
      }
    })
    // 绑定Ctrl+S保存
    keyHandler.bindControlKey(83, function(evt) {
      if (graph.isEnabled()) {
        // saveXml(graph)
      }
    })
    // 绑定Ctrl+I新增
    // keyHandler.bindControlKey(73, function(evt) {
    //   if (graph.isEnabled()) {
    //     graph.insertVertex(
    //       graphParent,
    //       null,
    //       '请输入文本',
    //       10,
    //       10,
    //       100,
    //       40,
    //       mxStyleList.rectangle
    //     )
    //   }
    // })
    // 绑定Ctrl+Z撤销
    keyHandler.bindControlKey(90, function(evt) {
      if (graph.isEnabled()) {
        undoManager.undo()
      }
    })
    // 绑定Ctrl+Y重做
    keyHandler.bindControlKey(89, function(evt) {
      if (graph.isEnabled()) {
        undoManager.redo()
      }
    })

    graph.isCellDeletable = function(cell) {
      return true
    }
  }
  /* private */ openVertex(vertex) {
    const vm = this.vm
    // vm.$refs.dialogVertex.dialogVertexVisible = true
    vm.$set(vm.$refs.dialogVertex, 'dialogVertexVisible', true)
  }
  /* private */ openEdge(edge) {
    const vm = this.vm
  }
  init() {
    const _this = this
    // Checks if the browser is supported
    if (!mxClient.isBrowserSupported()) {
      // Displays an error message if the browser is not supported.
      mxUtils.error('Browser is not supported!', 200, false)
    } else {
      // Disables the built-in context menu
      mxEvent.disableContextMenu(this.container)

      this.enableGuides()
      this.setCommonStyle()

      // Creates the graph inside the given container
      var graph = new mxGraph(this.container)
      // Attention
      this.mxGraph = graph

      graph.setPanning(true)
      graph.setTooltips(true)
      graph.setConnectable(true)
      graph.setCellsResizable(true)

      // 设置节点 vertex and edge 双击事件
      // 节点双击事件，双击打开详情面板
      graph.addListener(mxEvent.CLICK, function(sender, evt) {
        var cell = evt.getProperty('cell')
        if (cell != null) {
          if (cell.vertex) {
            // console.log(cell.userData);
            if (cell.userData && cell.userData.isGroup) {
              // 组合双击不打开
            } else {
              console.log('I am vertex')
              _this.openVertex(cell)
            }
          } else if (cell.edge) {
            console.log('I am edge')
            // openEdge(cell)
          }
        }
      })

      // 设置 vertex 和 edge 的样式
      this.setComponentsStyle()

      // 设置 Guides
      graph.gridSize = 30

      // Enables rubberband selection
      new mxRubberband(graph)

      this.setKeyHandler()
      if (this.toolbarContainer) {
        this.initToolbar()
      }
    }
  }
  initToolbar() {
    const graph = this.mxGraph
    const toolbar = new mxToolbar(this.toolbarContainer)
    const _this = this

    // 处理toolbar
    toolbar.enabled = false
    addVertex(
      rectangleImg,
      _this.defaultStyle.width,
      _this.defaultStyle.height,
      ''
    )
    addVertex(
      ellipseImg,
      _this.defaultStyle.width,
      _this.defaultStyle.height,
      'shape=ellipse'
    )
    addVertex(
      rhombusImg,
      _this.defaultStyle.width,
      _this.defaultStyle.height,
      'shape=rhombus'
    )
    // addVertex(
    //   triangleImg,
    //   _this.defaultStyle.height,
    //   _this.defaultStyle.height,
    //   'shape=triangle'
    // )
    // addVertex(
    //   cylinderImg,
    //   _this.defaultStyle.height,
    //   _this.defaultStyle.height,
    //   'shape=cylinder'
    // )
    // addVertex(
    //   actorImg,
    //   _this.defaultStyle.height,
    //   _this.defaultStyle.height,
    //   'shape=actor'
    // )
    // toolbar.addLine();
    // toolbar 初始化完毕

    // 添加工作条元素
    function addVertex(icon, w, h, style) {
      var vertex = new mxCell('请输入文本', new mxGeometry(0, 0, w, h), style)
      vertex.setVertex(true)
      addToolbarItem(graph, toolbar, vertex, icon)
    }
    // 绑定工作条元素事件
    function addToolbarItem(graph, toolbar, prototype, image) {
      // Function that is executed when the image is dropped on
      // the graph. The cell argument points to the cell under
      // the mousepointer if there is one.
      var funct = function(graph, evt, cell) {
        graph.stopEditing(false)

        var pt = graph.getPointForEvent(evt)
        var vertex = graph.getModel().cloneCell(prototype)
        vertex.geometry.x = pt.x
        vertex.geometry.y = pt.y

        // 对新增的节点id给定uuid
        var cells = graph.importCells([vertex], 0, 0, cell)
        cells.forEach(function(item, i) {
          item.id = _this.uuid()
        })
        graph.setSelectionCells(cells)
      }

      // Creates the image which is used as the drag icon (preview)
      var img = toolbar.addMode(null, image, funct)
      mxUtils.makeDraggable(img, graph, funct)
    }
  }
  draw() {
    const graph = this.mxGraph
    // Gets the default parent for inserting new cells. This
    // is normally the first child of the root (ie. layer 0).
    var parent = graph.getDefaultParent()

    // Adds cells to the model in a single step
    graph.getModel().beginUpdate()
    try {
      var v1 = graph.insertVertex(
        parent,
        null,
        'Hello,',
        20,
        20,
        this.defaultStyle.width,
        this.defaultStyle.height
      )

      var v2 = graph.insertVertex(
        parent,
        null,
        'World!',
        200,
        150,
        this.defaultStyle.width,
        this.defaultStyle.height
      )
      var e1 = graph.insertEdge(parent, null, '', v1, v2)
    } finally {
      // Updates the display
      graph.getModel().endUpdate()
    }
  }
}

export { Graph }
