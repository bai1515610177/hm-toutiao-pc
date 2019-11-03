<template>
  <el-select :value="value" @change="fn" placeholder="请选择" clearable>
    <el-option v-for="item in channelOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'my-channel',
  props: ['value'],
  data () {
    return {
      channelOptions: []
    }
  },
  created () {
    this.getchannelOptions()
  },
  methods: {
    // 获取频道选项数据
    async getchannelOptions () {
      // 获取数据
      const {
        data: { data }
      } = await this.$http.get('channels')
      // 赋值getchannelOption
      this.channelOptions = data.channels
    },

    // 频道改变函数fn
    fn (channelId) {
      // 清空‘’改成null
      if (channelId === '') channelId = null
      // 把ID提交给父组件
      this.$emit('input', channelId)
    }
  }
}
</script>

<style>

</style>
