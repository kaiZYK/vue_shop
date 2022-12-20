<template>
  <div>
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片部分 -->
    <el-card> </el-card>
  </div>
</template>

<script>
export default {
  name: "Orders",
  data() {
    return {};
  },
  components: {},
  props: {},
  methods: {},
  computed: {},
  watch: {},
};
</script>

<style scoped lang="less"></style>
