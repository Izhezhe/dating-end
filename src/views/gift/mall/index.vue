<template>
  <div class="app-container">
    <div class="wrapper">
      <el-row :gutter="23" class="mb">
        <el-col :span="6">
          <el-input size="small" v-model="filters.credits" placeholder="请输入价格"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button size="small" type="primary" @click="getList(true)">查询</el-button>
          <el-button size="small" @click="filtersReset()">重置</el-button>
        </el-col>
        <el-col :span="12">
          <div class="fr">
            <el-button size="small" type="primary" @click="handleAdd()">添加</el-button>
          </div>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" size="mini" :data="tableData" border stripe>
        <el-table-column label="序号" type="index" width="70"></el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <el-image :src="scope.row.imageUrl" fit="contain" class="upload-img"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="价格（credits）" prop="credits"></el-table-column>
        <el-table-column label="商品介绍" prop="description"></el-table-column>
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
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="operData.name"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="imageUrl">
          <el-image :src="operData.imageUrl" fit="contain" v-if="operData.imageUrl" class="upload-img"></el-image>
          <zzUpload @updateImage="updateImage" class="upload" />
        </el-form-item>
        <el-form-item label="价格（credits）" prop="credits">
          <el-input-number v-model="operData.credits" :min="1" :max="100000"></el-input-number>
        </el-form-item>
        <el-form-item label="商品介绍" prop="description">
          <el-input autosize type="textarea" v-model="operData.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="operVisible = false">取 消</el-button>
        <el-button type="primary" @click="operSave('operForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import zzUpload from '@/components/zz-upload'
import { getGiftApi, addGiftMallApi, editGiftApi, delGiftApi } from '@/api/gift'
export default {
  name: 'mall',
  data() {
    return {
      // 查询条件
      filters: {
        pageNumber: 1,
        pageSize: 10,
        credits: '',
        type: 'mall',
      },
      total: 0,
      tableData: [],

      // 新增、编辑
      operVisible: false,
      operType: 'add',
      operTitle: {
        add: '添加商城礼物',
        edit: '编辑商城礼物'
      },
      operData: {
        name: '', // 名称
        imageUrl: '', // 图片
        credits: '', // 价格
        description: '', // 介绍
      },
      operRules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        imageUrl: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
        credits: [{ required: true, message: '价格不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '介绍不能为空', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(b=false) {
      if(b) {
        this.filters.pageNumber = 1
      }
      getGiftApi(this.filters).then(res => {
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
            addGiftMallApi(this.operData).then(res => {
              this.$message({
                message: res.repMsg,
                type: 'success'
              })
              this.operVisible = false
              this.getList(true)
            })
          } else {
            editGiftApi(this.operData).then(res => {
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
        delGiftApi({id: id}).then(res => {
          this.$message({
            message: res.repMsg,
            type: 'success'
          })
          this.getList(true)
        })
      })
    },
    filtersReset() {
      this.filters = {
        pageNumber: 1,
        pageSize: 10,
        credits: '',
        type: 'mall',
      }
      this.getList(true)
    },
    resetData() {
      this.operData = {
        name: '', // 名称
        imageUrl: '', // 图片
        credits: '', // 价格
        description: '', // 介绍
      }
    },
    updateImage(url) {
      this.operData.imageUrl = url
    }
  },
  components: {
    zzUpload
  }
}
</script>

<style scopr>
  .upload-img {
    display: inline-block;
    vertical-align: middle;
    width: 100px;
    height: 100px;
  }
  .upload {
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
  }
</style>