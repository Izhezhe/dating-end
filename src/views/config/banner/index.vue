<template>
  <div class="app-container">
    <div class="wrapper">
      <el-row :gutter="23" class="mb">
        <el-col>
          <div class="fr">
            <el-button size="small" type="primary" @click="handleAdd()">添加</el-button>
          </div>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" size="mini" :data="tableData" border stripe>
        <el-table-column label="排序序号" prop="sort" width="140"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <el-image :src="scope.row.imageUrl" fit="contain" class="upload-img" lazy></el-image>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link :underline="false" size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-link>
            <el-link :underline="false" size="small" type="primary" @click="handleDelete(scope.row.id)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-row class="toolbar toolbar-bottom" v-if="total!=0">
        <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="filters.pageNumber" :page-size="filters.pageSize" :total="total" style="float:right;">
        </el-pagination>
      </el-row>
    </div>

    <!-- 新增、编辑 -->
    <el-dialog :title="operTitle[operType]" :visible.sync="operVisible">
      <el-form ref="operForm" :model="operData" :rules="operRules" label-width="150px">
        <el-form-item label="排序序号" prop="sort">
          <el-input-number v-model="operData.sort" :min="1" :max="100000"></el-input-number>
        </el-form-item>
        <el-form-item label="图片" prop="imageUrl">
          <el-image :src="operData.imageUrl" fit="contain" v-if="operData.imageUrl" class="upload-img"></el-image>
          <el-button size="small" type="primary" @click="openBannerCropper()">选择图片</el-button>
          <p style="color: red;">请上传 1150px * 300px 的图片</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="operVisible = false">取 消</el-button>
        <el-button type="primary" @click="operSave('operForm')">确 定</el-button>
      </span>
    </el-dialog>

    <zzCropper ref="vueBannerCropper" @updateImage="updateImage"></zzCropper>
  </div>
</template>

<script>
import zzCropper from '@/components/zz-cropper/banner'
import { getBannerApi, addBannerApi, editBannerApi, delBannerApi } from '@/api/config'
export default {
  name: 'chat',
  data() {
    return {
      // 查询条件
      filters: {
        pageNumber: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],

      // 新增、编辑
      operVisible: false,
      operType: 'add',
      imgAccept: '.png, .jpg, .jpeg',
      operTitle: {
        add: '添加背景图片',
        edit: '编辑背景图片'
      },
      operData: {
        sort: '', // 序号
        imageUrl: '', // 图片
      },
      operRules: {
        sort: [{ required: true, message: '序号不能为空', trigger: 'blur' }],
        imageUrl: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getBannerApi(this.filters).then(res => {
        this.tableData = res.datas.pageData
        this.total = res.datas.totalElements
      })
    },
    handleCurrentChange(val) {
      this.filters.pageNumber = val
      this.getList()
    },

    // 新增
    handleAdd() {
      this.operVisible = true
      this.operType = 'add'
      this.resetData()
    },
    // 编辑
    handleEdit(row) {
      this.operVisible = true
      this.operType = 'edit'
      this.operData = JSON.parse(JSON.stringify(row))
    },
    // 保存
    operSave(formName) {
      this.$refs[formName].validate((valid) => {
				if(valid) {
          if (this.operType == 'add') {
            addBannerApi(this.operData).then(res => {
              this.$message({
                message: res.repMsg,
                type: 'success'
              })
              this.operVisible = false
              this.getList(true)
            })
          } else {
            editBannerApi(this.operData).then(res => {
              this.$message({
                message: res.repMsg,
                type: 'success'
              })
              this.operVisible = false
              this.getList()
            })
          }
        }
      })
    },
    // 删除
    handleDelete(id) {
      this.$confirm('确定删除？', '提示', {type: 'warning'}).then(() => {
        delBannerApi({id: id}).then(res => {
          this.$message({
            message: res.repMsg,
            type: 'success'
          })
          this.getList(true)
        })
      })
    },
    resetData() {
      this.operData = {
        sort: '', // 序号
        imageUrl: '', // 图片
      }
    },
    openBannerCropper() {
      this.$refs.vueBannerCropper.closeModel(true)
    },
    updateImage(url) {
      this.operData.imageUrl = url
    }
  },
  components: {
    zzCropper
  }
}
</script>

<style scoped>
  .upload-img {
    display: inline-block;
    vertical-align: middle;
    width: 230px;
    height: 60px;
    border: 1px solid #eee;
  }
  .upload {
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
  }
</style>