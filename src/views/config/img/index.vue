<template>
  <div class="app-container">
    img
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { paramGet, paramUpdate } from '@/api/system'
export default {
  name: 'sys-config',
  data() {
    return {
      // 查询条件
      filters: {
        pageNumber: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],

      // 编辑
      operVisible: false,
      addValue: '',
      operData: {},
      operRules: {
        remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }, { max: 16, message: '备注最长为16位', trigger: 'blur' }],
        value: [{ required: true, message: '值不能为空', trigger: 'blur' }],
      }
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      paramGet().then(res => {
        this.tableData = res.datas.pageData
        this.total = res.datas.totalElements
      })
    },

     // 编辑
    handleEdit(row) {
      this.operVisible = true
      this.operData = JSON.parse(JSON.stringify(row))
      this.addValue = ''
    },
    // 保存
    operSave(formName) {
      this.$refs[formName].validate((valid) => {
				if(valid) {
          paramUpdate(this.operData).then(res => {
            this.$message({
              message: res.repMsg,
              type: 'success'
            })
            this.operVisible = false
            this.getList(true)
          })
        }
      })
    },

  }
}
</script>