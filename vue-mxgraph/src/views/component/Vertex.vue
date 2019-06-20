<template>
  <div v-show="dialogVertexVisible" class="el-panel">
    <el-form :model="form">
      <el-form-item label="节点类型" :label-width="formLabelWidth">
        <el-select v-model="form.nodeType" placeholder="请选择节点类型">
          <el-option label="开始" value="0" />
          <el-option label="交互" value="1" />
          <el-option label="结束" value="-1" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户响应" :label-width="formLabelWidth">
        <el-input v-model="form.resp" type="textarea" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item>
        <el-button type="text" style="float:left">扩展响应</el-button>
        <el-button type="text" style="float:right">语音导入</el-button>
      </el-form-item>
      <el-form-item label="标准语速" :label-width="formLabelWidth">
        <el-input v-model="form.minSpeed" placeholder="30" style="width:60px;" />&nbsp;~&nbsp;
        <el-input v-model="form.minSpeed" placeholder="50" style="width:60px;" />&nbsp;字/分&nbsp;
      </el-form-item>
      <el-form-item label="考核标签" :label-width="formLabelWidth">
        <el-input v-model="form.resp" type="textarea" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dialogVertexVisible = false">确定</el-button>
        <el-button @click="dialogVertexVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'Vertex',
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '80px',
      dialogVertexVisible: false
    }
  }
}
</script>
<style scoped>
.el-panel {
    width: 400px;
    height: calc(100vh - 90px);
    position: absolute;
    top: 10px;
    right: 10px;
    background: #ffffff;
    padding: 20px;
    border-radius: 2px;
    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
</style>

