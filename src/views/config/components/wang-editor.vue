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
      const _this = this
      this.editor = new E(this.$refs.toolbar, this.$refs.editor)

      this.editor.customConfig.pasteFilterStyle = false // 关闭粘贴样式的过滤
      this.editor.customConfig.pasteIgnoreImg = true // 忽略粘贴内容中的图片
      this.editor.customConfig.showLinkImg = false // 隐藏“网络图片”tab
      this.editor.customConfig.uploadImgShowBase64 = true // baes64存储图片
      this.editor.customConfig.uploadFileName = '' // 后端接收上传文件的参数名
      this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为2M
      this.editor.customConfig.customUploadImg = function (files, insert) {
        // var imgUrl = _this.$store.dispatch('ImgUpload', files[0])
        // axios.post('http://image.zhzhao.top/', { bucket: 'dating-hb' }).then((res) => {
          const uploadToken = this.$store.getters.imgToken;
          var data = new FormData();
          data.append('token', uploadToken);
          data.append('file', files[0]);
          axios({
            method: 'POST',
            url: 'http://image.zhzhao.top/',
            data: data,
            onUploadProgress: function (progressEvent) {
              var percentCompleted = Math.round(progressEvent.loaded * 100 / progressEvent.total);
            },
          }).then((res) => {
            //  `http://publicimage.xq5.com/${response.data.key}`; （若bucket 参数为public-image则不需要下一步的图片地址获取可直接使用http://publicimage.xq5.com/ + ‘res.data.key’，拼接图片地址）
            console.log(res.data.key)
          })
        // 上传代码返回结果之后，将图片插入到编辑器中
        // insert(imgUrl)
      }

      // module.exports = {
      //   AccessKey: "8Kxy8jJP3LSW_olkF9_a5Hpt7qu9Jqu3zUeVz0U3",
      //   SecretKey: "WjbEVLtcLMQZbI3x_Lvx7l9QqSB3nBbefhFtoxCt",
      //   Bucket: "dating-hb",
      //   Port: 19110,
      //   UptokenUrl: "http://sys.zhzhao.top/image/uptoken",//直接填接口地址即可
      //   //uptoken: "接口获取到的token值", //和上面二选一即可，填接口获取到的值
      //   Domain: "http://image.zhzhao.top/"
      // }

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