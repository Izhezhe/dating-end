<template>
  <el-upload
        :action="website.domain"
        :data="QiniuData"
        :on-error="uploadError"
        :on-success="uploadSuccess"
        :before-upload="beforeAvatarUpload"
        :show-file-list="false"
        :accept="accept"
      >
      <el-button size="small" type="primary">选择图片</el-button>
  </el-upload>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'upload',
  data() {
    return {
      loading: false,
      QiniuData: {
        // key: "", //图片名字处理
        token: "" //七牛云token
      },
      uploadPicUrl: "", //提交到后台图片地址
      fileList: []
    }
  },
  props: ['accept'],
  computed: {
    ...mapGetters(['website'])
  },
  mounted() {
    this.getToken()
  },
  methods: {
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Upload file size cannot exceed 2MB!')
        return false
      }
      // this.QiniuData.key = `upload_pic_${file.name}`;
    },
    uploadSuccess(response, file, fileList) {
      this.uploadPicUrl = `${this.website.qiniuaddr}${response.key}`;
      this.$emit('updateImage', this.uploadPicUrl);
    },
    uploadError(err, file, fileList) {
      this.$message({
        message: 'upload error',
        type: 'error'
      })
      this.$store.dispatch('LogOut').then(() => {
        this.$router.push({ path: '/login' }) // In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    getToken() {
      // 请求后台拿七牛云token
      this.$store.dispatch('GetImgToken').then(res => {
        this.QiniuData.token = res
      })
    }
  }
}
</script>