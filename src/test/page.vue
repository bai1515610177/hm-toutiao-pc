<template>
  <div class="page">
    <!-- 头 -->
    <!-- <p>header</p> -->
    <!-- 内容 -->

    <!-- 默认插槽 -->
    <!-- <slot>xxx</slot> -->

    <!-- 后备内容 -->
    <!-- <slot>哈哈哈哈哈哈啊哈哈哈</slot> -->

    <!-- 具名插槽 -->
    <!-- <div>
      <slot name="content">后备内容</slot>
    </div> -->

    <!-- 作用域插槽 -->
    <!-- pn自定义属性 -->
    <div>
      <slot name="content" :pn='pageName' test='测试'>后备内容</slot>
    </div>

    <!-- 尾 -->
    <!-- <p>
      <slot name="footer">后备尾</slot>
    </p> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      pageName: '组件内部数据',
      pageName1: 'xxx'
    }
  }
}
</script>

<style>
</style>
