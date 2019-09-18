<template>
  <div class="app-container">
    <div class="wrapper">
      <el-row :gutter="10">
        <el-col :span="7">
          <div class="">
            <el-button class="m0" size="small" @click="handleAdd()">添加</el-button>
          </div>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" size="mini" :data="tableData" border stripe class="mt">
        <el-table-column label="序号" prop="sort" width="70"></el-table-column>
        <el-table-column label="菜单名称" prop="name"></el-table-column>
        <el-table-column label="页面路径" prop="pageUrl"></el-table-column>
        <el-table-column label="图标" prop="icon"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link :underline="false" type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-link>
            <el-link :underline="false" type="primary" size="small" @click="handleDelete(scope.row.id)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增、编辑 -->
    <el-dialog :title="operTitle[operType]" :visible.sync="operVisible">
      <el-form ref="operForm" :model="operData" :rules="operRules" label-width="100px">
        <el-form-item label="上级菜单" prop="parentId">
          <treeselect 
            @select="getPaths"
            v-model="operData.parentId"
            :options="menuTree"
            :normalizer="normalizer"
            placeholder="请选择上级"/>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="operData.name"></el-input>
        </el-form-item>
        <el-form-item label="页面路径" prop="pageUrl">
          <el-input v-model="operData.pageUrl"></el-input>
        </el-form-item>
        <el-form-item label="序号" prop="sort">
          <el-input v-model="operData.sort"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="operData.icon"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="operData.remark"></el-input>
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
export default {
  name: 'account',
  data() {
    return {
      tableData: [],

      // 新增、编辑
      operVisible: false,
      operType: 'add',
      operTitle: {
        add: '添加账号',
        edit: '编辑账号'
      },
			pather: '',
      operData: {
        parentId: null, // 父id
        name: '', // 菜单名称
        path: '', // path
        pageUrl: '', // 访问路径
        icon: '', // icon
        sort: '', // 排序
        remark: '', // 备注
      },
      operRules: {
        parentId: [{ required: true, validator: validatePass,trigger: 'change' }],
        name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {

    }
  }
}
</script>