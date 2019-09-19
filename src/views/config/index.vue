<template>
  <div class="app-container">
    <!-- <div class="page-title">{{previewData.title}}</div> -->
    <el-tabs v-model="curConfig" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in configType" :key="index" :label="item" :name="item">
        <div class="remark"><label>备注：</label><el-input v-model="remark" placeholder="请输入备注"></el-input></div>
      </el-tab-pane>
    </el-tabs>
    <editor-bar v-model="editor.info" :isClear="isClear"></editor-bar>
    <div class="page-footer">
      <el-button size="small" @click="isViewShow = true">预览</el-button>
      <el-button size="small" type="primary" @click="save()">保存</el-button>
    </div>
    <preview @viewHide="isViewShow = false" :viewVisible="isViewShow" :title="curConfig" :data="editor.info"></preview>
  </div>
</template>

<script>
import { tempGet, tempSave } from '@/api/config'
import EditorBar from './components/wang-editor'
import Preview from './components/preview'
export default {
  name: 'about',
  data() {
    return {
      curConfig: 'About',
      configType: ['About', 'Terms & Conditions', 'Privacy Policy', 'Dating Securely', 'Help Center', 'Become A Partner'],
      remark: '',

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
        this.remark = res.datas.remark
        // console.log(this.editor.info)
      })
    },

    // 保存
    save() {
      const data = {
        code: this.curConfig,
        content: this.editor.info,
        remark: this.remark
      }
      tempSave(data).then(res => {
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

<style lang="scss" scoped>
  .remark {
    width: 80%;
    margin: 0 auto 10px;
    label {
      display: inline-block;
      width: 50px;
    }
    .el-input {
      width: calc(100% - 50px);
    }
  }
</style>