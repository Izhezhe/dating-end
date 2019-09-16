<template>
  <div class="app-container">
    <!-- <div class="page-title">{{previewData.title}}</div> -->
    <el-tabs v-model="curConfig" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in configType" :key="index" :label="item" :name="item"></el-tab-pane>
    </el-tabs>
    <editor-bar v-model="editor.info" :isClear="isClear"></editor-bar>
    <div class="page-footer">
      <el-button size="small" @click="isViewShow = true">预览</el-button>
      <el-button size="small" @click="save()">保存</el-button>
    </div>
    <preview @viewHide="isViewShow = false" :viewVisible="isViewShow" :title="curConfig" :data="editor.info"></preview>
  </div>
</template>

<script>
import { tempGet, tempUpdate } from '@/api/config'
import EditorBar from './components/wang-editor'
import Preview from './components/preview'
export default {
  name: 'about',
  data() {
    return {
      curConfig: 'about',
      configType: ['about', 'Terms & Conditions', 'Privacy Policy', 'Dating Securely', 'Help Center', 'Become A Partner'],

      editor: {
        info: ''
      },
      isClear: false,
      isViewShow: false,
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleClick() {
      this.getList();
    },
    getList() {
      tempGet({code: this.curConfig}).then(res => {
        this.editor.info = res.datas.content
        console.log(this.editor.info)
      })
    },

    // 保存
    save() {
      const data = {
        code: this.curConfig,
        content: this.editor.info,
        remark: ''
      }
      tempUpdate(data).then(res => {
        this.$message({
          message: res.repMsg,
          type: 'success'
        })
      })
    },
  },
  components: {
    EditorBar,
    Preview,
  },
}
</script>