<template>
  <div>
    关于
    <editor-bar v-model="editor.info" :isClear="isClear"></editor-bar>
    <el-button @click="toPreview()">预览</el-button>
    <preview @viewHide="setViewHide" :viewVisible="isViewShow" :data="previewData"></preview>
  </div>
</template>

<script>
import EditorBar from './components/wang-editor'
import Preview from './components/preview'
export default {
  name: 'about',
  components: {
    EditorBar,
    Preview,
  },
  data() {
    return {
      editor: {
        info: ''
      },
      isClear: false,

      isViewShow: false,
      previewData: {
        title: '关于',
        content: ''
      }
    }
  },
  methods: {
    toPreview() {
      this.isViewShow = true
      // this.previewData.content = this.content
      console.log(this.editor.info)
    },
    setViewHide() {
      this.isViewShow = false
    }
  }
}
</script>