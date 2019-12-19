<template>
  <el-upload
        :action="domain"
        :data="QiniuData"
        :on-error="uploadError"
        :on-success="uploadSuccess"
        :before-upload="beforeAvatarUpload"
        :show-file-list="false"
        accept=".png"
      >
      <el-button size="small" type="primary">选择图片</el-button>
  </el-upload>
</template>

<script>
export default {
  name: 'upload',
  data() {
    return {
      loading: false,
      QiniuData: {
        // key: "", //图片名字处理
        token: "" //七牛云token
      },
      domain: "https://upload-z1.qiniup.com/", // 七牛云的上传地址（华南区）
      qiniuaddr: "http://image.zhzhao.top/", // 七牛云的图片外链地址
      uploadPicUrl: "", //提交到后台图片地址
      fileList: []
    }
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
      this.uploadPicUrl = `${this.qiniuaddr}${response.key}`;
      this.$emit('updateImage', this.uploadPicUrl);
    },
    uploadError(err, file, fileList) {
      this.$message({
        message: "上传出错，请重试！",
        type: "error",
        center: true
      });
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