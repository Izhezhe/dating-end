<template>
  <div class="app-container">
    系统配置
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { paramGet } from '@/api/system'
export default {
  name: 'sys-config',
  data() {
    return {
      tableData: []
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created() {
    // this.getList()
  },
  methods: {
    getList() {
      paramGet({code: this.roles}).then(res => {
        console.log(res)
      })
    }
  }
}
</script>