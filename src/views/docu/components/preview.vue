<template>
  <div class="document-box">
    <el-dialog :visible.sync="viewVisible" width="890px" @close="close()">
      <div slot="title" class="title">
        <h1>{{title}}</h1>
      </div>
      <div v-html="data">
        {{data}}
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'preview',
  props: {
    viewVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: ''
    },
    data: {
      type: String,
      default: ''
    }
  },
  methods: {
    close() {
      this.$emit('viewHide')
    }
  }
}
</script>

<style type="text/css">
.document-box .title {
  text-align: center;
}
.document-box .title h1 {
  font-size: 28px;
  font-weight: normal;
}
.document-box .el-dialog__body {
  padding: 20px 40px 40px;
}
.document-box .el-dialog__body * {
  line-height: 1.5em;
  word-wrap: break-word;
}
</style>