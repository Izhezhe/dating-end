<template>
  <div class="app-container">
    <zz-upload></zz-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  components: {
    'zz-upload': () => import('@/components/zz-upload')
  }
}
</script>