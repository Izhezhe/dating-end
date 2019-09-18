<template>
  <el-dialog :title="title" :visible.sync="viewVisible" width="1000px" @close="close()">
    <div v-html="data">
      {{data}}
    </div>
  </el-dialog>
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

<style scoped>
  .el-dialog {
    max-width: 890px;
    width: auto;
    min-width: 280px;
    padding: 50px 75px;
    background: #b8dbf0;
  }
</style>