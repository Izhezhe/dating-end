<template>
  <el-dialog :title="data.title" :visible.sync="viewVisible" @close="close()">
    {{data.content}}
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
    data: {
      type: Object,
      default: {}
    }
  },
  created() {
    
  },
  methods: {
    close() {
      this.$emit('viewHide')
    }
  }
}
</script>