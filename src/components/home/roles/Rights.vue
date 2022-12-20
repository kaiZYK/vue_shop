<template>
  <div>
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片部分 -->
    <el-card>
      <!-- 表格部分 -->
      <el-table :data="RoleDataList" border stripe style="width: 100%">
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="权限路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <!-- scope.row -->
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == 1">
              二级
            </el-tag>
            <el-tag type="warning" v-else-if="scope.row.level == 2">
              三级
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data() {
    return {
      // 权限列表数据
      RoleDataList: [],
    };
  },
  components: {},
  props: {},
  methods: {
    // 获取权限列表数据
    async getRoleDataList() {
      // 发送请求
      let { data: res } = await this.$http.get(`/rights/list`);
      if (res.meta.status == 200) {
        // 设置权限列表数据
        this.RoleDataList = res.data;
        // console.log(this.RoleDataList);
      } else {
        this.$message.error("获取权限列表数据失败");
      }
    },
  },
  computed: {},
  watch: {},
  mounted() {
    // 获取权限列表数据
    this.getRoleDataList();
  },
};
</script>

<style scoped lang="less"></style>
