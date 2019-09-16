<template>
  <div class="editor">
    <div ref="toolbar" class="toolbar"></div>
    <div ref="editor" class="text"></div>
  </div>
</template>

<script>
import E from 'wangeditor'
import { tempGet } from '@/api/config'
export default {
  name: 'editor-bar',
  data() {
    return {
      editor: null,
      info_: null
    }
  },
  model:{
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.setEditor()
  },
  methods: {
    setEditor() {
      this.editor = new E(this.$refs.toolbar, this.$refs.editor)

      this.editor.customConfig.showLinkImg = false // 隐藏“网络图片”tab
      this.editor.customConfig.uploadImgShowBase64 = true // baes64存储图片
      this.editor.customConfig.uploadFileName = '' // 后端接收上传文件的参数名
      this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为2M

      // 配置菜单
      this.editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        // 'emoticon',  // 表情
        'image',  // 插入图片
        'table',  // 表格
        // 'video',  // 插入视频
        'code',  // 插入代码
        'undo',  // 撤销
        'redo'  // 重复
      ]
      
      this.editor.customConfig.onchange = (html) => {
        this.info_ = html // 绑定当前逐渐的值
        this.$emit('change', this.info_)
      }

      this.editor.create()
    },
  },
  watch: {
    isClear(val) {
      if (val) {
        this.editor.txt.clear()
        this.info_ = null
      }
    },
    value(val) {
      // 使用 v-model 时，设置初始值
      this.editor.txt.html(val)
    },
    // curConfig(val) {
    //   console.log(val)
    //   console.log(this.curConfig)
    // },
  },
}
</script>

<style lang="scss" scope>
  .editor {
    width: 80%;
    margin: 0 auto;
  }
  .toolbar {
    border: 1px solid #ccc;
    >div {
      z-index: 1005!important;
    }
  }
  .text {
    border: 1px solid #ccc;
    height: 450px;
    z-index: 1000!important;
  }
</style>