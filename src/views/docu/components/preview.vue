<template>
  <div class="document-box">
    <el-dialog :title="title" :visible.sync="viewVisible" width="890px" @close="close()">
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
.document-box .el-dialog__header {
  text-align: center;
}
.document-box .el-dialog__body * {
  line-height: 1.5em;
}
</style>