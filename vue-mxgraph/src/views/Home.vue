<template>
    <div class="app-container">
        <div id="toolbarContainer" ref="toolbarContainer" class="kbs-compt-list"/>
        <div
            id="graphContainer"
            ref="graphContainer"
            class="kbs-graph-container"
            @click="closeCellDialog"
        />
        <Vertex ref="dialogVertex"/>
    </div>
</template>

<script>
import { Graph } from './Graph'
import Vertex from './component/Vertex'

export default {
    components: { Vertex },
    data() {
        return {}
    },
    created() {
        this.$nextTick(() => {
            this.init()
        })
    },
    methods: {
        init() {
            const container = this.$refs.graphContainer
            const toolbarContainer = this.$refs.toolbarContainer
            const graph = new Graph(this, container, toolbarContainer)
            graph.init()
            // graph.draw()
            console.log(graph.mxGraph)
        },
        closeCellDialog(e) {
            // 单击画图面板关闭 vertex or edge dialog
            const elem = e.target
            if (elem.tagName === 'svg') {
                this.$refs.dialogVertex.dialogVertexVisible = false
            }
        }
    }
}
</script>
<style scoped>
.app-container {
    padding: 10px;
}
.kbs-graph-container {
    position: relative;
    overflow: auto;
    width: 100%;
    height: calc(100vh - 140px);
    cursor: default;
    background: url('../assets/mxgraph/4.0.0/images/grid.gif');
}
.kbs-graph-container-wrap {
    height: calc(100vh - 120px);
}
</style>
<style>
.kbs-compt-list {
    height: 50px;
    line-height: 50px;
    padding-top: 4px;
}
.kbs-compt-list img.mxToolbarMode {
    height: 30px;
    margin: 0 4px;
    padding: 2px;
}
.kbs-compt-list img.mxToolbarMode:hover {
    padding: 0;
}
</style>

