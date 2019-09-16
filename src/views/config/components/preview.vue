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

<style lang="">
  
</style>