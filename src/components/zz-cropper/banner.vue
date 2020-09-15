<template>
  <el-dialog title="UPLOAD PROFILE PHOTO"
             :visible="isShowModel"
             class="jxf-upload scropper"
             @close="closeModel(false)" append-to-body :close-on-click-modal="false">
    <div class="cropper_content">
      <el-row :gutter="10">
        <el-col :span="24" class="imageArea" v-if="option.image">
          <vueCropper
            ref="cropper"
            :img="option.image"
            :info="true"
            :full="false"
            outputType="png"
            list-type="picture"
            :fixedBox="option.fixedBox"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :outputSize="option.outputSize"
            @realTime="realTime"
          >
          </vueCropper>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24" v-if="previews.url || option.image">
          <div class="prewArea">
            <div class="preview" :style="previews.div">
              <img :src="previews.url" :style="previews.img">
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-upload
            ref="fileUpload"
            class="elUpload"
            :action="website.domain"
            :data="QiniuData"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="changeAvatar"
            :http-request="httpRequest">
            <el-button type="primary">changeImg</el-button>
            </el-upload>
        </el-col>
        <el-col :span="3" v-if="option.image">
          <!-- 放大 -->
          <el-button type="primary" @click="changeScale(1)">+</el-button>
        </el-col>
        <el-col :span="3" v-if="option.image">
          <!-- 缩小 -->
          <el-button type="primary" @click="changeScale(-1)">-</el-button>
        </el-col>
        <el-col :span="3" v-if="option.image">
          <!-- 左旋转 -->
          <el-button type="primary" @click="rotateLeft">rotateLeft</el-button>
        </el-col>
        <el-col :span="3" v-if="option.image">
          <!-- 右旋转 -->
          <el-button type="primary" @click="rotateRight">rotateRight</el-button>
        </el-col>
        <el-col :span="4" v-if="option.image">
          <!-- 上传 -->
          <el-button type="primary" @click="uploadImg()">upload</el-button>
        </el-col>
        <el-col :span="4" v-if="option.image">
          <!-- 取消 -->
          <el-button type="primary" @click="clearModel()">clear</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="footer-btn">
      <div class="scope-btn">
        <div class="loadImg">
        </div>
      </div>
    </div>
  </el-dialog>
</template>
 
<script>
import { mapGetters } from 'vuex'
export default {
  name: "vue-cropper-banner",
  data() {
    return {
      QiniuData: {
        // key: "", //图片名字处理
        token: '' //七牛云token
      },
      imgType: 'blob',
      previews: {},
      option: {
        outputSize: 1,
        full: false,
        autoCrop: true,
        fixedBox: true,
        autoCropWidth: 1150,
        autoCropHeight: 300,
        image: null, // 需要裁剪的图片
      },
      isShowModel: false,

      uploadFile: '', // 裁剪后的文件
    }
  },
  computed: {
    ...mapGetters(['website'])
  },
  mounted() {
    this.getToken()
  },
  methods: {
    changeAvatar(file) {
      const { raw } = file
      this.openCropper(raw);
    },
    openCropper(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Upload file size cannot exceed 2MB!')
        return false
      }
      var reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        this.option.image = data;
      };
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file)
    },

    // 预览
    realTime (data) {
      this.previews = data;
    },

    // 放大缩小
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },

    // 左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },

    // 右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },

    // 上传
    uploadImg () {
      if (this.imgType == 'blob') {
        this.$refs.cropper.getCropBlob((data) => {
          this.uploadFile = data;
          this.$refs.fileUpload.submit();
        })
      } else {
        this.$refs.cropper.getCropData((data) => {
          this.uploadFile = data;
          this.$refs.fileUpload.submit();
        })
      }
    },
    // submit 之后会触发此方法
    httpRequest (request) {
      let files = {};
      
      const { action, data, filename } = request;
      // 新建formDate对象
      let formData = new FormData();
      for (let key in data) {
        formData.append(key, data[key]);
      }
      // 文件单独push,第三个参数指定上传的文件名
      formData.append(filename, this.uploadFile, data.fileName);
      axios({
        headers: {
          contentType: 'multipart/form-data' // 需要指定上传的方式
        },
        url: action,
        method: 'post',
        data: formData,
        timeout: 200000000 // 防止文件过大超时
      }).then(res => {
        this.closeModel(false)
        this.$emit('updateImage', `${this.website.qiniuaddr}${res.data.key}`)
      }).catch(err => {
        this.$message({
          message: 'upload error',
          type: 'error'
        })
        this.$store.dispatch('LogOut').then(() => {
          this.$router.push({ path: '/login' }) // In order to re-instantiate the vue-router object to avoid bugs
        })
      })
    },
    clearModel() {
      this.option = {
        outputSize: 1,
        full: false,
        autoCrop: true,
        fixedBox: true,
        autoCropWidth: 215,
        autoCropHeight: 180,
        image: null,
      };
      this.previews = {}
      if(this.option.image) {
        this.$refs['cropper'].imgs = "";
      }
    },

    closeModel(b) {
      this.isShowModel = b
    },
    getToken() {
      // 请求后台拿七牛云token
      this.$store.dispatch('GetImgToken').then(res => {
        this.QiniuData.token = res
      })
    }
  },
}
</script>
<style lang="scss" scoped>
  .scropper {
    .cropper_content {
      .vue-cropper {
        height: 500px;
        zoom: .4;
        .cropper-crop-box {
          width: 200px;
          height: 200px;
        }
        .cropper-modal {
          background: url("data:image/png")!important;
        }
      }
      .prewArea {
        margin: 35px;
        overflow: hidden;
        zoom: 0.5;
        flex: 1;
        -webkit-flex: 1;
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        -webkit-justify-content: center;
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMzTjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");
        .preview{
          overflow: hidden;
          /*margin-left: 40px;*/
          img {
            max-height: 1000px!important;
          }
        }
      }
      .el-button {
        margin-top: 10px;
        width: 100%;
        height: 40px;
        font-size: 14px;
        text-align: center;
        padding: 0;
      }
    }
  }
  .jxf-upload {
    .btn {
      display: inline-block;
      width: 100%;
      cursor: pointer;
    }
    .imageArea {
      position: relative;
    }
  }
</style>
<style lang="scss">
.scropper {
  .el-dialog {
    width: 800px!important;
    .el-dialog__body {
      padding-top: 10px;
    }
    .cropper_content{
      .elUpload {
        width: 100%;
        .el-upload {
          width: 100%;
        }
      }
    }
  }
}
</style>